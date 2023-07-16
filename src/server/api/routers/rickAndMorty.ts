import { z } from "zod"

import { RickAndMortyClient } from "@/data/clients/rickAndMorty"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"
import {
  CharacterFilterInfo,
  EpisodeFilterInfo,
  LocationFilterInfo,
  PaginationInfo,
} from "@/types/rickAndMorty"

const client: RickAndMortyClient = RickAndMortyClient.getInstance()

export const rickAndMortyRouter = createTRPCRouter({
  getSchemaLimits: publicProcedure.query(() => client.getSchemaLimits()),

  getAllCharacters: publicProcedure
    .input(
      z.object({
        pagination: PaginationInfo.optional(),
        filters: CharacterFilterInfo.optional(),
      })
    )
    .query(({ input }) =>
      client.getAllCharacters(input.pagination, input.filters)
    ),

  getCharacters: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      })
    )
    .query(({ input }) => client.getCharacters({ ids: input.ids })),

  getAllLocations: publicProcedure
    .input(
      z.object({
        pagination: PaginationInfo.optional(),
        filters: LocationFilterInfo.optional(),
      })
    )
    .query(({ input }) =>
      client.getAllLocations(input.pagination, input.filters)
    ),

  getLocations: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      })
    )
    .query(({ input }) => client.getLocations({ ids: input.ids })),

  getAllEpisodes: publicProcedure
    .input(
      z.object({
        pagination: PaginationInfo.optional(),
        filters: EpisodeFilterInfo.optional(),
      })
    )
    .query(({ input }) =>
      client.getAllEpisodes(input.pagination, input.filters)
    ),

  getEpisodes: publicProcedure
    .input(
      z.object({
        ids: z.array(z.number()),
      })
    )
    .query(({ input }) => client.getEpisodes({ ids: input.ids })),
})
