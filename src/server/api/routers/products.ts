import { eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { images, products, productsRelations } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
    getLatest: publicProcedure.query( async ({ ctx }) => {
        return ctx.db.query.products.findMany({
            limit: 4,
        });
    }),

    add:adminProcedure 
    .input(z.object({ 
        name: z.string().min(1),
        description: z.string().min(1),

    }))
    .mutation(async ({ ctx, input}) => {
        await ctx.db.insert(products).values({
            name: input.name,
            description: input.description,
        });
        const product = await ctx.db.select().from(products).where(eq(products.name, input.name));
        return product.at(0);
    }),
});