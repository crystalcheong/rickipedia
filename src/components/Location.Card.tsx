import { useAuth, useClerk } from "@clerk/nextjs"
import { Bookmark, BookmarkPlus } from "lucide-react"
import { block } from "million/react"
import { useRouter } from "next/router"
import { memo, useState } from "react"

import { SignInTheme } from "@/components/Auth.SignIn"
import { LocationBaseFilters } from "@/components/Location.Search"
import { Badge } from "@/components/ui"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
} from "@/components/ui/Card"
import { type Favourite } from "@/data/db/favourites/schema"
import { type Location } from "@/types/rickAndMorty"
import { api, cn } from "@/utils"

type LocationCardProps = CardProps & {
  location: Location
  isFavourite?: boolean
  disableFavourite?: boolean
}
const LocationCard = block(
  ({
    location,
    className,
    isFavourite = false,
    disableFavourite = false,
    ...rest
  }: LocationCardProps) => {
    const router = useRouter()
    const { openSignIn } = useClerk()
    const { userId } = useAuth()

    const dimension =
      !location.dimension || location.dimension === "unknown"
        ? "???"
        : location.dimension

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
      void router.push(`/location/${location.id}`)
    }

    const handleToggleFavourite = () => {
      if (!location) return
      if (!userId)
        return openSignIn({
          redirectUrl: router.asPath,
          appearance: SignInTheme,
        })

      const params: Pick<Favourite, "schemaId" | "schemaType"> = {
        schemaType: "location",
        schemaId: location.id,
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
        className={cn(
          "relative",
          "cursor-pointer border-[#3898AA] dark:border-[#8CE261] sm:w-64 xl:w-80",
          className
        )}
        {...rest}
      >
        {/* INFO: Tilt props doesn't have onClick */}
        <div
          onClick={handleOnClick}
          className={cn("absolute inset-0 top-5 z-20")}
        />

        <CardHeader className="relative">
          {!disableFavourite && (
            <Badge
              onClick={handleToggleFavourite}
              className={cn(
                "absolute right-0 top-0 z-20 ",
                "rounded-none rounded-bl-md rounded-tr-md",
                "capitalize leading-[initial]",
                "rick dark:slime"
              )}
            >
              <FavouriteIcon className="h-[0.9rem] w-4" />
            </Badge>
          )}

          <CardTitle className="block w-full truncate leading-normal">
            {location.name}
          </CardTitle>
          <CardDescription className="text-sm font-semibold text-muted-foreground">
            <p className="flex flex-row flex-wrap place-items-center">
              <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                Dimension:&nbsp;
              </span>
              {dimension}
            </p>
          </CardDescription>
        </CardHeader>
        <CardFooter
          className={cn(
            "text-sm",
            "flex flex-col place-content-between place-items-center gap-4 sm:flex-row"
          )}
        >
          {Object.keys(LocationBaseFilters).map((name) => {
            const key = name as keyof Location
            let attr = location?.[key]
            if (key === "residents" && Array.isArray(attr))
              attr = attr.length.toString()
            if (typeof attr !== "string") attr = ""
            if (!attr || attr === "unknown") attr = "???"
            return (
              <p
                key={`attr-${key}`}
                className={cn(
                  "!m-0 flex max-w-prose flex-1 flex-col text-center"
                )}
              >
                <span className="text-[0.5rem] font-light uppercase leading-tight text-muted-foreground	">
                  {key}
                </span>
                <span className="block truncate whitespace-break-spaces font-semibold capitalize !leading-tight">
                  {attr}
                </span>
              </p>
            )
          })}
        </CardFooter>
      </Card>
    )
  }
)

export default LocationCard
