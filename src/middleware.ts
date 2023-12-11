import { authMiddleware } from "@clerk/nextjs";
 
export default authMiddleware({
      publicRoutes: ['/', '/product/:subpath*'],

});
 
export const config = {
      matcher: ['/((?!.+\\.[\\w]+$|_next).*)'],
};