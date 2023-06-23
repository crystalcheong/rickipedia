import { del, get, set } from "idb-keyval"
import { type StoreApi, type UseBoundStore } from "zustand"
import { type StateStorage } from "zustand/middleware"

type WithSelectors<S> = S extends { getState: () => infer T }
  ? S & { use: { [K in keyof T]: () => T[K] } }
  : never

export const createSelectors = <S extends UseBoundStore<StoreApi<object>>>(
  _store: S
) => {
  const store = _store as WithSelectors<typeof _store>
  store.use = {}
  for (const k of Object.keys(store.getState()))
    (store.use as Record<string, unknown>)[k] = () =>
      store((s) => s[k as keyof typeof s])

  return store
}

export const storage: StateStorage = {
  getItem: async (name: string): Promise<string | null> =>
    (await get(name)) || null,
  setItem: async (name: string, value: string): Promise<void> =>
    await set(name, value),
  removeItem: async (name: string): Promise<void> => await del(name),
}
