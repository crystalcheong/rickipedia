import { ClerkProvider } from "@clerk/nextjs"
import { type AppType } from "next/app"
import { DefaultSeo } from "next-seo"
import { ThemeProvider } from "next-themes"

import { DebugPrefix, SEO } from "@/data/static/app"
import { api } from "@/utils/api"

import "@/styles/globals.css"

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      storageKey={`${DebugPrefix}/theme`}
      enableSystem
    >
      <DefaultSeo {...SEO} />
      <ClerkProvider {...pageProps}>
        <Component {...pageProps} />
      </ClerkProvider>
    </ThemeProvider>
  )
}

export default api.withTRPC(App)
