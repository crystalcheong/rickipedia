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

export const getCopiedObject = <T>(obj: T): T =>
  JSON.parse(JSON.stringify(obj)) as T

export const getRandomArrayIdx = <T>(array: T[]): number => {
  if (array.length === 0) {
    return 0
  }
  return Math.floor(Math.random() * array.length)
}

export const getRandomArrayElement = <T>(array: T[]): T | null =>
  array[getRandomArrayIdx(array)] ?? null

/**
 * @title Array Limiter
 * @description Limits an array while considering if the given array is less than the specified limit
 */
export const getLimitedArray = <T>(array: T[], limit: number): T[] =>
  Array.from(array.slice(0, Math.min(array.length, limit)))

export const getLimitedRandomArray = <T>(array: T[], limit: number): T[] => {
  const randomizedArray = array.slice() // Create a copy of the original array
  randomizedArray.sort(() => Math.random() - 0.5) // Randomize the copy using array sort

  return getLimitedArray(randomizedArray, limit) // Apply the limit to the randomized array
}
