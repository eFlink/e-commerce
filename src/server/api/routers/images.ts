import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { images } from "~/server/db/schema";

import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { GetObjectCommand } from "@aws-sdk/client-s3";


import { TRPCError } from "@trpc/server";
import { s3 } from "~/server/db";
import { randomUUID } from "crypto";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

export const imageRouter = createTRPCRouter({
    getPreSignedPost: adminProcedure
    .input(z.object({
            fileName: z.string().min(1),
            fileType: z.string().min(1),
    }))
    .mutation( async ({ ctx, input }) => {
        // Add image to product images
        const imageKey = randomUUID();
        const {url, fields } = await createPresignedPost(s3, {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: imageKey,
            Fields: {
                key: imageKey,
            },
            Expires: 600, // Seconds
            Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                ['content-length-range', 0, 1048576], // up to 1 MB
            ],
        });
        return {url, fields, imageKey};
    }),
    getPresignedUrl: publicProcedure
    .input(z.object({
        key: z.string().min(1),
    }))
    .query( async ({ ctx, input }) => {
        const command = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: input.key,
        });
        const url = await getSignedUrl(s3, command, {
            expiresIn: 3600,
        });
        return {url};
    }),
    addImage: adminProcedure
    .input(z.object({
        fileName: z.string().min(1),
        productId: z.number().min(1),
        imageKey: z.string().min(1),
    }))
    .mutation( async ({ ctx, input}) => {
        const newMedia = await ctx.db.insert(images).values({
            name: input.fileName,
            product_id: input.productId,
            image_url: input.imageKey,
        });
        if (!newMedia) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            })
        }
        return newMedia;
    })
});