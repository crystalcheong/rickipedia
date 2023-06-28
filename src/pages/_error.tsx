import { type NextPage, type NextPageContext } from "next"
import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import { cn } from "@/utils"

const Unknown = dynamic(() => import("../components/Unknown"))

interface ErrorProps {
  statusCode: number
}

const Error: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <BaseLayout
      className={cn(
        "flex flex-col place-content-center place-items-center",
        "relative overflow-hidden"
      )}
    >
      <Unknown statusCode={statusCode} />
    </BaseLayout>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode: number = res?.statusCode ?? err?.statusCode ?? 404
  return { statusCode }
}

export default Error
