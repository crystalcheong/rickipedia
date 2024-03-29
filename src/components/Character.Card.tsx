"use client"

import { useAuth, useClerk } from "@clerk/nextjs"
import { Bookmark, BookmarkPlus } from "lucide-react"
import { block } from "million/react"
import { useRouter } from "next/router"
import { Fragment, memo, useState } from "react"

import { SignInTheme } from "@/components/Auth.SignIn"
import { CharacterChangeFilters } from "@/components/Character.Search"
import { Badge } from "@/components/ui/Badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  type CardProps,
  CardTitle,
} from "@/components/ui/Card"
import { NextImage } from "@/components/ui/Image"
import { Separator } from "@/components/ui/Separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/use-toast"
import { type Favourite } from "@/data/db/favourites/schema"
import { AppStatus, ToastStatus } from "@/data/static/app"
import { type Character } from "@/types/rickAndMorty"
import { api, cn } from "@/utils"

type CharacterCardProps = CardProps & {
  character: Character
  isFavourite?: boolean
  disableOnClick?: boolean
  hideFavourite?: boolean
  disableFavourite?: boolean
}
export const CharacterCard = ({
  character,
  className,
  isFavourite = false,
  disableOnClick = false,
  hideFavourite = false,
  disableFavourite = false,
  tilt = false,
  tiltProps = {
    glareEnable: true,
    perspective: 500,
    scale: 1.15,
    transitionSpeed: 2500,
  },
  ...rest
}: CharacterCardProps) => {
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

  //#endregion  //*======== HANDLERS ===========
  const handleOnClick = () => {
    if (disableOnClick) return
    void router.push(`/character/${character.id}`)
  }

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
  //#endregion  //*======== HANDLERS ===========

  const FavouriteIcon = memo(favourite ? BookmarkPlus : Bookmark)

  return (
    <Card
      key={character.id}
      tilt={tilt}
      tiltProps={tiltProps}
      className={cn(
        "relative cursor-pointer sm:w-64",
        tilt && "hover:z-20 hover:cursor-grab",
        "shadow-blue-500/50 hover:shadow-2xl dark:shadow-green-500/50",
        "border-[#3898AA] dark:border-[#8CE261]",
        className
      )}
      {...rest}
    >
      {/* INFO: Tilt props doesn't have onClick */}
      <div
        onClick={handleOnClick}
        className={cn("absolute inset-0 top-5 z-20")}
      />

      <CardContent className={cn("relative p-2")}>
        <aside
          className={cn(
            "absolute inset-x-0 top-0 z-10",
            "rounded-t-md",
            "flex flex-row place-content-between place-items-center"
          )}
        >
          <Badge
            className={cn(
              "h-full",
              "rounded-none rounded-br-md rounded-tl-md",
              "capitalize leading-[initial]",
              "rick dark:slime"
            )}
          >
            #{character.id}
          </Badge>

          {!hideFavourite && (
            <Badge
              onClick={handleToggleFavourite}
              className={cn(
                "z-20 h-full",
                "rounded-none rounded-bl-md rounded-tr-md",
                "capitalize leading-[initial]",
                "rick dark:slime",
                disableFavourite && "cursor-not-allowed"
              )}
            >
              <FavouriteIcon className="h-[0.9rem] w-4" />
            </Badge>
          )}
        </aside>

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
            "h-52 w-full sm:min-w-[12rem]",
            "rounded-md"
          )}
        />
      </CardContent>
      <CardHeader className="space-y-6 p-3 pt-1">
        <CardTitle className="block w-full truncate leading-normal">
          {character.name}
        </CardTitle>

        <CardDescription
          className={cn(
            "h-5 text-sm",
            "flex flex-row place-content-between place-items-center gap-2"
          )}
        >
          {Object.keys(CharacterChangeFilters).map((name, idx) => {
            const key = name as keyof Character
            let attr = (character?.[key] ?? "") as string
            if (attr === "unknown") attr = "???"
            const showSeperator = idx % 2 !== 0
            return (
              <Fragment key={`attr-${key}`}>
                <p
                  className={cn(
                    "!m-0 flex max-w-prose flex-col text-center",
                    showSeperator && "max-w-[5rem]"
                  )}
                >
                  <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                    {key}
                  </span>
                  <span className="block truncate font-semibold">{attr}</span>
                </p>
                <Separator
                  orientation="vertical"
                  className="rick dark:slime last:hidden"
                />
              </Fragment>
            )
          })}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

type SkeletonCharacterCardProps = Omit<
  CharacterCardProps,
  "character" | "tilt" | "tiltProps"
>
export const SkeletonCharacterCard = block(
  ({ className, ...rest }: SkeletonCharacterCardProps) => {
    return (
      <Card
        className={cn(
          "relative cursor-pointer sm:w-64",
          "shadow-blue-500/50 hover:shadow-2xl dark:shadow-green-500/50",
          "border-[#3898AA] dark:border-[#8CE261]",
          className
        )}
        {...rest}
      >
        <CardContent className={cn("relative p-2")}>
          <aside
            className={cn(
              "absolute inset-x-0 top-0 z-10",
              "rounded-t-md",
              "flex flex-row place-content-between place-items-center"
            )}
          >
            <Badge
              className={cn(
                "h-full",
                "rounded-none rounded-br-md rounded-tl-md",
                "capitalize leading-[initial]",
                "rick dark:slime"
              )}
            >
              #???
            </Badge>
          </aside>

          <Skeleton
            className={cn(
              "object-cover object-left-top",
              "relative",
              "my-0 mt-auto",
              "h-52 min-w-[12rem]",
              "rounded-md"
            )}
          />
        </CardContent>

        <CardHeader className="space-y-6 p-3 pt-1">
          <CardTitle className="block w-full truncate leading-normal">
            ???
          </CardTitle>

          <CardDescription
            className={cn(
              "h-5 text-sm",
              "flex flex-row place-content-between place-items-center gap-2"
            )}
          >
            {Object.keys(CharacterChangeFilters).map((name, idx) => {
              const key = name as keyof Character
              const attr = "???"
              const showSeperator = idx % 2 !== 0
              return (
                <Fragment key={`attr-${key}`}>
                  <p
                    className={cn(
                      "!m-0 flex max-w-prose flex-col text-center",
                      showSeperator && "max-w-[5rem]"
                    )}
                  >
                    <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                      {key}
                    </span>
                    <span className="block truncate font-semibold">{attr}</span>
                  </p>
                  <Separator
                    orientation="vertical"
                    className="rick dark:slime last:hidden"
                  />
                </Fragment>
              )
            })}
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }
)
CharacterCard.Skeleton = SkeletonCharacterCard

export default CharacterCard
