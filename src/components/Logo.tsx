import { useRouter } from "next/router"
import { type ComponentPropsWithoutRef } from "react"

import { Badge, NextImage } from "@/components/ui"
import { AppName } from "@/data/static/app"
import { useAppStore } from "@/data/stores/app"
import { cn } from "@/utils"

interface LogoProps extends ComponentPropsWithoutRef<"div"> {
  variant?: "image" | "text"
}

export const Logo = ({ variant = "text", className }: LogoProps) => {
  const router = useRouter()
  const isBeta: boolean = useAppStore().isBeta

  return (
    <div
      onClick={() => void router.push("/")}
      className={cn(
        "inline-flex cursor-pointer flex-row place-items-center gap-2",
        className
      )}
    >
      {variant === "image" && (
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
            "shadow-lg shadow-blue-500/50 hover:shadow-sm dark:shadow-green-500/50"
          )}
        />
      )}
      {variant === "text" && (
        <h4 className="rick dark:slime bg-clip-text text-transparent">
          {AppName}
        </h4>
      )}
      {isBeta && (
        <Badge
          variant="outline"
          className={cn(
            "border-[#3898AA] dark:border-[#8CE261]",
            "rick dark:slime bg-clip-text text-transparent",
            "hidden uppercase md:block"
          )}
        >
          Beta
        </Badge>
      )}
    </div>
  )
}

export default Logo
