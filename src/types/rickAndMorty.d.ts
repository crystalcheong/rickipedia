export declare namespace RickAndMorty {
  //#endregion  //*======== PAGINATION ===========
  interface PaginationInfo {
    page: number
  }
  //#endregion  //*======== PAGINATION ===========

  //#endregion  //*======== SCHEMAS ===========
  interface BaseSchema {
    id: number
    name: string
    type: string
    url: string
    created: string
  }

  interface Character extends BaseSchema {
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

  interface Location extends BaseSchema {
    dimension: string
    residents: string[]
  }

  interface Episode extends Omit<BaseSchema, "type"> {
    air_date: string
    episode: string
    characters: string[]
  }

  type SchemaType = "character" | "episode" | "location"
  //#endregion  //*======== SCHEMAS ===========

  //#endregion  //*======== FILTERS ===========
  interface CharacterFilterInfo {
    name?: BaseSchema["name"]
    status?: Character["status"]
    species?: Character["species"]
    gender?: Character["gender"]
  }

  interface LocationFilterInfo {
    name?: BaseSchema["name"]
    type?: string
    dimension?: string
  }

  interface EpisodeFilterInfo {
    name?: BaseSchema["name"]
    episode?: string
  }
  //#endregion  //*======== FILTERS ===========
}
