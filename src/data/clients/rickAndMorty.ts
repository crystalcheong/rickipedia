import { getUniqueObjectListwithKeys, HTTP, logger, LogLevel } from "@/utils"

//#endregion  //*======== TYPES ===========

export interface PaginationInfo {
  page: number
}

export interface CharacterFilterInfo {
  name?: string
  status?: Character["status"]
  species?: Character["species"]
  gender?: Character["gender"]
}

export interface LocationFilterInfo {
  name?: string
  type?: string
  dimension?: string
}

export interface EpisodeFilterInfo {
  name?: string
  episode?: string
}

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
//#endregion  //*======== TYPES ===========

//#endregion  //*======== EXPORT ===========
export const DefaultPaginationInfo: PaginationInfo = {
  page: 1,
}
//#endregion  //*======== EXPORT ===========

const Endpoint = `https://rickandmortyapi.com/api`

const Routes: Record<string, string> = {
  getAllCharacters: `/character`,
  getCharacters: `/character/:ids`,

  getAllLocations: `/location`,
  getLocations: `/location/:ids`,

  getAllEpisodes: `/episode/`,
  getEpisodes: `/episode/:ids`,
}

export class RickAndMorty {
  private http: HTTP<typeof Routes>
  private static instance: RickAndMorty

  private constructor() {
    this.http = new HTTP(Endpoint, Routes)
  }

  static getInstance = (): RickAndMorty => {
    if (!this.instance) {
      this.instance = new RickAndMorty()
    }
    return this.instance
  }

  static getUniqueCharacters = (characters: Character[]): Character[] =>
    getUniqueObjectListwithKeys<Character>({
      list: characters,
      keys: ["id"],
    })

  static parseIds = (rawIds?: string | string[]): number[] => {
    if (!rawIds) return []

    const parseId = (i: string) => parseInt(i)
    const toArray = (value: string | string[]) =>
      Array.isArray(value) ? value : value.split(",")

    return toArray(rawIds).map(parseId)
  }

  static getIdsFromUrls = ({
    idUrls,
    type = "character",
  }: {
    idUrls: string[]
    type?: "character" | "episode" | "location"
  }): number[] => {
    const characterUrl = `${Endpoint}/${type}/`
    const ids: string = idUrls.toString().replaceAll(characterUrl, "")
    return this.parseIds(ids)
  }

  getAllCharacters = async (
    pagination: PaginationInfo = DefaultPaginationInfo,
    filters?: Partial<CharacterFilterInfo>
  ): Promise<Character[]> => {
    const hasFilters: boolean = Object.values(filters ?? {}).some((filter) =>
      Boolean(filter)
    )

    const characters: Character[] = []
    const params = {
      page: pagination.page.toString(),
      ...(hasFilters &&
        Object.fromEntries(
          Object.entries(filters ?? {}).filter(([_, v]) => v != null)
        )),
    }
    const url = this.http.path("getAllCharacters", {}, params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return characters
      const result: Record<string, unknown> = (await response.json()) as Record<
        string,
        unknown
      >

      const charactersData: Character[] = (result?.results ?? []) as Character[]
      characters.push(...charactersData)

      logger(
        { breakpoint: "[rickAndMorty.ts:74]" },
        "RickAndMorty/getAllCharacters",
        {
          url: response.url,
          params,
          info: result?.info ?? {},
          count: characters.length,
        }
      )
    } catch (error) {
      logger(
        { breakpoint: "[rickAndMorty.ts:28]", level: LogLevel.Error },
        "RickAndMorty/getAllCharacters",
        url,
        error
      )
    }

    return characters
  }

  getCharacters = async ({ ids }: { ids: number[] }): Promise<Character[]> => {
    const characters: Character[] = []
    if (!ids.length) return characters
    const params = {
      ids: JSON.stringify(ids),
    }
    const url = this.http.path("getCharacters", params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return characters

      const result: unknown[] = (await response.json()) as unknown[]
      const charactersData: Character[] = (result ?? []) as Character[]
      characters.push(...charactersData)

      logger(
        { breakpoint: "[rickAndMorty.ts:158]" },
        "RickAndMorty/getCharacters",
        {
          url: response.url,
          params,
          count: characters.length,
        }
      )
    } catch (error) {
      logger(
        { breakpoint: "[rickAndMorty.ts:165]" },
        "RickAndMorty/getAllCharacters",
        url,
        error
      )
    }

    return characters
  }

  getAllLocations = async (
    pagination: PaginationInfo = DefaultPaginationInfo,
    filters?: Partial<LocationFilterInfo>
  ): Promise<Location[]> => {
    const hasFilters: boolean = Object.values(filters ?? {}).some((filter) =>
      Boolean(filter)
    )

    const locations: Location[] = []
    const params = {
      page: pagination.page.toString(),
      ...(hasFilters &&
        Object.fromEntries(
          Object.entries(filters ?? {}).filter(([_, v]) => v != null)
        )),
    }
    const url = this.http.path("getAllLocations", {}, params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return locations
      const result: Record<string, unknown> = (await response.json()) as Record<
        string,
        unknown
      >

      const locationsData: Location[] = (result?.results ?? []) as Location[]
      locations.push(...locationsData)

      logger(
        { breakpoint: "[rickAndMorty.ts:74]" },
        "RickAndMorty/getAllLocations",
        {
          url: response.url,
          params,
          info: result?.info ?? {},
          count: locations.length,
        }
      )
    } catch (error) {
      logger(
        { breakpoint: "[rickAndMorty.ts:28]", level: LogLevel.Error },
        "RickAndMorty/getAllLocations",
        url,
        error
      )
    }

    return locations
  }

  getLocations = async ({ ids }: { ids: number[] }): Promise<Location[]> => {
    const locations: Location[] = []

    if (!ids.length) return locations
    const params = {
      ids: JSON.stringify(ids),
    }
    const url = this.http.path("getLocations", params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return locations

      const result: unknown[] = (await response.json()) as unknown[]
      const locationsData: Location[] = (result ?? []) as Location[]
      locations.push(...locationsData)

      logger(
        { breakpoint: "[rickAndMorty.ts:158]" },
        "RickAndMorty/getLocations",
        {
          url: response.url,
          params,
          count: locations.length,
        }
      )
    } catch (error) {
      logger(
        { breakpoint: "[rickAndMorty.ts:165]" },
        "RickAndMorty/getLocations",
        url,
        error
      )
    }
    return locations
  }

  getAllEpisodes = async (
    pagination: PaginationInfo = DefaultPaginationInfo,
    filters?: Partial<EpisodeFilterInfo>
  ): Promise<Episode[]> => {
    const hasFilters: boolean = Object.values(filters ?? {}).some((filter) =>
      Boolean(filter)
    )

    const episodes: Episode[] = []
    const params = {
      page: pagination.page.toString(),
      ...(hasFilters &&
        Object.fromEntries(
          Object.entries(filters ?? {}).filter(([_, v]) => v != null)
        )),
    }
    const url = this.http.path("getAllEpisodes", {}, params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return episodes
      const result: Record<string, unknown> = (await response.json()) as Record<
        string,
        unknown
      >

      const episodesData: Episode[] = (result?.results ?? []) as Episode[]
      episodes.push(...episodesData)

      logger(
        { breakpoint: "[rickAndMorty.ts:74]" },
        "RickAndMorty/getAllEpisodes",
        {
          url: response.url,
          params,
          info: result?.info ?? {},
          count: episodes.length,
        }
      )
    } catch (error) {
      logger(
        { breakpoint: "[rickAndMorty.ts:28]", level: LogLevel.Error },
        "RickAndMorty/getAllEpisodes",
        url,
        error
      )
    }

    return episodes
  }

  getEpisodes = async ({ ids }: { ids: number[] }): Promise<Episode[]> => {
    const episodes: Episode[] = []

    if (!ids.length) return episodes
    const params = {
      ids: JSON.stringify(ids),
    }
    const url = this.http.path("getEpisodes", params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return episodes

      const result: unknown[] = (await response.json()) as unknown[]
      const episodesData: Episode[] = (result ?? []) as Episode[]
      episodes.push(...episodesData)

      logger(
        { breakpoint: "[rickAndMorty.ts:158]" },
        "RickAndMorty/getEpisodes",
        {
          url: response.url,
          params,
          count: episodes.length,
        }
      )
    } catch (error) {
      logger(
        { breakpoint: "[rickAndMorty.ts:165]" },
        "RickAndMorty/getEpisodes",
        url,
        error
      )
    }
    return episodes
  }
}
