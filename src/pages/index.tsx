import dynamic from "next/dynamic"
import Link from "next/link"
import { Fragment } from "react"

import BaseLayout from "@/components/layouts/Layout.Base"
import { RenderGuard } from "@/components/providers"
import { Separator } from "@/components/ui"
import { DefaultPaginationInfo } from "@/data/clients/rickAndMorty"
import { api, cn } from "@/utils"
import RickAndMortyLogo from "~/assets/RickAndMorty.svg"

const CharacterDeck = dynamic(() => import("../components/Character.Deck"))

const IndexPage = () => {
  const [
    { isLoading: isLoadingCharacters, data: charactersData = [] },
    { data: schemaLimits },
  ] = api.useQueries((trpc) => [
    trpc.rickAndMorty.getAllCharacters(
      {
        pagination: DefaultPaginationInfo,
      },
      {
        initialData: [],
      }
    ),
    trpc.rickAndMorty.getSchemaLimits(),
  ])
  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <header className="flex flex-col gap-8">
        <RickAndMortyLogo className="sm:36 h-24 w-full sm:h-36" />
        <RenderGuard renderIf={!!schemaLimits}>
          <aside
            className={cn(
              "mx-auto max-w-md",
              "text-sm",
              "flex flex-col place-content-between place-items-center gap-2 sm:flex-row"
            )}
          >
            {Object.entries(schemaLimits ?? {}).map(([type, limit]) => (
              <Fragment key={`${type}-limit`}>
                <Link
                  href={`/${type}`}
                  className={cn(
                    "font-semibold uppercase",
                    "text-muted-foreground underline-offset-4 hover:underline",
                    "max-w-prose text-center"
                  )}
                >
                  <span className="rick dark:slime bg-clip-text text-transparent">
                    {limit}&nbsp;
                  </span>
                  {type}s
                </Link>
                <Separator
                  orientation="vertical"
                  className={cn(
                    "last:hidden",
                    "rick dark:slime",
                    "h-[1px] w-20 sm:h-5 sm:w-[1px]"
                  )}
                />
              </Fragment>
            ))}
          </aside>
        </RenderGuard>
      </header>

      <RenderGuard renderIf={!isLoadingCharacters && !!charactersData.length}>
        <CharacterDeck characters={charactersData} />
      </RenderGuard>
    </BaseLayout>
  )
}

export default IndexPage
