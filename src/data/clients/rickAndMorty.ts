import { type RickAndMorty } from "@/types/rickAndMorty.d"
import { getUniqueObjectListwithKeys, HTTP, logger, LogLevel } from "@/utils"

//#endregion  //*======== EXPORT ZONE ===========
export const DefaultPaginationInfo: RickAndMorty.PaginationInfo = {
  page: 1,
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

export const SchemaTypes = ["character", "episode", "location"] as const
export type SchemaType = (typeof SchemaTypes)[number]
//#endregion  //*======== EXPORT ZONE ===========

const Endpoint = `https://rickandmortyapi.com/api`

const Routes: Record<string, string> = {
  getAllCharacters: `/character`,
  getCharacters: `/character/:ids`,

  getAllLocations: `/location`,
  getLocations: `/location/:ids`,

  getAllEpisodes: `/episode/`,
  getEpisodes: `/episode/:ids`,
}

export class RickAndMortyClient {
  private http: HTTP<typeof Routes>
  private static instance: RickAndMortyClient
  private schemaLimits: Record<RickAndMorty.SchemaType, number>

  private constructor() {
    const defaultHeaders = {
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-origin",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Headers": "X-Token",
    }
    this.http = new HTTP(Endpoint, Routes, defaultHeaders)
    this.schemaLimits = Object.fromEntries(
      SchemaTypes.map((type) => [type, 0])
    ) as Record<RickAndMorty.SchemaType, number>
  }

  static getInstance = (): RickAndMortyClient => {
    if (!this.instance) {
      this.instance = new RickAndMortyClient()
    }
    return this.instance
  }

  static getUniqueCharacters = (
    characters: RickAndMorty.Character[]
  ): RickAndMorty.Character[] =>
    getUniqueObjectListwithKeys<RickAndMorty.Character>({
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
    type?: RickAndMorty.SchemaType
  }): number[] => {
    const characterUrl = `${Endpoint}/${type}/`
    const ids: string = idUrls.toString().replaceAll(characterUrl, "")
    return this.parseIds(ids)
  }

  getSchemaLimits = async () => {
    const emptyKeys: RickAndMorty.SchemaType[] = Object.entries(
      this.schemaLimits
    )
      .filter(([, limit]) => limit < 1)
      .map(([type]) => type as RickAndMorty.SchemaType)

    for (const type of emptyKeys) {
      switch (type) {
        case "character": {
          await this.getAllCharacters()
          break
        }
        case "episode": {
          await this.getAllEpisodes()
          break
        }
        case "location": {
          await this.getAllLocations()
          break
        }
      }
    }

    return this.schemaLimits
  }

  getAllCharacters = async (
    pagination: RickAndMorty.PaginationInfo = DefaultPaginationInfo,
    filters?: Partial<RickAndMorty.CharacterFilterInfo>
  ): Promise<RickAndMorty.Character[]> => {
    const hasFilters: boolean = Object.values(filters ?? {}).some((filter) =>
      Boolean(filter)
    )

    const characters: RickAndMorty.Character[] = []
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

      const charactersData: RickAndMorty.Character[] = (result?.results ??
        []) as RickAndMorty.Character[]
      characters.push(...charactersData)

      // Update schema limits
      this.schemaLimits.character =
        (result?.info as Record<string, number>)?.count ?? 0

      logger(
        { breakpoint: "[rickAndMorty.ts:74]" },
        "RickAndMorty/getAllCharacters",
        {
          url: response.url,
          params,
          info: result?.info ?? {},
          count: characters.length,
          schemaLimits: this.schemaLimits,
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

  getCharacters = async ({
    ids,
  }: {
    ids: number[]
  }): Promise<RickAndMorty.Character[]> => {
    const characters: RickAndMorty.Character[] = []
    if (!ids.length) return characters
    const params = {
      ids: JSON.stringify(ids),
    }
    const url = this.http.path("getCharacters", params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return characters

      const result: unknown[] = (await response.json()) as unknown[]
      const charactersData: RickAndMorty.Character[] = (result ??
        []) as RickAndMorty.Character[]
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
    pagination: RickAndMorty.PaginationInfo = DefaultPaginationInfo,
    filters?: Partial<RickAndMorty.LocationFilterInfo>
  ): Promise<RickAndMorty.Location[]> => {
    const hasFilters: boolean = Object.values(filters ?? {}).some((filter) =>
      Boolean(filter)
    )

    const locations: RickAndMorty.Location[] = []
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

      const locationsData: RickAndMorty.Location[] = (result?.results ??
        []) as RickAndMorty.Location[]
      locations.push(...locationsData)

      // Update schema limits
      this.schemaLimits.location =
        (result?.info as Record<string, number>)?.count ?? 0

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

  getLocations = async ({
    ids,
  }: {
    ids: number[]
  }): Promise<RickAndMorty.Location[]> => {
    const locations: RickAndMorty.Location[] = []

    if (!ids.length) return locations
    const params = {
      ids: JSON.stringify(ids),
    }
    const url = this.http.path("getLocations", params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return locations

      const result: unknown[] = (await response.json()) as unknown[]
      const locationsData: RickAndMorty.Location[] = (result ??
        []) as RickAndMorty.Location[]
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
    pagination: RickAndMorty.PaginationInfo = DefaultPaginationInfo,
    filters?: Partial<RickAndMorty.EpisodeFilterInfo>
  ): Promise<RickAndMorty.Episode[]> => {
    const hasFilters: boolean = Object.values(filters ?? {}).some((filter) =>
      Boolean(filter)
    )

    const episodes: RickAndMorty.Episode[] = []
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

      const episodesData: RickAndMorty.Episode[] = (result?.results ??
        []) as RickAndMorty.Episode[]
      episodes.push(...episodesData)

      // Update schema limits
      this.schemaLimits.episode =
        (result?.info as Record<string, number>)?.count ?? 0

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

  getEpisodes = async ({
    ids,
  }: {
    ids: number[]
  }): Promise<RickAndMorty.Episode[]> => {
    const episodes: RickAndMorty.Episode[] = []

    if (!ids.length) return episodes
    const params = {
      ids: JSON.stringify(ids),
    }
    const url = this.http.path("getEpisodes", params)

    try {
      const response: Response = await this.http.get({ url })
      if (!response.ok) return episodes

      const result: unknown[] = (await response.json()) as unknown[]
      const episodesData: RickAndMorty.Episode[] = (result ??
        []) as RickAndMorty.Episode[]
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
