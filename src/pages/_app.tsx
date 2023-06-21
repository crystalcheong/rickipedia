import { type AppType } from "next/app"
import { ThemeProvider } from "next-themes"

import { api } from "@/utils/api"

import "@/styles/globals.css"

const App: AppType = ({ Component, pageProps }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
    >
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default api.withTRPC(App)
