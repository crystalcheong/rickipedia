import { useAuth, useClerk } from "@clerk/nextjs"
import { Bookmark, BookmarkPlus } from "lucide-react"
import { block } from "million/react"
import { useRouter } from "next/router"
import { type ComponentPropsWithoutRef, Fragment, memo, useState } from "react"

import { SignInTheme } from "@/components/Auth.SignIn"
import { CharacterChangeFilters } from "@/components/Character.Search"
import { Button } from "@/components/ui"
import { NextImage } from "@/components/ui/Image"
import { Separator } from "@/components/ui/Separator"
import { useToast } from "@/components/ui/use-toast"
import { type Favourite } from "@/data/db/favourites/schema"
import { AppStatus, ToastStatus } from "@/data/static/app"
import { type Character } from "@/types/rickAndMorty"
import { api, cn } from "@/utils"

type CharacterDetailProps = ComponentPropsWithoutRef<"section"> & {
  character: Character
  isFavourite?: boolean
  hideFavourite?: boolean
  disableFavourite?: boolean
}

const CharacterDetail = block(
  ({
    character,
    className,
    isFavourite = false,
    hideFavourite = false,
    disableFavourite = false,
    ...rest
  }: CharacterDetailProps) => {
    const location =
      character.location.name === "unknown" ? "???" : character.location.name
    const origin =
      character.origin.name === "unknown" ? "???" : character.origin.name

    const { toast } = useToast()
    const router = useRouter()
    const { openSignIn } = useClerk()
    const { userId } = useAuth()
    const [favourite, setFavourite] = useState<boolean>(isFavourite)

    //#endregion  //*======== QUERIES ===========
    const createFavourite = api.favourites.create.useMutation({
      onSuccess: () => {
        setFavourite(true)
      },
    })
    const deleteFavourite = api.favourites.delete.useMutation({
      onSuccess: () => {
        setFavourite(false)
      },
    })
    //#endregion  //*======== QUERIES ===========

    const handleToggleFavourite = () => {
      if (!character) return
      if (!userId)
        return openSignIn({
          redirectUrl: router.asPath,
          appearance: SignInTheme,
        })

      if (disableFavourite) {
        toast(ToastStatus[AppStatus.FEATURE_UNAVAILABLE])
        return
      }

      const params: Pick<Favourite, "schemaId" | "schemaType"> = {
        schemaType: "character",
        schemaId: character.id,
      }
      if (favourite) {
        return deleteFavourite.mutate(params)
      } else {
        return createFavourite.mutate(params)
      }
    }

    const FavouriteIcon = memo(favourite ? BookmarkPlus : Bookmark)

    return (
      <main
        className={cn(
          "flex flex-col place-content-center place-items-center gap-16 sm:flex-row",
          className
        )}
        {...rest}
      >
        <div
          id={`char-${character.id}`}
          className={cn(
            "relative",
            "dark:after:slime after:rick after:absolute after:inset-0 after:-left-2.5 after:top-2.5 after:z-[-1] after:block after:h-full after:animate-blob after:blur-md after:transition-all after:content-['']"
          )}
        >
          <NextImage
            isPriority
            useSkeleton
            src={character.image}
            alt={character.name}
            width={500}
            height={500}
            className={cn(
              "object-cover object-left-top",
              "relative",
              "my-0 mt-auto",
              "h-full w-60",
              "rounded-md"
            )}
          />
        </div>

        <article className={cn("w-4/5 sm:w-5/12 sm:max-w-sm", "bg-background")}>
          <div className="space-y-1">
            <h3 className="leading-none">{character.name}</h3>

            <aside className="text-sm font-semibold text-muted-foreground">
              <p className="inline-flex flex-row flex-wrap place-items-center">
                <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                  Origin:&nbsp;
                </span>
                {origin}
              </p>
              <p className="flex flex-row flex-wrap place-items-center">
                <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                  Location:&nbsp;
                </span>
                {location}
              </p>
            </aside>
          </div>

          <Separator className="my-4" />

          <div
            className={cn(
              "h-5 text-sm",
              "flex flex-row place-content-between place-items-center space-x-4"
            )}
          >
            {Object.keys(CharacterChangeFilters).map((name, idx) => {
              const key = name as keyof Character
              let attr = (character?.[key] ?? "") as string
              if (attr === "unknown") attr = "???"
              const showSeperator = idx % 2 !== 0
              return (
                <Fragment key={`attr-${key}`}>
                  {showSeperator && <Separator orientation="vertical" />}
                  <p
                    className={cn(
                      "!m-0 flex max-w-prose flex-col text-center",
                      showSeperator && "w-1/3"
                    )}
                  >
                    <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                      {key}
                    </span>
                    <span className="block truncate font-semibold">{attr}</span>
                  </p>
                  {showSeperator && <Separator orientation="vertical" />}
                </Fragment>
              )
            })}
          </div>

          {!hideFavourite && (
            <Button
              variant={favourite ? "default" : "outline"}
              onClick={handleToggleFavourite}
              className={cn(
                "mt-6 gap-2",
                favourite && "rick dark:slime",
                disableFavourite && "cursor-not-allowed"
              )}
            >
              <FavouriteIcon className="h-4 w-4" />
              Favourite
            </Button>
          )}
        </article>
      </main>
    )
  }
)

export default CharacterDetail
