import { create } from "zustand"
import { createJSONStorage, persist } from "zustand/middleware"

import { DebugPrefix } from "@/data/static/app"
import { env } from "@/env.mjs"
import { createSelectors, storage } from "@/utils/store"

interface State {
  isBeta: boolean
}

interface Mutators {}

interface Store extends State, Mutators {}

const store = create<Store>()(
  persist(
    () => ({
      isBeta: env.NEXT_PUBLIC_SHOW_LOGGER === "1" ?? false,
    }),
    {
      name: `${DebugPrefix}/app`,
      storage: createJSONStorage(() => storage),
    }
  )
)

export const useAppStore = createSelectors(store)
