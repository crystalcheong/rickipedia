import { useRouter } from "next/router"

import { Button } from "@/components/ui"
import { AppRoutes } from "@/data/static"
import { cn } from "@/utils"

import styles from "@/styles/unknown.module.css"

interface Props {
  statusCode?: number
}
const Unknown = ({ statusCode = 0 }: Props) => {
  const router = useRouter()

  const isThreeDigitNumberWithZeroInMiddle = (number: number): boolean =>
    number.toString().length === 3 && number.toString()[1] === "0"

  const isValidCode: boolean = isThreeDigitNumberWithZeroInMiddle(statusCode)

  return (
    <section
      className={cn(
        "flex flex-col place-content-center place-items-center gap-4",
        "transition-all"
      )}
    >
      <aside className="space" />
      <div
        className={cn(
          styles.errCode,
          "max-h-[30vh] scale-50 sm:max-h-[45vh] sm:scale-100"
        )}
      >
        <span>{isValidCode ? statusCode : "???"}</span>
      </div>
      <p className="max-w-prose text-center">
        The page you are trying to search has been <br /> moved to another
        universe.
      </p>

      <Button
        className="slime cursor-pointer font-semibold uppercase"
        onClick={() => void router.push(AppRoutes.Home)}
      >
        Get me home
      </Button>
    </section>
  )
}

export default Unknown
