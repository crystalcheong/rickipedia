import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import { cn } from "@/utils"

const CharacterSearch = dynamic(
  () => import("../../components/Character.Search")
)

const CharactersPage = () => {
  return (
    <BaseLayout
      className={cn("flex flex-col gap-16", "relative")}
      seo={{
        title: "Characters",
      }}
    >
      <header className="mx-auto">
        <h1
          className={cn(
            "text-center",
            "slime bg-clip-text font-schwifty text-transparent",
            "text-5xl sm:text-7xl lg:text-8xl"
          )}
        >
          Characters
        </h1>
      </header>
      <CharacterSearch />
    </BaseLayout>
  )
}

export default CharactersPage
