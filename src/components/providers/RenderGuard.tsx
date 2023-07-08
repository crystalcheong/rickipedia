import {
  type FC,
  type PropsWithChildren,
  type ReactNode,
  useEffect,
  useState,
} from "react"

import ErrorBoundary from "@/components/providers/ErrorBoundary"

interface Props extends PropsWithChildren {
  renderIf?: boolean
  fallback?: ReactNode
}

export const RenderGuard: FC<Props> = ({
  children,
  renderIf = true,
  fallback,
}: Props) => {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [mounted])

  return (
    <ErrorBoundary>
      {renderIf && mounted ? children : fallback ?? null}
    </ErrorBoundary>
  )
}

export default RenderGuard
