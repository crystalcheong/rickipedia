import { useAuth, useClerk } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"

import { SignInTheme } from "@/components/Auth.SignIn"
import BaseLayout from "@/components/layouts/Layout.Base"
import { RenderGuard } from "@/components/providers"
import { Badge } from "@/components/ui/Badge"
import { RickAndMortyClient } from "@/data/clients/rickAndMorty"
import { type Character, type Location } from "@/types/rickAndMorty"
import { api, cn, getUniqueSetList } from "@/utils"

const CharacterDetail = dynamic(
  () => import("../../components/Character.Detail")
)
const EpisodeTable = dynamic(() => import("../../components/Episode.Table"))
const LocationCard = dynamic(() => import("../../components/Location.Card"))

const CharacterIdPage = () => {
  const router = useRouter()
  const { id } = router.query
  const { openSignIn } = useClerk()
  const { isSignedIn } = useAuth()

  const ids: number[] = RickAndMortyClient.parseIds(id)

  //#endregion  //*======== STATES ===========
  const [locationIds, setLocationIds] = useState<number[]>([])
  const [episodeIds, setEpisodeIds] = useState<number[]>([])
  //#endregion  //*======== STATES ===========

  //#endregion  //*======== QUERIES ===========
  const { data: charactersData = [], isFetching: isLoadingCharacters } =
    api.rickAndMorty.getCharacters.useQuery(
      {
        ids,
      },
      {
        initialData: [],
        enabled: !!ids.length,
        onSuccess: (data: Character[]) => {
          const getLocationId = (locationUrl: string): number =>
            parseInt(locationUrl.slice(locationUrl.lastIndexOf("/") + 1))
          const locationIds: number[] = data.map(({ location }) =>
            getLocationId(location.url)
          )
          setLocationIds(locationIds)

          const episodeIds: number[] = getUniqueSetList(
            data.reduce(
              (eIds: number[] = [], { episode }) =>
                eIds.concat(
                  RickAndMortyClient.getIdsFromUrls({
                    idUrls: episode,
                    type: "episode",
                  })
                ),
              []
            )
          )
          setEpisodeIds(episodeIds)
        },
      }
    )

  const [
    { data: locationsData = [] as Location[] },
    { data: episodesData = [] },
    { data: favouritesData = [] },
  ] = api.useQueries((trpc) => [
    trpc.rickAndMorty.getLocations(
      {
        ids: locationIds,
      },
      {
        initialData: [],
        enabled:
          !!locationIds.length &&
          !!charactersData.length &&
          !isLoadingCharacters,
      }
    ),
    trpc.rickAndMorty.getEpisodes(
      {
        ids: episodeIds,
      },
      {
        initialData: [],
        enabled:
          !!episodeIds.length &&
          !!charactersData.length &&
          !isLoadingCharacters,
      }
    ),
    trpc.favourites.getAll(undefined, {
      initialData: [],
      enabled: isSignedIn && !!charactersData.length,
      onSettled: (_, error) => {
        if (error?.data?.code === "UNAUTHORIZED") {
          return openSignIn({
            redirectUrl: router.asPath,
            appearance: SignInTheme,
          })
        }
      },
    }),
  ])
  //#endregion  //*======== QUERIES ===========

  const favCharacterIds = favouritesData
    .filter(({ schemaType }) => schemaType === "character")
    .map(({ schemaId }) => schemaId)
  const favLocationIds = favouritesData
    .filter(({ schemaType }) => schemaType === "location")
    .map(({ schemaId }) => schemaId)

  return (
    <BaseLayout
      className={cn("flex flex-col place-items-center gap-16")}
      seo={{
        title: charactersData.map(({ name }) => name).toString(),
      }}
    >
      <RenderGuard renderIf={!!charactersData.length}>
        <main className={cn("flex flex-col gap-24")}>
          {charactersData.map((character) => (
            <CharacterDetail
              character={character}
              key={character.id}
              isFavourite={favCharacterIds.includes(character.id)}
            />
          ))}
        </main>

        <section className="flex flex-col gap-4">
          <header className="flex flex-row items-center gap-2">
            <h4>Locations</h4>
            {!!locationIds.length && (
              <Badge className="rick dark:slime">{locationIds.length}</Badge>
            )}
          </header>
          <div
            className={cn("flex flex-col gap-4", "sm:flex-row sm:flex-wrap")}
          >
            {locationsData.map((location) => (
              <LocationCard
                key={location.id}
                location={location}
                isFavourite={favLocationIds.includes(location.id)}
              />
            ))}
          </div>
        </section>

        <EpisodeTable
          episodes={episodesData}
          title={
            <header className="flex flex-row items-center gap-2">
              <h4>Episodes</h4>
              <Badge className="dark:slime rick">{episodesData.length}</Badge>
            </header>
          }
        />
      </RenderGuard>
    </BaseLayout>
  )
}

export default CharacterIdPage
