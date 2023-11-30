import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DebugPrefix } from "@/data/static/app"
import { env } from "@/env.mjs"
import {
  DefaultSchemaTypeLimits,
  type SchemaTypeLimits,
} from "@/types/rickAndMorty"
import { createSelectors, storage } from "@/utils/store"

interface State {
  isBeta: boolean
  server: {
    isDbActive: boolean
  }
  schemaLimits: SchemaTypeLimits
}

interface Mutators {
  updateSchemaLimits: (limits: Partial<SchemaTypeLimits>) => void
  updateServerStatus: (status: Partial<State["server"]>) => void
}

interface Store extends State, Mutators {}

const store = create<Store>()(
  persist(
    (set) => ({
      isBeta: env.NEXT_PUBLIC_SHOW_LOGGER === "1" ?? false,
      schemaLimits: DefaultSchemaTypeLimits,
      server: {
        isDbActive: true,
      },
      updateServerStatus: (status) =>
        set(({ server }) => ({
          server: {
            ...server,
            ...status,
          },
        })),
      updateSchemaLimits: (limits) =>
        set(({ schemaLimits }) => ({
          schemaLimits: {
            ...schemaLimits,
            ...limits,
          },
        })),
    }),
    {
      name: `${DebugPrefix}/app`,
      storage: createJSONStorage(() => storage),
    }
  )
)

export const useAppStore = createSelectors(store)
