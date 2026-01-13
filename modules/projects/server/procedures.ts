import { z } from "zod";
import { protectedProcedure, createTRPCRouter } from "@/trpc/init";
import prisma from "@/lib/prisma";
import { inngest } from "@/inngest/client";
import { generateSlug } from "random-word-slugs";
import { consumeCredits } from "@/lib/usage";
import { TRPCError } from "@trpc/server";

const ProjectRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        Value: z
          .string()
          .min(1, { message: "Value is required" })
          .max(1000, { message: "Value is too long" }),
      })
    )
    .mutation(async ({ input, ctx }) => {
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
      const createProject = await prisma.project.create({
        data: {
          userId: ctx.auth.userId,
          name: generateSlug(2, { format: "kebab" }),
          messages: {
            create: {
              content: input.Value,
              role: "USER",
              type: "RESULT",
            },
          },
        },
      });
      await inngest.send({
        name: "CodeAgent/run",
        data: {
          text: input.Value,
          projectId: createProject.id,
        },
      });
      return createProject;
    }),
  getMany: protectedProcedure.query(async ({ ctx }) => {
    const projects = await prisma.project.findMany({
      where: {
        userId: ctx.auth.userId,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
    return projects;
  }),
  getOne: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, { message: "projectId is required" }),
      })
    )
    .query(async ({ input, ctx }) => {
      const project = await prisma.project.findUnique({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      });
      return project;
    }),
});

export default ProjectRouter;
