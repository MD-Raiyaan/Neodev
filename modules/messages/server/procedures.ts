import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { TRPCError } from "@trpc/server";
import { consumeCredits } from "@/lib/usage";

const MessageRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        Value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(1000, { message: "Value is too long" }),
        projectId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      
      const existingProject = await prisma.project.findUnique({
        where: {
          id: input.projectId,
          userId: ctx.auth.userId,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }
      
      try {
        await consumeCredits();
      } catch (error) {
        if (error instanceof Error) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Something went wrong",
          });
        } else {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "You have run out of credits",
          });
        }
      }

      const createMessage = await prisma.message.create({
        data: {
          content: input.Value,
          role: "USER",
          type: "RESULT",
          projectId: existingProject.id,
        },
      });
      await inngest.send({
        name: "CodeAgent/run",
        data: {
          text: input.Value,
          projectId: input.projectId,
        },
      });
      return createMessage;
    }),
  getMany: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1, { message: "projectId is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const messages = await prisma.message.findMany({
        where: {
          projectId: input.projectId,
          project: {
            userId: ctx.auth.userId,
          },
        },
        include: {
          fragement: true,
        },
        orderBy: {
          updatedAt: "asc",
        },
      });
      return messages;
    }),
});

export default MessageRouter;
