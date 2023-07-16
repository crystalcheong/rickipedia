import dynamic from "next/dynamic"

import BaseLayout from "@/components/layouts/Layout.Base"
import { cn } from "@/utils"

const Unknown = dynamic(() => import("../components/Unknown"))

const Error404Page = () => {
  return (
    <BaseLayout
      className={cn(
        "flex flex-col place-content-center place-items-center",
        "relative overflow-hidden"
      )}
    >
      <Unknown
        statusCode={404}
        message="Excuse me, coming through. What are you here for? Just kidding, I don’t care."
      />
    </BaseLayout>
  )
}

export default Error404Page
