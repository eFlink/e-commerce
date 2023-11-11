import { z } from "zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { images } from "~/server/db/schema";

import { createPresignedPost } from '@aws-sdk/s3-presigned-post';

import { TRPCError } from "@trpc/server";
import { s3 } from "~/server/db";
import { randomUUID } from "crypto";

export const imageRouter = createTRPCRouter({
    getPreSignedUrl: adminProcedure
    .input(z.object({
            fileName: z.string().min(1),
            fileType: z.string().min(1),
    }))
    .mutation( async ({ ctx, input }) => {
        // Add image to product images
        const newMedia = await ctx.db.insert(images).values({
            name: input.fileName,
        });
        if (!newMedia) {
            throw new TRPCError({
                code: "INTERNAL_SERVER_ERROR",
            })
        }
        const imageId = randomUUID();
        const {url, fields } = await createPresignedPost(s3, {
            Bucket: process.env.S3_BUCKET_NAME!,
            Key: imageId,
            Fields: {
                // acl: 'public-read',
                // 'Content-Type': input.fileType,
                key: imageId,
            },
            Expires: 600, // Seconds
            Conditions: [
                ["starts-with", "$Content-Type", "image/"],
                ['content-length-range', 0, 1048576], // up to 1 MB
            ],
        });
        return {url, fields};
    }),
});