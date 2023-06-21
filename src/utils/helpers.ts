import { logger, LogLevel } from "@/utils"

export const getUniqueObjectListwithKeys = <T>({
  list,
  keys,
}: {
  list: T[]
  keys: (keyof T)[]
}): T[] =>
  list.filter(
    (item, index, self) =>
      index === self.findIndex((t) => keys.every((key) => t[key] === item[key]))
  )

export const getUniqueSetList = <T>(array: T[]): T[] =>
  Array.from(new Set(array))

export const isValidObjectKey = <T>({
  object,
  key,
}: {
  object: Record<string, T>
  key: string
}): boolean => {
  let isValidKey = false
  try {
    isValidKey = Object.keys(object).includes(key)
  } catch (error) {
    logger(
      { breakpoint: "[helpers.ts:26]", level: LogLevel.Error },
      "utils/helpers/isValidObjectKey",
      {
        isValidKey,
        object,
      }
    )
  }
  return isValidKey
}

export const isValidMapKey = <K, V>({
  map,
  key,
}: {
  map: Map<K, V>
  key: K
}): boolean => {
  let isValidKey = false
  try {
    isValidKey = map.has(key) || Array.from(map.keys()).includes(key)
  } catch (error) {
    logger(
      { breakpoint: "[helpers.ts:48]", level: LogLevel.Error },
      "utils/helpers/isValidMapKey",
      {
        isValidKey,
        map,
      }
    )
  }
  return isValidKey
}

export const copyObject = <T>(obj: T): T => JSON.parse(JSON.stringify(obj)) as T
