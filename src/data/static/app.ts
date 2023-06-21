import { type NextSeoProps } from "next-seo/lib/types"

export const AppName = "Rickipedia"

export const SEO: Partial<NextSeoProps> = {
  defaultTitle: AppName,
  titleTemplate: `${AppName} | %s`,
  description: "🛸 Rick and Morty character wiki",
}
