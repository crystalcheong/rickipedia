import { useAuth, useClerk } from "@clerk/nextjs"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import shallow from "zustand/shallow"

import { SignInTheme } from "@/components/Auth.SignIn"
import { SkeletonCharacterCard } from "@/components/Character.Card"
import BaseLayout from "@/components/layouts/Layout.Base"
import { SkeletonLocationCard } from "@/components/Location.Card"
import { RenderGuard } from "@/components/providers"
import { Badge } from "@/components/ui"
import { ScrollArea, ScrollBar } from "@/components/ui/ScrollArea"
import { type Favourite } from "@/data/db/favourites/schema"
import { useAppStore } from "@/data/stores/app"
import {
  type Character,
  type Location,
  type SchemaType,
} from "@/types/rickAndMorty"
import { api, cn } from "@/utils"

const Unknown = dynamic(() => import("../components/Unknown"))
const CharacterCard = dynamic(() => import("../components/Character.Card"))
const LocationCard = dynamic(() => import("../components/Location.Card"))

const InitialFavouritesStates: Record<SchemaType, Favourite[]> = {
  character: [],
  episode: [],
  location: [],
}

const FavouritesPage = () => {
  const { openSignIn } = useClerk()
  const { userId, isSignedIn } = useAuth()
  const router = useRouter()

  const [favourites, setFavourites] = useState<typeof InitialFavouritesStates>(
    InitialFavouritesStates
  )
  const [characters, setCharacters] = useState<Character[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const characterIds = favourites.character.map(({ schemaId }) => schemaId)
  const locationIds = favourites.location.map(({ schemaId }) => schemaId)

  const [serverStatus, updateServerStatus] = useAppStore(
    (state) => [state.server, state.updateServerStatus],
    shallow
  )
  const isServerDown = !serverStatus.isDbActive

  //#endregion  //*======== QUERIES ===========
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
    onSuccess: (data: Favourite[]) => {
      setFavourites(
        data.reduce((favouritesMap = InitialFavouritesStates, favourite) => {
          favouritesMap[favourite.schemaType] = (
            favouritesMap[favourite.schemaType] ?? []
          ).concat([favourite])
          return favouritesMap
        }, InitialFavouritesStates)
      )
    },
    onSettled: (_, error) => {
      if (error?.data?.code === "UNAUTHORIZED") {
        return openSignIn({
          redirectUrl: router.asPath,
          appearance: SignInTheme,
        })
      }
    },
  })

  api.useQueries((trpc) => [
    trpc.rickAndMorty.getCharacters(
      {
        ids: characterIds,
      },
      {
        initialData: [],
        enabled: !!characterIds.length && !characters.length,
        onSuccess: (data) => {
          setCharacters(data)
        },
      }
    ),
    trpc.rickAndMorty.getLocations(
      {
        ids: locationIds,
      },
      {
        initialData: [],
        enabled: !!locationIds.length && !locations.length,
        onSuccess: (data) => {
          setLocations(data)
        },
      }
    ),
  ])
  //#endregion  //*======== QUERIES ===========

  return (
    <BaseLayout className={cn("relative", "flex flex-col gap-16")}>
      <RenderGuard
        renderIf={isSignedIn}
        fallback={
          <Unknown
            hideRedirect
            message={<>No favourites found in any dimensions.</>}
          />
        }
      >
        <aside
          className={cn(
            "hidden",
            isServerDown &&
              cn(
                "flex flex-col place-content-center place-items-center gap-4",
                "fixed inset-0 z-30",
                "bg-white/3 backdrop-blur-sm"
              )
          )}
        >
          <Unknown
            hideRedirect
            message={
              <>
                Ah jeez, the server&apos;s just, you know, having a little
                downtime.
                <br />
                It&apos;ll be back, like, pronto.
              </>
            }
          />
        </aside>

        <section className={cn("flex flex-col gap-4")}>
          <header className="flex flex-row items-center gap-2">
            <h4>Characters</h4>
            {!!characterIds.length && (
              <Badge className="rick dark:slime">{characterIds.length}</Badge>
            )}
          </header>
          <ScrollArea>
            <div
              className={cn(
                "relative w-full snap-x snap-mandatory snap-always overflow-x-auto",
                "flex flex-row flex-nowrap place-items-center gap-5"
              )}
            >
              {isServerDown
                ? Array(5)
                    .fill(false)
                    .map((_, idx) => (
                      <SkeletonCharacterCard
                        key={`skeleton-character-${idx}`}
                      />
                    ))
                : characters.map((character) => (
                    <CharacterCard
                      key={character.id}
                      character={character}
                      isFavourite={characterIds.includes(character.id)}
                    />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>

        <section className="flex flex-col gap-4">
          <header className="flex flex-row items-center gap-2">
            <h4>Locations</h4>
            {!!locationIds.length && (
              <Badge className="rick dark:slime">{locationIds.length}</Badge>
            )}
          </header>
          <ScrollArea>
            <div
              className={cn(
                "relative w-full snap-x snap-mandatory snap-always overflow-x-auto",
                "flex flex-row flex-nowrap place-items-center gap-5"
              )}
            >
              {isServerDown
                ? Array(5)
                    .fill(false)
                    .map((_, idx) => (
                      <SkeletonLocationCard key={`skeleton-location-${idx}`} />
                    ))
                : locations.map((location) => (
                    <LocationCard
                      key={location.id}
                      location={location}
                      isFavourite={locationIds.includes(location.id)}
                      className="shrink-0 snap-start last:mr-6"
                    />
                  ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </section>
      </RenderGuard>
    </BaseLayout>
  )
}

export default FavouritesPage
