import { type NextSeoProps } from "next-seo/lib/types"

import AppPackage from "@/../package.json"

export const AppName = "Rickipedia"
export const DebugPrefix = `@${AppName.toUpperCase()}/`
export const AppVersion = AppPackage.version

export const SEO: Partial<NextSeoProps> = {
  defaultTitle: AppName,
  titleTemplate: `${AppName} | %s`,
  description: "🛸 Rick and Morty character wiki",
}
