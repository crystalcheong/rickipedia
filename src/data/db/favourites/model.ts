import { TRPCError } from "@trpc/server"
import { and, desc, eq } from "drizzle-orm"

import { type Favourite, favourites } from "@/data/db/favourites/schema"
import { db } from "@/server/db"
import { logger } from "@/utils"

export const createFavourite = async (favourite: Favourite) =>
  await db.insert(favourites).values(favourite)

export const createSchemaFavourite = async (favourite: Favourite) =>
  await db.transaction(async (tx) => {
    const { schemaType, schemaId, user_id } = favourite

    // get schema favourite
    const [schemaFavourite] = await getSchemaFavourites({
      schemaType,
      schemaId,
      user_id,
    })

    logger({ breakpoint: "[model.ts:21]" }, "createSchemaFavourite", {
      schemaFavourite,
      favourite,
    })
    if (!!schemaFavourite) {
      tx.rollback()
      return new TRPCError({
        code: "FORBIDDEN",
        message: "Unable to duplicate favourite creation",
      })
    }

    return createFavourite(favourite)
  })

export const deleteFavourite = async ({ id }: Pick<Favourite, "id">) =>
  await db.delete(favourites).where(eq(favourites.id, id))

export const deleteSchemaFavourite = async ({
  schemaType,
  schemaId,
  user_id,
}: Pick<Favourite, "schemaType" | "schemaId" | "user_id">) =>
  await db.transaction(async (tx) => {
    // get schema favourite
    const [schemaFavourite] = await getSchemaFavourites({
      schemaType,
      schemaId,
      user_id,
    })
    if (!schemaFavourite) {
      tx.rollback()
      return new TRPCError({
        code: "FORBIDDEN",
        message: "Unable to duplicate favourite deletion",
      })
    }

    return deleteFavourite({ id: schemaFavourite.id })
  })

export const getAllFavourites = async () =>
  await db.select().from(favourites).orderBy(desc(favourites.created_at))

export const getFavourite = async ({ id }: Pick<Favourite, "id">) =>
  await db.select().from(favourites).where(eq(favourites.id, id))

export const getSchemaFavourites = async ({
  schemaType,
  schemaId,
  user_id,
}: Pick<Favourite, "schemaType" | "schemaId" | "user_id">) =>
  await db
    .select()
    .from(favourites)
    .where(
      and(
        eq(favourites.user_id, user_id),
        eq(favourites.schemaId, schemaId),
        eq(favourites.schemaType, schemaType)
      )
    )
    .orderBy(desc(favourites.created_at))

export const getUserFavourites = async ({
  user_id,
}: {
  user_id: Favourite["user_id"]
}) =>
  await db
    .select()
    .from(favourites)
    .where(eq(favourites.user_id, user_id))
    .orderBy(desc(favourites.created_at))

export const getUserSchemaFavourites = async ({
  schemaType,
  user_id,
}: Pick<Favourite, "schemaType" | "user_id">) =>
  await db
    .select()
    .from(favourites)
    .where(
      and(
        eq(favourites.user_id, user_id),
        eq(favourites.schemaType, schemaType)
      )
    )
    .orderBy(desc(favourites.created_at))
