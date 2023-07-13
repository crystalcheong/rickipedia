import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import Loading from "@/components/Loading"
import { RenderGuard } from "@/components/providers"
import RickAndMortyTitle from "@/components/RickAndMortyTitle"
import { DefaultPaginationInfo } from "@/types/rickAndMorty"
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
    <BaseLayout className={cn("flex flex-col gap-8")}>
      <RickAndMortyTitle />

      <RenderGuard
        renderIf={!isLoadingCharacters && !!charactersData.length}
        fallback={isLoadingCharacters && <Loading />}
      >
        <CharacterDeck characters={charactersData} />
      </RenderGuard>
    </BaseLayout>
  )
}

export default IndexPage
