import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { images, products, productsRelations } from "~/server/db/schema";

export const productRouter = createTRPCRouter({
    getLatestWithImages: publicProcedure.query( async ({ ctx }) => {
        const table = ctx.db.select().from(products).innerJoin(images, and(
            eq(products.id, images.product_id),
            eq(images.main_photo, true)
        )).limit(4);
        return table;
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