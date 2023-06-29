import { type LucideIcon } from "lucide-react"
import dynamic from "next/dynamic"
import { type ReactNode, useState } from "react"

import BaseLayout from "@/components/layouts/Layout.Base"
import RickAndMortyTitle from "@/components/RickAndMortyTitle"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { AppRoutes } from "@/data/static"
import { cn } from "@/utils"

const CharacterSearch = dynamic(() => import("../components/Character.Search"))
const EpisodeSearch = dynamic(() => import("../components/Episode.Search"))
const LocationSearch = dynamic(() => import("../components/Location.Search"))

export const SearchTabs: Record<
  string,
  {
    component: ReactNode
    icon: LucideIcon
  }
> = {
  characters: {
    component: <CharacterSearch />,
    icon: AppRoutes.Characters.icon,
  },
  locations: {
    component: <LocationSearch />,
    icon: AppRoutes.Locations.icon,
  },
  episodes: {
    component: <EpisodeSearch />,
    icon: AppRoutes.Episodes.icon,
  },
}

const SearchTabKeys: (keyof typeof SearchTabs)[] = Object.keys(SearchTabs)

const SearchPage = () => {
  const [tab, setTab] = useState<(typeof SearchTabKeys)[number]>(
    SearchTabKeys[0] ?? ""
  )

  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <RickAndMortyTitle />

      <Tabs
        value={tab}
        className={cn(
          "mx-auto [&>*]:w-full",
          "flex flex-col place-content-start place-items-center"
        )}
        onValueChange={setTab}
      >
        <TabsList className="!w-fit">
          {Object.entries(SearchTabs).map(([tab, content]) => (
            <TabsTrigger
              key={`tab-${tab}`}
              value={tab}
              className="capitalize"
            >
              <span className="sr-only sm:not-sr-only">{tab}</span>
              <content.icon className="h-4 w-4 sm:hidden" />
            </TabsTrigger>
          ))}
        </TabsList>
        {Object.entries(SearchTabs).map(([tab, content]) => (
          <TabsContent
            key={`tab-content-${tab}`}
            value={tab}
          >
            {content.component}
          </TabsContent>
        ))}
      </Tabs>
    </BaseLayout>
  )
}

export default SearchPage
