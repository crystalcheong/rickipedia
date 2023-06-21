import BaseLayout from "@/components/layouts/Layout.Base"
import LocationSearch from "@/components/Location.Search"
import { cn } from "@/utils"

const LocationPage = () => {
  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <header className="mx-auto">
        <h1 className="slime bg-clip-text text-center font-schwifty text-8xl font-bold text-transparent shadow-green-500/50 drop-shadow-lg">
          Locations
        </h1>
      </header>
      <LocationSearch />
    </BaseLayout>
  )
}

export default LocationPage