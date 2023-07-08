import {
  type Character,
  type CharacterFilterInfo,
  DefaultPaginationInfo,
  type Episode,
  type EpisodeFilterInfo,
  type Location,
  type LocationFilterInfo,
  type PaginationInfo,
  type SchemaType,
  SchemaTypes,
} from "@/types/rickAndMorty"
import { getUniqueObjectListwithKeys, HTTP, logger, LogLevel } from "@/utils"

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
  private schemaLimits: Record<SchemaType, number>

  private constructor() {
    this.http = new HTTP(Endpoint, Routes)
    this.schemaLimits = Object.fromEntries(
      SchemaTypes.map((type) => [type, 0])
    ) as Record<SchemaType, number>
  }

  static getInstance = (): RickAndMortyClient => {
    if (!this.instance) {
      this.instance = new RickAndMortyClient()
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
    type?: SchemaType
  }): number[] => {
    const characterUrl = `${Endpoint}/${type}/`
    const ids: string = idUrls.toString().replaceAll(characterUrl, "")
    return this.parseIds(ids)
  }

  getSchemaLimits = async () => {
    const emptyKeys: SchemaType[] = Object.entries(this.schemaLimits)
      .filter(([, limit]) => limit < 1)
      .map(([type]) => type as SchemaType)

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
