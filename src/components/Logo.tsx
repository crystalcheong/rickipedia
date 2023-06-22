import { useRouter } from "next/router"

import { Badge, NextImage } from "@/components/ui"
import { AppName } from "@/data/static/app"
import { env } from "@/env.mjs"
import { cn } from "@/utils"

interface LogoProps {
  variant?: "image" | "text"
}

export const Logo = ({ variant = "text" }: LogoProps) => {
  const router = useRouter()
  return (
    <div
      onClick={() => void router.push("/")}
      className="inline-flex flex-row place-items-center gap-2"
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
            "h-12 w-full",
            "rounded-full",
            "shadow-lg shadow-green-500/50 hover:shadow-sm"
          )}
        />
      )}
      {variant === "text" && (
        <h4 className="slime bg-clip-text text-transparent">{AppName}</h4>
      )}
      {env.NEXT_PUBLIC_SHOW_LOGGER === "1" && (
        <Badge
          variant="outline"
          className={cn(
            "border-[#8CE261]",
            "slime bg-clip-text text-transparent",
            "uppercase"
          )}
        >
          Beta
        </Badge>
      )}
    </div>
  )
}

export default Logo
