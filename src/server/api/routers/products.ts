import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { and, eq, sql } from "drizzle-orm";
import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { s3 } from "~/server/db";
import { images, products } from "~/server/db/schema";

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
    getProductPage: publicProcedure
    .input(z.object({
        productId: z.string().min(1),
    }))
    .query( async ({ctx, input}) => {
        // Get product Information
        const id = parseInt(input.productId);
        const productRow = await ctx.db.select().from(products).innerJoin(images, eq(products.id, images.product_id)).where(eq(products.id, id));
        // Get PresignedUrl
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: productRow.at(0)?.image.image_url,
        });
        const url = await getSignedUrl(s3, command, {
            expiresIn: 3600,
        });
        const product = productRow.at(0)?.product;
        return {product, url};

    })
});