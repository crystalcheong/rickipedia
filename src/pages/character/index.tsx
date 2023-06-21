import CharacterSearch from "@/components/Character.Search"
import BaseLayout from "@/components/layouts/Layout.Base"
import { cn } from "@/utils"

const CharactersPage = () => {
  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <header className="mx-auto">
        <h1 className="slime bg-clip-text text-center font-schwifty text-8xl font-bold text-transparent shadow-green-500/50 drop-shadow-lg">
          Characters
        </h1>
      </header>
      <CharacterSearch />
    </BaseLayout>
  )
}

export default CharactersPage
