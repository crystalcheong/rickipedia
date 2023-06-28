import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import { cn } from "@/utils"

const EpisodeSearch = dynamic(() => import("../../components/Episode.Search"))

const EpisodePage = () => {
  return (
    <BaseLayout
      className={cn("flex flex-col gap-16")}
      seo={{
        title: "Episodes",
      }}
    >
      <header className="mx-auto">
        <h1
          className={cn(
            "text-center",
            "rick dark:slime bg-clip-text font-schwifty text-transparent",
            "text-5xl sm:text-7xl lg:text-8xl"
          )}
        >
          Episodes
        </h1>
      </header>
      <EpisodeSearch />
    </BaseLayout>
  )
}

export default EpisodePage
