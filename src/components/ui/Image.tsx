import Image, { type ImageProps } from "next/image"
import { useState } from "react"

import { cn, toBase64 } from "@/utils/dom"

type NextImageProps = {
  isPriority?: boolean
  useSkeleton?: boolean
  blurClassName?: string
  alt: string
  width: string | number
} & (
  | { width: string | number; height: string | number }
  | { layout: "fill"; width?: string | number; height?: string | number }
) &
  ImageProps

/**
 *
 * @description Must set width using `w-` className
 * @param useSkeleton add background with pulse animation, don't use it if image is transparent
 */
const NextImage = ({
  isPriority = false,
  useSkeleton = false,
  src,
  width,
  height,
  alt,
  className,
  blurClassName,
  ...rest
}: NextImageProps) => {
  const [status, setStatus] = useState(useSkeleton ? "loading" : "complete")

  return (
    <Image
      className={cn(
        className,
        status === "loading" && cn("animate-pulse", blurClassName)
      )}
      src={src}
      width={width}
      height={height}
      alt={alt}
      placeholder="blur"
      blurDataURL={`data:image/svg+xml;base64,${toBase64(shimmer(700, 475))}`}
      onLoadingComplete={() => setStatus("complete")}
      priority={isPriority}
      {...rest}
    />
  )
}

const shimmer = (w: number, h: number) =>
  `<svg width="${w}" height="${h}" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <linearGradient id="g">
      <stop stop-color="#333" offset="20%" />
      <stop stop-color="#222" offset="50%" />
      <stop stop-color="#333" offset="70%" />
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="#333" />
  <rect id="r" width="${w}" height="${h}" fill="url(#g)" />
  <animate xlink:href="#r" attributeName="x" from="-${w}" to="${w}" dur="1s" repeatCount="indefinite"  />
</svg>`

export { NextImage }
