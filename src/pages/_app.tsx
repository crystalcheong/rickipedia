import { type AppType } from "next/app"
import { DefaultSeo } from "next-seo"
import { ThemeProvider } from "next-themes"

import { SEO } from "@/data/static/app"
import { api } from "@/utils/api"

import "@/styles/globals.css"

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
    >
      <DefaultSeo {...SEO} />
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default api.withTRPC(App)
