import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { products } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
    getLatest: publicProcedure.query(({ ctx }) => {
        return ctx.db.query.products.findMany({
            limit: 5,
        });
    }),
    add: publicProcedure
    .input(z.object({ 
        name: z.string().min(1),
        description: z.string().min(1)
    }))
    .mutation(async ({ ctx, input}) => {
        await ctx.db.insert(products).values({
            name: input.name,
            description: input.description,
        })
    }),
});