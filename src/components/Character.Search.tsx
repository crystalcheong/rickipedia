"use client"

import {
  ArrowUpCircle,
  Check,
  ChevronsUpDown,
  Filter,
  RotateCw,
} from "lucide-react"
import Link from "next/link"
import {
  type ChangeEvent,
  type ComponentPropsWithoutRef,
  type FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"

import { RenderGuard } from "@/components/providers"
import { Button } from "@/components/ui/Button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/Command"
import { Input } from "@/components/ui/Input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/Popover"
import { Toggle } from "@/components/ui/Toggle"
import Unknown from "@/components/Unknown"
import {
  CharacterGender,
  CharacterSpecies,
  CharacterStatus,
  DefaultPaginationInfo,
} from "@/data/clients/rickAndMorty"
import { type RickAndMorty } from "@/types/rickAndMorty"
import { api, cn, logger } from "@/utils"

import CharacterCard from "../components/Character.Card"

export const PaginationTypes: string[] = ["all", "search"]
export type PaginationType = (typeof PaginationTypes)[number]
export const InitialPaginationStates: Record<
  PaginationType,
  typeof DefaultPaginationInfo
> = Object.fromEntries(
  PaginationTypes.map((type) => [type, DefaultPaginationInfo])
)
const InitialCharactersStates: Record<
  PaginationType,
  RickAndMorty.Character[]
> = Object.fromEntries(PaginationTypes.map((type) => [type, []]))

const InitialSearchState: Partial<RickAndMorty.CharacterFilterInfo> = {
  name: "",
}

export const CharacterChangeFilters: Record<string, Record<string, string>> = {
  status: CharacterStatus,
  species: CharacterSpecies,
  gender: CharacterGender,
}

type CharacterSearchProps = ComponentPropsWithoutRef<"main">

const CharacterSearch = ({ className, ...rest }: CharacterSearchProps) => {
  //#endregion  //*======== STATES ===========
  const [characters, setCharacters] = useState<typeof InitialCharactersStates>(
    InitialCharactersStates
  )
  const [paginations, setPaginations] = useState<
    typeof InitialPaginationStates
  >(InitialPaginationStates)
  const [searchFilters, setSearchFilters] =
    useState<typeof InitialSearchState>(InitialSearchState)
  const [queryStatus, setQueryStatus] = useState({
    isFetching: false,
    isSearching: false,
    isEnd: false,
  })

  const currentPaginationType = queryStatus.isSearching ? "search" : "all"
  const isFirstQuery =
    !(characters[currentPaginationType] ?? []).length ||
    (paginations[currentPaginationType]?.page ?? 0) < 2
  const hasFilters: boolean = Object.values(searchFilters ?? {}).some(
    (filter) => Boolean(filter)
  )
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { isLoading: isLoadingCharacters } =
    api.rickAndMorty.getAllCharacters.useQuery(
      {
        pagination: paginations[currentPaginationType],
        filters: queryStatus.isSearching ? searchFilters : undefined,
      },
      {
        enabled:
          (!(characters["all"] ?? []).length || queryStatus.isFetching) &&
          !queryStatus.isEnd,
        onSuccess: (newCharacters: RickAndMorty.Character[]) => {
          setCharacters((state) => ({
            ...state,
            [currentPaginationType]: isFirstQuery
              ? newCharacters
              : (state[currentPaginationType] ?? []).concat(newCharacters),
          }))
          setQueryStatus((status) => ({
            ...status,
            isEnd: newCharacters.length < 20,
            isFetching: false,
          }))
        },
      }
    )
  //#endregion  //*======== QUERIES ===========

  //#endregion  //*======== UTILS ===========
  const resetPagination = ({ type }: { type: PaginationType }) => {
    const isInPaginations: boolean = Object.keys(paginations).includes(type)
    const isInCharacters: boolean = Object.keys(characters).includes(type)
    const isValidType: boolean = isInCharacters && isInPaginations
    if (!isValidType) return

    // Reset
    setPaginations({
      ...paginations,
      [type]: InitialPaginationStates[type] as RickAndMorty.PaginationInfo,
    })
    setCharacters({
      ...characters,
      [type]: InitialCharactersStates[type] as RickAndMorty.Character[],
    })
  }

  const resetFilters = () => {
    const paginationType: keyof typeof paginations = "search"
    resetPagination({ type: paginationType })

    setSearchFilters(InitialSearchState)

    setQueryStatus({
      isEnd: false,
      isSearching: false,
      isFetching: false,
    })
  }

  const onSearchChange = ({
    key,
    value,
  }: {
    key: keyof typeof searchFilters
    value?: string
  }) => {
    // Check if key is search change filter (fetches on change)
    const searchChangeFilters = Object.keys(CharacterChangeFilters)
    const isSearchChangeFilter: boolean = searchChangeFilters.includes(key)

    // Check if value is blank / empty
    const isEmpty: boolean = !value || !hasFilters
    const isSearching = !isEmpty
    const paginationType: keyof typeof paginations = "search"
    if (isSearchChangeFilter && !value) value = undefined
    if (!isSearching) resetPagination({ type: paginationType })

    setSearchFilters((filters) => ({
      ...filters,
      [key]: value,
    }))
    setQueryStatus({
      isEnd: false,
      isSearching: isSearchChangeFilter ?? isSearching,
      isFetching: isSearchChangeFilter,
    })
  }

  //#endregion  //*======== UTILS ===========

  //#region  //*=========== HANDLERS ===========
  const handleOnSearchFormChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target: EventTarget & (HTMLInputElement | HTMLSelectElement) =
      e.target
    const key = target.name as keyof typeof searchFilters
    const value: string | undefined = target.value.trim()

    onSearchChange({ key, value })
  }

  const handleOnLoad = useCallback(() => {
    if (isLoadingCharacters) return

    const paginationType: keyof typeof paginations = currentPaginationType

    logger({ breakpoint: "[index.tsx:129]" }, "CharacterSearch/handleOnLoad", {
      isFirstQuery,
      paginationType,
    })

    const nextPage = (paginations[paginationType]?.page ?? 1) + 1
    setPaginations({
      ...paginations,
      [paginationType]: {
        page: nextPage,
      },
    })

    // Trigger query
    setQueryStatus({
      ...queryStatus,
      isFetching: true,
    })
  }, [
    currentPaginationType,
    isFirstQuery,
    isLoadingCharacters,
    paginations,
    queryStatus,
  ])

  const handleOnSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const paginationType: keyof typeof paginations = "search"

    logger({ breakpoint: "[index.tsx:65]" }, "CharacterSearch/handleOnSearch", {
      searchFilters,
      hasFilters,
      paginationType,
      isFirstQuery,
    })

    // Submitted w/o search filters
    if (!hasFilters) resetPagination({ type: paginationType })

    // Only increment pagination if not first query
    if (!isFirstQuery) {
      const nextPage = (paginations[paginationType]?.page ?? 1) + 1
      setPaginations({
        ...paginations,
        [paginationType]: {
          page: nextPage,
        },
      })
    }

    // Trigger query
    setQueryStatus({
      ...queryStatus,
      isFetching: hasFilters,
      isSearching: hasFilters,
    })
  }
  //#endregion  //*======== HANDLERS ===========

  const [showFilters, setShowFilters] = useState<boolean>(false)

  const paginatedEndRef = useRef<HTMLDivElement>(null)
  const handleObserver = useCallback(
    ([entry]: IntersectionObserverEntry[]) => {
      if (!!entry && entry.isIntersecting && !queryStatus.isFetching) {
        handleOnLoad()
      }
    },
    [handleOnLoad, queryStatus.isFetching]
  )

  useEffect(() => {
    if (!characters[currentPaginationType]?.length || isLoadingCharacters)
      return
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1,
    })

    if (paginatedEndRef.current) observer.observe(paginatedEndRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (paginatedEndRef.current) observer.unobserve(paginatedEndRef.current)
    }
  }, [characters, currentPaginationType, handleObserver, isLoadingCharacters])

  return (
    <main
      className={cn("flex flex-col gap-12", className)}
      {...rest}
    >
      <Link
        href="#searchForm"
        scroll={false}
        className={cn(
          "rick dark:slime",
          "fixed bottom-[10%] right-[10%]",
          "p !h-auto !w-fit !p-0 text-accent",
          "rounded-full",
          "animate-bounce",
          (characters[currentPaginationType] ?? []).length <= 20 && "hidden"
        )}
      >
        <ArrowUpCircle className="h-8 w-8 hover:scale-110" />
      </Link>
      <form
        id="searchForm"
        method="get"
        onSubmit={handleOnSearch}
        className={cn(
          "bg-background",
          "flex flex-col place-content-center place-items-center gap-4",
          "mx-auto w-full sm:w-3/5 [&>*]:w-full"
        )}
      >
        <section className="flex flex-row place-content-between place-items-center gap-4">
          <Input
            name="name"
            type="search"
            placeholder="Search by name"
            value={searchFilters.name ?? ""}
            onChange={handleOnSearchFormChange}
          />
          <Toggle
            aria-label="Toggle Filter"
            variant="outline"
            pressed={showFilters}
            onPressedChange={setShowFilters}
            className={cn(showFilters && "border-[#8CE261]")}
          >
            <Filter className="h-4 w-4" />
          </Toggle>
        </section>

        <section
          className={cn(
            "hidden flex-row flex-wrap place-content-center place-items-center gap-4",
            "border-b pb-8",
            showFilters && "flex"
          )}
        >
          {Object.entries(CharacterChangeFilters).map(([name, filterMap]) => {
            const filterKey = name as keyof typeof searchFilters
            const value = searchFilters?.[filterKey] as string

            if (!filterMap) return null
            return (
              <Popover key={`filter-${name}`}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] flex-1 justify-between capitalize",
                      value
                        ? "rick dark:slime bg-clip-text text-transparent"
                        : "text-muted-foreground"
                    )}
                  >
                    {value ?? `${name}`}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-60 w-full p-0">
                  <RenderGuard renderIf={!!filterMap}>
                    <Command>
                      <CommandInput placeholder={`Search by ${name}...`} />
                      <CommandEmpty>No {name} found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-scroll">
                        {Object.values(filterMap).map((filter) => (
                          <CommandItem
                            key={`filter-enum-${filter}`}
                            className="capitalize"
                            onSelect={(currentValue) => {
                              onSearchChange({
                                key: name as keyof typeof searchFilters,
                                value:
                                  currentValue === value
                                    ? undefined
                                    : currentValue,
                              })
                            }}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                (value?.toString() ?? "").toUpperCase() ===
                                  filter.toUpperCase()
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {filter}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </Command>
                  </RenderGuard>
                </PopoverContent>
              </Popover>
            )
          })}
          <Toggle
            aria-label="Reset Filters"
            variant="outline"
            onClick={resetFilters}
            disabled={!hasFilters}
          >
            <RotateCw className="h-4 w-4" />
          </Toggle>
        </section>
      </form>

      <RenderGuard
        renderIf={
          !(isLoadingCharacters || queryStatus.isFetching) ||
          !!(characters[currentPaginationType] ?? []).length
        }
        fallbackComponent={
          <Unknown
            hideRedirect
            message={
              <>
                The character you are trying to search has been <br /> is not in
                any dimension.
              </>
            }
          />
        }
      >
        <section
          className={cn(
            "mx-auto w-fit",
            "grid grid-flow-row-dense",
            "auto-cols-fr gap-5",
            "sm:grid-cols-2 lg:grid-cols-3"
          )}
        >
          {(characters[currentPaginationType] ?? []).map((character) => (
            <CharacterCard
              key={character.id}
              character={character}
              tilt
            />
          ))}
        </section>
        <div ref={paginatedEndRef} />
      </RenderGuard>
    </main>
  )
}

export default CharacterSearch
