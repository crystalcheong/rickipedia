//#endregion  //*======== PAGINATION ===========
export interface PaginationInfo {
  page: number
}
export const DefaultPaginationInfo: PaginationInfo = {
  page: 1,
}
//#endregion  //*======== PAGINATION ===========

//#endregion  //*======== SCHEMAS ===========
export enum CharacterStatus {
  alive = "alive",
  dead = "dead",
  unknown = "unknown",
}
export enum CharacterSpecies {
  human = "human",
  alien = "alien",
  humanoid = "humanoid",
  poopybutthole = "poopybutthole",
}
export enum CharacterGender {
  male = "male",
  female = "female",
  genderless = "genderless",
  unknown = "unknown",
}

export const SchemaTypes = ["character", "episode", "location"] as const
export type SchemaType = (typeof SchemaTypes)[number]

export interface BaseSchema {
  id: number
  name: string
  type: string
  url: string
  created: string
}

export interface Character extends BaseSchema {
  status: CharacterStatus
  species: CharacterSpecies
  gender: CharacterGender
  origin: {
    name: string
    url: string
  }
  location: {
    name: string
    url: string
  }
  image: string
  episode: string[]
}

export interface Location extends BaseSchema {
  dimension: string
  residents: string[]
}

export interface Episode extends Omit<BaseSchema, "type"> {
  air_date: string
  episode: string
  characters: string[]
}
//#endregion  //*======== SCHEMAS ===========

//#endregion  //*======== FILTERS ===========
export interface CharacterFilterInfo {
  name?: BaseSchema["name"]
  status?: Character["status"]
  species?: Character["species"]
  gender?: Character["gender"]
}

export interface LocationFilterInfo {
  name?: BaseSchema["name"]
  type?: string
  dimension?: string
}

export interface EpisodeFilterInfo {
  name?: BaseSchema["name"]
  episode?: string
}
//#endregion  //*======== FILTERS ===========
