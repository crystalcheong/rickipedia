import { authMiddleware } from "@clerk/nextjs"
export default authMiddleware({
  // Public routes are routes that don't require authentication
  publicRoutes: ["/(.*)", "/public", "/api(.*)"],
})

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
}
