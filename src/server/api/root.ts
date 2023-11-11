import { createTRPCRouter } from "~/server/api/trpc";
import { productRouter } from "./routers/products";
import { userRouter } from "./routers/users";
import { imageRouter } from "./routers/images";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  product: productRouter,
  image: imageRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
