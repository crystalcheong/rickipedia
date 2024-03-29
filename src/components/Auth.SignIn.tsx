import { SignIn, useAuth } from "@clerk/nextjs"
import { block } from "million/react"
import { useRouter } from "next/router"

import { RenderGuard } from "@/components/providers"
import { cn } from "@/utils"

export const SignInTheme = {
  elements: {
    rootBox: "bg-transparent mx-auto min-w-[60svw] max-h-screen",
    card: "p-3 m-0 max-w-none w-full [&>*:last-child]:hidden",
    formButtonPrimary:
      "dark:slime rick text-sm text-primary-foreground normal-case",
    footerActionLink:
      "rick dark:slime bg-clip-text text-transparent font-semibold",
  },
}

const AuthSignIn = block(() => {
  const { userId } = useAuth()
  const { asPath } = useRouter()
  return (
    <RenderGuard renderIf={!userId}>
      <section
        className={cn(
          "absolute inset-0",
          "flex place-content-center place-items-center",
          "backdrop-blur-md"
        )}
      >
        <SignIn
          redirectUrl={asPath}
          appearance={SignInTheme}
        />
      </section>
    </RenderGuard>
  )
})

export default AuthSignIn
