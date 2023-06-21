import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]): string => twMerge(clsx(inputs))

/**
 * @title Base64 SVG converter
 * @description Returns an encoded SVG string
 **/
export const toBase64 = (str: string): string =>
  typeof window === "undefined"
    ? Buffer.from(str).toString("base64")
    : window.btoa(str)
