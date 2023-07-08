import { Loader2 } from "lucide-react"
import dynamic from "next/dynamic"
import { type ComponentPropsWithoutRef, useCallback, useState } from "react"

import {
  InitialPaginationStates,
  type PaginationType,
  PaginationTypes,
} from "@/components/Character.Search"
import { Button } from "@/components/ui/Button"
import { type Episode } from "@/types/rickAndMorty"
import { api, cn, logger } from "@/utils"

const EpisodeTable = dynamic(() => import("./Episode.Table"))

const InitialEpisodesStates: Record<PaginationType, Episode[]> =
  Object.fromEntries(PaginationTypes.map((type) => [type, []]))

type EpisodeSearchProps = ComponentPropsWithoutRef<"main">

const EpisodeSearch = ({ className, ...rest }: EpisodeSearchProps) => {
  //#endregion  //*======== STATES ===========

  const [episodes, setEpisodes] = useState<typeof InitialEpisodesStates>(
    InitialEpisodesStates
  )
  const [paginations, setPaginations] = useState<
    typeof InitialPaginationStates
  >(InitialPaginationStates)
  const [queryStatus, setQueryStatus] = useState({
    isFetching: false,
    isSearching: false,
    isEnd: false,
  })

  const currentPaginationType = queryStatus.isSearching ? "search" : "all"
  const isFirstQuery =
    !(episodes[currentPaginationType] ?? []).length ||
    (paginations[currentPaginationType]?.page ?? 0) < 2
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { isLoading: isLoadingEpisodes } =
    api.rickAndMorty.getAllEpisodes.useQuery(
      {
        pagination: paginations[currentPaginationType],
      },
      {
        enabled:
          (!(episodes["all"] ?? []).length || queryStatus.isFetching) &&
          !queryStatus.isEnd,
        onSuccess: (newEpisodes: Episode[]) => {
          setEpisodes((state) => ({
            ...state,
            [currentPaginationType]: isFirstQuery
              ? newEpisodes
              : (state[currentPaginationType] ?? []).concat(newEpisodes),
          }))

          setQueryStatus((status) => ({
            ...status,
            isEnd: newEpisodes.length < 20,
            isFetching: false,
          }))
        },
      }
    )
  //#endregion  //*======== QUERIES ===========

  //#region  //*=========== HANDLERS ===========

  const handleOnLoad = useCallback(() => {
    if (isLoadingEpisodes) return

    const paginationType: keyof typeof paginations = currentPaginationType

    logger({ breakpoint: "[index.tsx:129]" }, "EpisodeSearch/handleOnLoad", {
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
    isLoadingEpisodes,
    paginations,
    queryStatus,
  ])
  //#endregion  //*======== HANDLERS ===========

  return (
    <main
      className={cn("flex flex-col gap-12", className)}
      {...rest}
    >
      <EpisodeTable
        showFields
        episodes={episodes[currentPaginationType] ?? []}
        extraPaginationFields={
          !queryStatus.isEnd ? (
            <Button
              variant="outline"
              size="sm"
              onClick={handleOnLoad}
              disabled={queryStatus.isEnd || isLoadingEpisodes}
            >
              {isLoadingEpisodes && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Next
            </Button>
          ) : null
        }
      />
    </main>
  )
}

export default EpisodeSearch
