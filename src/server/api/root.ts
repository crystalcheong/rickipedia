import { favouritesRouter, rickAndMortyRouter } from "@/server/api/routers"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  rickAndMorty: rickAndMortyRouter,
  favourites: favouritesRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
