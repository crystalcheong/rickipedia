import { block } from "million/react"
import { useRouter } from "next/router"
import { type ReactNode } from "react"

import { Button } from "@/components/ui"
import { AppRoutes } from "@/data/static"
import { cn } from "@/utils"

import styles from "@/styles/unknown.module.css"

type UnknownProps = {
  statusCode?: number
  message?: string | ReactNode
  hideRedirect?: boolean
}
const Unknown = block(
  ({ statusCode = 0, message, hideRedirect = false }: UnknownProps) => {
    const router = useRouter()

    const isThreeDigitNumberWithZeroInMiddle = (number: number): boolean =>
      number.toString().length === 3 && number.toString()[1] === "0"

    const isValidCode: boolean = isThreeDigitNumberWithZeroInMiddle(statusCode)
    const displayedStatusCode = isValidCode ? statusCode : "???"
    const displayedMessage = message ?? (
      <>
        The page you are trying to search has been <br /> moved to another
        universe.
      </>
    )

    return (
      <section
        className={cn(
          "flex flex-col place-content-center place-items-center gap-4",
          "transition-all",
          "relative overflow-hidden"
        )}
      >
        <aside className="space" />
        <div
          className={cn(
            styles.errCode,
            "flex flex-col place-content-center place-items-center gap-4",
            "h-full max-h-full"
          )}
        >
          <span>{displayedStatusCode}</span>
          <p className="max-w-prose text-center text-xs sm:text-base">
            {displayedMessage}
          </p>

          <Button
            className={cn(
              "slime cursor-pointer font-semibold uppercase",
              hideRedirect && "hidden"
            )}
            onClick={() => void router.push(AppRoutes.Home)}
          >
            Get me home
          </Button>
        </div>
      </section>
    )
  }
)

export default Unknown
