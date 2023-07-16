import { block } from "million/react"
import { useRouter } from "next/router"
import { type ComponentPropsWithoutRef } from "react"

import { Badge, NextImage } from "@/components/ui"
import { AppName } from "@/data/static/app"
import { useAppStore } from "@/data/stores/app"
import { cn } from "@/utils"

type LogoProps = ComponentPropsWithoutRef<"div"> & {
  variant?: "image" | "text"
}
export const Logo = block(({ variant = "text", className }: LogoProps) => {
  const router = useRouter()
  const isBeta: boolean = useAppStore().isBeta

  return (
    <div
      onClick={() => void router.push("/")}
      className={cn(
        "inline-flex cursor-pointer flex-row place-items-center gap-2",
        "group",
        className
      )}
    >
      <NextImage
        isPriority
        useSkeleton
        src={"/assets/Logo.png"}
        alt={"logo"}
        width={500}
        height={500}
        className={cn(
          "object-cover object-left-top",
          "relative",
          "my-0 mt-auto",
          "h-8 w-full md:h-12",
          "rounded-full",
          "shadow-lg shadow-blue-500/50 group-hover:shadow-sm dark:shadow-green-500/50",
          variant !== "image" && "hidden"
        )}
      />

      <h4
        className={cn(
          "rick dark:slime bg-clip-text text-transparent",
          variant !== "text" && "hidden"
        )}
      >
        {AppName}
      </h4>
      <Badge
        variant="outline"
        className={cn(
          "border-[#3898AA] dark:border-[#8CE261]",
          "rick dark:slime bg-clip-text text-transparent",
          "group-hover:rick dark:group-hover:slime group-hover:bg-clip-border	group-hover:text-primary-foreground",
          "hidden uppercase md:block",
          !isBeta && "!hidden"
        )}
      >
        Beta
      </Badge>
    </div>
  )
})

export default Logo
