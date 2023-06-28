import { useRouter } from "next/router"

import { LocationBaseFilters } from "@/components/Location.Search"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  type CardProps,
  CardTitle,
} from "@/components/ui/Card"
import { CharacterStatus } from "@/data/clients/rickAndMorty"
import { type RickAndMorty } from "@/types/rickAndMorty.d"
import { cn } from "@/utils"

interface LocationCardProps extends CardProps {
  location: RickAndMorty.Location
}
const LocationCard = ({ location, className, ...rest }: LocationCardProps) => {
  const router = useRouter()

  const dimension =
    !location.dimension || location.dimension === "unknown"
      ? "???"
      : location.dimension

  const handleOnClick = () => {
    void router.push(`/location/${location.id}`)
  }

  return (
    <Card
      className={cn(
        "cursor-pointer border-[#3898AA] dark:border-[#8CE261] sm:w-64 xl:w-80",
        className
      )}
      onClick={handleOnClick}
      {...rest}
    >
      <CardHeader>
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
          const key = name as keyof RickAndMorty.Location
          let attr = location?.[key]
          if (key === "residents" && Array.isArray(attr))
            attr = attr.length.toString()
          if (typeof attr !== "string") attr = ""
          if (!attr || attr === CharacterStatus.unknown) attr = "???"
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

export default LocationCard
