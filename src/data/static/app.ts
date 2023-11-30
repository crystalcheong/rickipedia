import { type NextSeoProps } from "next-seo/lib/types"

import AppPackage from "@/../package.json"
import { type Toast } from "@/components/ui/use-toast"

export const AppName = "Rickipedia"
export const DebugPrefix = `@${AppName.toUpperCase()}/`
export const AppVersion = AppPackage.version

export const SEO: Partial<NextSeoProps> = {
  defaultTitle: AppName,
  titleTemplate: `${AppName} | %s`,
  description: "🛸 Rick and Morty character wiki",
}

export enum AppStatus {
  "SERVER_DOWN",
  "FEATURE_UNAVAILABLE",
}
export const ToastStatus: Record<AppStatus, Toast> = {
  [AppStatus.SERVER_DOWN]: {
    variant: "destructive",
    title: "Inactive Server",
    description: "Server's on a nap. Some features will be unavailable",
    persist: true,
  },
  [AppStatus.FEATURE_UNAVAILABLE]: {
    title: "Woops, feature unavailable",
    description: "This feature is MIA rn, brb soon",
  },
}
