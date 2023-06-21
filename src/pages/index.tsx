import { type ReactNode, useState } from "react"

import CharacterSearch from "@/components/Character.Search"
import EpisodeSearch from "@/components/Episode.Search"
import BaseLayout from "@/components/layouts/Layout.Base"
import LocationSearch from "@/components/Location.Search"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { cn } from "@/utils"
import RickAndMorty from "~/assets/RickAndMorty.svg"

export const SearchTabs: Record<string, ReactNode> = {
  characters: <CharacterSearch />,
  locations: <LocationSearch />,
  episodes: <EpisodeSearch />,
}

const SearchTabKeys: (keyof typeof SearchTabs)[] = Object.keys(SearchTabs)

const IndexPage = () => {
  const [tab, setTab] = useState<(typeof SearchTabKeys)[number]>(
    SearchTabKeys[0] ?? ""
  )

  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <header>
        <RickAndMorty className="sm:36 h-24 w-full sm:h-36" />
      </header>

      <Tabs
        value={tab}
        className={cn(
          "mx-auto [&>*]:w-full",
          "flex flex-col place-content-start place-items-center"
        )}
        onValueChange={setTab}
      >
        <TabsList className="!w-fit">
          {SearchTabKeys.map((tab) => (
            <TabsTrigger
              key={`tab-${tab}`}
              value={tab}
              className="capitalize"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(SearchTabs).map(([tab, content]) => (
          <TabsContent
            key={`tab-content-${tab}`}
            value={tab}
          >
            {content}
          </TabsContent>
        ))}
      </Tabs>
    </BaseLayout>
  )
}

export default IndexPage
