import { z } from "zod"

//#endregion  //*======== PAGINATION ===========
export const PaginationInfo = z.object({
  page: z.number().int().positive().min(1).default(1),
})
export type PaginationInfo = z.infer<typeof PaginationInfo>
export const DefaultPaginationInfo = {
  page: 1,
} satisfies PaginationInfo

export const PaginationTypes = ["all", "search"] as const
const PaginationType = z.enum(PaginationTypes)
export type PaginationType = z.infer<typeof PaginationType>

const PaginationStates = z.record(PaginationType, PaginationInfo)
export type PaginationStates = z.infer<typeof PaginationStates>
export const InitialPaginationStates = Object.fromEntries(
  PaginationTypes.map((type) => [type, DefaultPaginationInfo])
) satisfies PaginationStates

//#endregion  //*======== PAGINATION ===========

//#endregion  //*======== SCHEMAS ===========
export const CharacterStatuses = ["alive", "dead", "unknown"] as const
const CharacterStatus = z.enum(CharacterStatuses)
export type CharacterStatus = z.infer<typeof CharacterStatus>

export const CharacterSpecimens = [
  "human",
  "alien",
  "humanoid",
  "poopybutthole",
] as const
const CharacterSpecies = z.enum(CharacterSpecimens)
export type CharacterSpecies = z.infer<typeof CharacterStatus>

export const CharacterGenders = [
  "male",
  "female",
  "genderless",
  "unknown",
] as const
const CharacterGender = z.enum(CharacterGenders)
export type CharacterGender = z.infer<typeof CharacterGender>

export const SchemaTypes = ["character", "episode", "location"] as const
const SchemaType = z.enum(SchemaTypes)
export type SchemaType = z.infer<typeof SchemaType>
const SchemaTypeLimits = z.record(SchemaType, z.number().default(0))
export type SchemaTypeLimits = z.infer<typeof SchemaTypeLimits>

export const DefaultSchemaTypeLimits = Object.fromEntries(
  SchemaTypes.map((type) => [type, 0])
) satisfies SchemaTypeLimits

export const BaseSchema = z.object({
  id: z.number(),
  name: z.string(),
  type: z.string(),
  url: z.string(),
  created: z.string(),
})
export type BaseSchema = z.infer<typeof BaseSchema>

export const BaseInfo = z.object({
  name: z.string(),
  url: z.string(),
})
export type BaseInfo = z.infer<typeof BaseInfo>

export const Character = BaseSchema.extend({
  status: CharacterStatus,
  species: CharacterSpecies,
  gender: CharacterGender,
  origin: BaseInfo,
  location: BaseInfo,
  image: z.string(),
  episode: z.string().array(),
})
export type Character = z.infer<typeof Character>

export const Location = BaseSchema.extend({
  dimension: z.string(),
  residents: z.string().array(),
})
export type Location = z.infer<typeof Location>

export const Episode = BaseSchema.omit({ type: true }).extend({
  air_date: z.string(),
  episode: z.string(),
  characters: z.string().array(),
})
export type Episode = z.infer<typeof Episode>

export type ExtendedBaseSchema<T extends BaseSchema | Partial<BaseSchema>> = T &
  Partial<BaseSchema>
export type SchemaPaginationStates<
  T extends Partial<BaseSchema | ExtendedBaseSchema<BaseSchema>>,
> = Record<PaginationType, T[]>

export const getDefaultSchemaPaginationStates = <
  T extends Partial<BaseSchema | ExtendedBaseSchema<BaseSchema>>,
>(): SchemaPaginationStates<T> =>
  Object.fromEntries(
    PaginationTypes.map((type) => [type, [] as T[]])
  ) as SchemaPaginationStates<T>

//#endregion  //*======== SCHEMAS ===========

//#endregion  //*======== FILTERS ===========

export const CharacterFilterInfo = Character.pick({
  name: true,
  status: true,
  species: true,
  gender: true,
}).partial()
export type CharacterFilterInfo = z.infer<typeof CharacterFilterInfo>

export const LocationFilterInfo = Location.pick({
  name: true,
  type: true,
  dimension: true,
}).partial()
export type LocationFilterInfo = z.infer<typeof LocationFilterInfo>

export const EpisodeFilterInfo = Episode.pick({
  name: true,
  episode: true,
}).partial()
export type EpisodeFilterInfo = z.infer<typeof EpisodeFilterInfo>

//#endregion  //*======== FILTERS ===========
