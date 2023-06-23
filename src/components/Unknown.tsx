import { useRouter } from "next/router"
import { type ReactNode } from "react"

import { Button } from "@/components/ui"
import { AppRoutes } from "@/data/static"
import { cn } from "@/utils"

import styles from "@/styles/unknown.module.css"

interface Props {
  statusCode?: number
  message?: string | ReactNode
  hideRedirect?: boolean
}
const Unknown = ({ statusCode = 0, message, hideRedirect = false }: Props) => {
  const router = useRouter()

  const isThreeDigitNumberWithZeroInMiddle = (number: number): boolean =>
    number.toString().length === 3 && number.toString()[1] === "0"

  const isValidCode: boolean = isThreeDigitNumberWithZeroInMiddle(statusCode)

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
          "h-full max-h-full scale-50 sm:scale-100"
        )}
      >
        <span>{isValidCode ? statusCode : "???"}</span>
        <p className="max-w-prose text-center">
          {message ?? (
            <>
              The page you are trying to search has been <br /> moved to another
              universe.
            </>
          )}
        </p>

        {!hideRedirect && (
          <Button
            className="slime cursor-pointer font-semibold uppercase"
            onClick={() => void router.push(AppRoutes.Home)}
          >
            Get me home
          </Button>
        )}
      </div>
    </section>
  )
}

export default Unknown
