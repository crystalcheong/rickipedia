import { createId } from "@paralleldrive/cuid2"
import { TRPCError } from "@trpc/server"

import {
  createSchemaFavourite,
  deleteSchemaFavourite,
  getUserFavourites,
  getUserSchemaFavourites,
} from "@/data/db/favourites/model"
import { Favourite } from "@/data/db/favourites/schema"
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc"

export const favouritesRouter = createTRPCRouter({
  create: protectedProcedure
    .input(Favourite.pick({ schemaType: true, schemaId: true }))
    .mutation(async ({ input, ctx }) => {
      if (!ctx.auth.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

      return await createSchemaFavourite({
        id: createId(),
        user_id: ctx.auth.userId,
        schemaType: input.schemaType,
        schemaId: input.schemaId,
      })
    }),
  delete: protectedProcedure
    .input(Favourite.pick({ schemaId: true, schemaType: true }))
    .mutation(async ({ input, ctx }) => {
      // if no user_id in context, throw an error
      if (!ctx.auth.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

      return await deleteSchemaFavourite({
        schemaId: input.schemaId,
        schemaType: input.schemaType,
        user_id: ctx.auth.userId,
      })
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    // if no user_id in context, throw an error
    if (!ctx.auth.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

    return await getUserFavourites({ user_id: ctx.auth.userId })
  }),
  getAllBySchema: protectedProcedure
    .input(Favourite.pick({ schemaType: true }))
    .query(async ({ input, ctx }) => {
      // if no user_id in context, throw an error
      if (!ctx.auth.userId) throw new TRPCError({ code: "UNAUTHORIZED" })

      return await getUserSchemaFavourites({
        schemaType: input.schemaType,
        user_id: ctx.auth.userId,
      })
    }),
})
