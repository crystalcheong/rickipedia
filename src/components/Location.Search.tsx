import { useAuth } from "@clerk/nextjs"
import {
  ArrowUpCircle,
  Check,
  ChevronsUpDown,
  Filter,
  RotateCw,
} from "lucide-react"
import { block, For } from "million/react"
import dynamic from "next/dynamic"
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
import shallow from "zustand/shallow"

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
import RollingNumbers from "@/components/ui/RollingNumbers"
import { Toggle } from "@/components/ui/Toggle"
import { type Favourite } from "@/data/db/favourites/schema"
import { useAppStore } from "@/data/stores/app"
import {
  getDefaultSchemaPaginationStates,
  InitialPaginationStates,
  type Location,
  type LocationFilterInfo,
  type PaginationInfo,
  type PaginationType,
} from "@/types/rickAndMorty"
import { api, cn, getUniqueSetList, logger } from "@/utils"

const Unknown = dynamic(() => import("./Unknown"))
const Loading = dynamic(() => import("./Loading"))
const LocationCard = dynamic(() => import("./Location.Card"))

export const LocationBaseFilters: Record<string, string[]> = {
  type: ["Planet", "Cluster"],
  residents: [],
}
export const LocationChangeFilters: Record<string, string[]> = {
  ...LocationBaseFilters,
  dimension: ["Dimension C-137", "unknown"],
}

const InitialLocationsStates = getDefaultSchemaPaginationStates<Location>()
const InitialSearchState: LocationFilterInfo = {
  name: "",
}

type LocationSearchProps = ComponentPropsWithoutRef<"main">
const LocationSearch = block(({ className, ...rest }: LocationSearchProps) => {
  const { userId } = useAuth()

  //#endregion  //*======== SERVER STATUS ===========
  const [serverStatus, updateServerStatus] = useAppStore(
    (state) => [state.server, state.updateServerStatus],
    shallow
  )
  const isServerDown = !serverStatus.isDbActive
  //#endregion  //*======== SERVER STATUS ===========

  //#endregion  //*======== STATES ===========
  const [favouriteIds, setFavouriteIds] = useState<Favourite["schemaId"][]>([])
  const [changeFilters, setChangeFilters] = useState<
    typeof LocationChangeFilters
  >(LocationChangeFilters)

  const [locations, setLocations] = useState<typeof InitialLocationsStates>(
    InitialLocationsStates
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
    !(locations[currentPaginationType] ?? []).length ||
    (paginations[currentPaginationType]?.page ?? 0) < 2
  const hasFilters: boolean = Object.values(searchFilters ?? {}).some(
    (filter) => Boolean(filter)
  )
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { isLoading: isLoadingLocations } =
    api.rickAndMorty.getAllLocations.useQuery(
      {
        pagination: paginations[currentPaginationType],
        filters: queryStatus.isSearching ? searchFilters : undefined,
      },
      {
        enabled:
          (!(locations["all"] ?? []).length || queryStatus.isFetching) &&
          !queryStatus.isEnd,
        onSuccess: (newLocations: Location[]) => {
          setLocations((state) => ({
            ...state,
            [currentPaginationType]: isFirstQuery
              ? newLocations
              : (state[currentPaginationType] ?? []).concat(newLocations),
          }))

          const typeFilterValues: string[] = (
            changeFilters["type"] ?? []
          ).concat(newLocations.map(({ type }) => type))
          const dimensionFilterValues: string[] = (
            changeFilters["dimension"] ?? []
          ).concat(newLocations.map(({ dimension }) => dimension))
          setChangeFilters({
            type: getUniqueSetList(typeFilterValues),
            dimension: getUniqueSetList(dimensionFilterValues),
          })

          setQueryStatus((status) => ({
            ...status,
            isEnd: newLocations.length < 20,
            isFetching: false,
          }))
        },
      }
    )
  api.favourites.getAll.useQuery(undefined, {
    initialData: [],
    enabled: !!userId && !isServerDown,
    onError: ({ data }) => {
      // server down
      if (data?.httpStatus === 500) {
        serverStatus.isDbActive = false
        updateServerStatus(serverStatus)
      }
    },
    onSuccess: (data) => {
      setFavouriteIds(
        data
          .filter(({ schemaType }) => schemaType === "location")
          .map(({ schemaId }) => schemaId)
      )
    },
  })
  //#endregion  //*======== QUERIES ===========

  //#endregion  //*======== UTILS ===========
  const resetPagination = ({ type }: { type: PaginationType }) => {
    const isInPaginations: boolean = Object.keys(paginations).includes(type)
    const isInLocations: boolean = Object.keys(locations).includes(type)
    const isValidType: boolean = isInLocations && isInPaginations
    if (!isValidType) return

    // Reset
    setPaginations({
      ...paginations,
      [type]: InitialPaginationStates[type] as PaginationInfo,
    })
    setLocations({
      ...locations,
      [type]: InitialLocationsStates[type],
    })
  }

  const resetFilters = () => {
    const paginationType = "search" satisfies PaginationType
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
    const searchChangeFilters = Object.keys(LocationChangeFilters)
    const isSearchChangeFilter: boolean = searchChangeFilters.includes(key)

    // Check if value is blank / empty
    const isEmpty: boolean = !value || !hasFilters
    const isSearching = !isEmpty
    const paginationType = "search" satisfies PaginationType
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
    if (isLoadingLocations) return

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
    isLoadingLocations,
    paginations,
    queryStatus,
  ])

  const handleOnSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const paginationType = "search" satisfies PaginationType

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
    if (!locations[currentPaginationType]?.length || isLoadingLocations) return
    const observer = new IntersectionObserver(handleObserver, {
      threshold: 1,
    })

    if (paginatedEndRef.current) observer.observe(paginatedEndRef.current)

    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      if (paginatedEndRef.current) observer.unobserve(paginatedEndRef.current)
    }
  }, [locations, currentPaginationType, handleObserver, isLoadingLocations])

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
          "fixed bottom-[10%] right-[10%] z-10",
          "p !h-auto !w-fit !p-0 text-accent",
          "rounded-full",
          "animate-bounce",
          (locations[currentPaginationType] ?? []).length <= 20 && "hidden"
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
            onPressedChange={(pressed) => setShowFilters(pressed)}
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
          {Object.entries(changeFilters).map(([name, filterList]) => {
            const filterKey = name as keyof typeof searchFilters
            const value = searchFilters?.[filterKey]

            if (!filterList.length) return null
            return (
              <Popover key={`filter-${name}`}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "w-[200px] flex-1 justify-between truncate capitalize",
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
                  <RenderGuard renderIf={!!filterList.length}>
                    <Command>
                      <CommandInput placeholder={`Search by ${name}...`} />
                      <CommandEmpty>No {name} found.</CommandEmpty>
                      <CommandGroup className="max-h-60 overflow-y-scroll">
                        {filterList.map((filter) => (
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
            pressed={!hasFilters}
          >
            <RotateCw className="h-4 w-4" />
          </Toggle>
        </section>

        <p className="max-w-prose px-3 text-sm">
          Found: &nbsp;
          <RollingNumbers
            className="rick dark:slime bg-clip-text font-semibold text-transparent"
            value={(locations[currentPaginationType] ?? []).length}
          />
        </p>
      </form>

      <RenderGuard
        renderIf={
          !(isLoadingLocations || queryStatus.isFetching) ||
          !!(locations[currentPaginationType] ?? []).length
        }
        fallback={
          isLoadingLocations || queryStatus.isFetching ? (
            <Loading />
          ) : (
            <Unknown
              hideRedirect
              message={
                <>
                  The location you are trying to search has been <br /> is not
                  in any dimension.
                </>
              }
            />
          )
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
          <For
            memo
            each={locations[currentPaginationType] ?? []}
          >
            {(location) => (
              <LocationCard
                key={location.id}
                location={location}
                isFavourite={
                  isServerDown
                    ? false
                    : (favouriteIds ?? []).includes(location.id)
                }
                disableFavourite={isServerDown}
              />
            )}
          </For>
        </section>
        <div ref={paginatedEndRef} />
      </RenderGuard>
    </main>
  )
})

export default LocationSearch
