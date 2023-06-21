import { useRouter } from "next/router"
import { Fragment } from "react"

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
import { type Character, CharacterStatus } from "@/data/clients/rickAndMorty"
import { cn } from "@/utils"

interface CharacterCardProps extends CardProps {
  character: Character
}

const CharacterCard = ({
  character,
  className,
  tilt,
  tiltProps = {
    glareEnable: true,
    perspective: 500,
    scale: 1.15,
    transitionSpeed: 2500,
  },
  ...rest
}: CharacterCardProps) => {
  const router = useRouter()

  const handleOnClick = () => {
    void router.push(`/character/${character.id}`)
  }
  return (
    <Card
      key={character.id}
      tilt={tilt}
      tiltProps={tiltProps}
      className={cn(
        "relative w-64 cursor-pointer",
        tilt && "hover:z-20 hover:cursor-grab",
        "shadow-green-500/50 hover:shadow-2xl",
        "border-[#8CE261]",
        className
      )}
      {...rest}
    >
      {/* INFO: Tilt props doesn't have onClick */}
      <div
        onClick={handleOnClick}
        className={cn("absolute inset-0 z-20")}
      />

      <CardContent className={cn("relative p-2")}>
        <Badge
          className={cn(
            "absolute left-0 top-0 z-10",
            "rounded-none rounded-br-md rounded-tl-md",
            "capitalize leading-[initial]",
            "slime bg-gradient-to-br"
          )}
        >
          #{character.id}
        </Badge>

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
            "h-52 w-full",
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
            let attr = character?.[key]
            if (typeof attr !== "string") attr = ""
            if (attr === CharacterStatus.unknown) attr = "???"
            const showSeperator = idx % 2 !== 0
            return (
              <Fragment key={`attr-${key}`}>
                {showSeperator && (
                  <Separator
                    orientation="vertical"
                    className="bg-[#8CE261]"
                  />
                )}
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
                {showSeperator && (
                  <Separator
                    orientation="vertical"
                    className="bg-[#8CE261]"
                  />
                )}
              </Fragment>
            )
          })}
        </CardDescription>
      </CardHeader>
    </Card>
  )
}

export default CharacterCard
