import BaseLayout from "@/components/layouts/Layout.Base"
import Unknown from "@/components/Unknown"
import { cn } from "@/utils"

const Error500Page = () => {
  return (
    <BaseLayout
      className={cn(
        "flex flex-col place-content-center place-items-center",
        "relative overflow-hidden"
      )}
    >
      <Unknown statusCode={500} />
    </BaseLayout>
  )
}

export default Error500Page
