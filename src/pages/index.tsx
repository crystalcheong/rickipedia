import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import { RenderGuard } from "@/components/providers"
import RickAndMortyTitle from "@/components/RickAndMortyTitle"
import { DefaultPaginationInfo } from "@/data/clients/rickAndMorty"
import { api, cn } from "@/utils"

const CharacterDeck = dynamic(() => import("../components/Character.Deck"))

const IndexPage = () => {
  const { isLoading: isLoadingCharacters, data: charactersData = [] } =
    api.rickAndMorty.getAllCharacters.useQuery(
      {
        pagination: DefaultPaginationInfo,
      },
      {
        initialData: [],
      }
    )

  return (
    <BaseLayout className={cn("flex flex-col gap-16")}>
      <RickAndMortyTitle />

      <RenderGuard renderIf={!isLoadingCharacters && !!charactersData.length}>
        <CharacterDeck characters={charactersData} />
      </RenderGuard>
    </BaseLayout>
  )
}

export default IndexPage
