import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"

import BaseLayout from "@/components/layouts/Layout.Base"
import { RenderGuard } from "@/components/providers"
import { Badge } from "@/components/ui/Badge"
import { RickAndMortyClient } from "@/data/clients/rickAndMorty"
import { type Location } from "@/types/rickAndMorty"
import { api, cn, getUniqueSetList } from "@/utils"
const CharacterCard = dynamic(() => import("../../components/Character.Card"))

const LocationIdPage = () => {
  const router = useRouter()
  const { id } = router.query

  const ids: number[] = RickAndMortyClient.parseIds(id)

  //#endregion  //*======== STATES ===========
  const [characterIds, setCharacterIds] = useState<number[]>([])
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { data: locationsData = [] } = api.rickAndMorty.getLocations.useQuery(
    {
      ids,
    },
    {
      initialData: [],
      enabled: !!ids.length,
      onSuccess: (data: Location[]) => {
        const characterIds: number[] = getUniqueSetList(
          data.reduce(
            (cIds: number[] = [], { residents }) =>
              cIds.concat(
                RickAndMortyClient.getIdsFromUrls({
                  idUrls: residents,
                  type: "character",
                })
              ),
            []
          )
        )
        setCharacterIds(characterIds)
      },
    }
  )

  const [{ data: charactersData = [] }] = api.useQueries((trpc) => [
    trpc.rickAndMorty.getCharacters(
      {
        ids: characterIds,
      },
      {
        initialData: [],
        enabled: !!characterIds.length && !!locationsData.length,
      }
    ),
  ])
  //#endregion  //*======== QUERIES ===========

  return (
    <BaseLayout
      className={cn("flex flex-col place-items-center gap-16")}
      seo={{
        title: locationsData.map(({ name }) => name).toString(),
      }}
    >
      <RenderGuard renderIf={!!locationsData.length}>
        <main className={cn("flex flex-col gap-24")}>
          {locationsData.map((location) => {
            const dimension =
              !location.dimension ||
              location.dimension.toUpperCase() === "unknown".toUpperCase()
                ? "???"
                : location.dimension
            const type =
              !location.type ||
              location.type.toUpperCase() === "unknown".toUpperCase()
                ? "???"
                : location.type

            return (
              <article
                key={location.id}
                className="w-4/5 sm:w-5/12 sm:max-w-sm"
              >
                <div className="space-y-1">
                  <h3 className="leading-none">{location.name}</h3>

                  <aside className="text-sm font-semibold text-muted-foreground">
                    <p className="flex flex-row flex-wrap place-items-center">
                      <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                        Type:&nbsp;
                      </span>
                      {type}
                    </p>
                    <p className="inline-flex flex-row flex-wrap place-items-center">
                      <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                        Dimension:&nbsp;
                      </span>
                      {dimension}
                    </p>
                  </aside>
                </div>
              </article>
            )
          })}
        </main>

        <section className="flex flex-col gap-4">
          <header className="flex flex-row items-center gap-2">
            <h4>Characters</h4>
            {!!characterIds.length && (
              <Badge className="rick dark:slime">{characterIds.length}</Badge>
            )}
          </header>
          <div
            className={cn(
              "flex flex-col gap-4",
              "place-content-start place-items-center",
              "sm:flex-row sm:flex-wrap"
            )}
          >
            {charactersData.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
                className="shrink-0 snap-center snap-always"
                tilt
                disableFavourite
              />
            ))}
          </div>
        </section>
      </RenderGuard>
    </BaseLayout>
  )
}

export default LocationIdPage
