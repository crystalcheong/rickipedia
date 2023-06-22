import BaseLayout from "@/components/layouts/Layout.Base"
import Unknown from "@/components/Unknown"
import { cn } from "@/utils"

const Error404Page = () => {
  return (
    <BaseLayout
      className={cn(
        "flex flex-col place-content-center place-items-center",
        "relative overflow-hidden"
      )}
    >
      <Unknown statusCode={404} />
    </BaseLayout>
  )
}

export default Error404Page
