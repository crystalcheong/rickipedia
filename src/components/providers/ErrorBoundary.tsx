import { Component, type ErrorInfo, type PropsWithChildren } from "react"

import Unknown from "@/components/Unknown"

type Props = PropsWithChildren

interface State {
  hasError: boolean
}

/**
 * @link https://react-typescript-cheatsheet.netlify.app/docs/basic/getting-started/error_boundaries/
 */
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  }

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <Unknown />
    }

    return this.props.children
  }
}

export default ErrorBoundary
