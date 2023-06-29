import { cn } from "@/utils"

const Loading = () => {
  return (
    <div
      className={cn("h-full min-h-[8rem] w-full")}
      style={{
        backgroundRepeat: "no-repeat",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundImage: `url("/assets/Portal-Spawns.webp")`,
      }}
    />
  )
}

export default Loading
