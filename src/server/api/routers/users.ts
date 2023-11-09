import { z } from "zod";
import { adminProcedure, createTRPCRouter } from "~/server/api/trpc";

export const userRouter = createTRPCRouter({
    isAdmin: adminProcedure
    .output(z.object({
        isAdmin: z.boolean(),
    }))
    .query(() => {
        return {isAdmin: true};
    }),
});