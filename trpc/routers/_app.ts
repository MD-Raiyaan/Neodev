import { createTRPCRouter } from "../init";
import ProjectRouter from "@/modules/projects/server/procedures";
import MessageRouter from "@/modules/messages/server/procedures";
import { usageRouter } from "@/modules/usage/server/procedures";
export const appRouter = createTRPCRouter({
   messages:MessageRouter,
   projects:ProjectRouter,
   usage:usageRouter,
});
// export type definition of API
export type AppRouter = typeof appRouter;
