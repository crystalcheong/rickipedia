import { z } from "zod"

import {
  CharacterGender,
  CharacterSpecies,
  CharacterStatus,
  RickAndMortyClient,
} from "@/data/clients/rickAndMorty"
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc"

const client: RickAndMortyClient = RickAndMortyClient.getInstance()

export const rickAndMortyRouter = createTRPCRouter({
  getAllCharacters: publicProcedure
    .input(
      z.object({
        pagination: z
          .object({
            page: z.number().default(1),
          })
          .optional(),
        filters: z
          .object({
            name: z.string().trim().optional(),
            type: z.string().trim().optional(),
            status: z.nativeEnum(CharacterStatus).optional(),
            species: z.nativeEnum(CharacterSpecies).optional(),
            gender: z.nativeEnum(CharacterGender).optional(),
          })
          .optional(),
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
        pagination: z
          .object({
            page: z.number().default(1),
          })
          .optional(),
        filters: z
          .object({
            name: z.string().trim().optional(),
            type: z.string().trim().optional(),
            dimension: z.string().trim().optional(),
          })
          .optional(),
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
        pagination: z
          .object({
            page: z.number().default(1),
          })
          .optional(),
        filters: z
          .object({
            name: z.string().trim().optional(),
            episode: z.string().trim().optional(),
          })
          .optional(),
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
