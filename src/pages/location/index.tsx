import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import { cn } from "@/utils"

const LocationSearch = dynamic(() => import("../../components/Location.Search"))

const LocationPage = () => {
  return (
    <BaseLayout
      className={cn("flex flex-col gap-16")}
      seo={{
        title: "Locations",
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
          Locations
        </h1>
      </header>
      <LocationSearch />
    </BaseLayout>
  )
}

export default LocationPage
