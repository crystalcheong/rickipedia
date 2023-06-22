import { Head, Html, Main, NextScript } from "next/document"
import { DefaultSeo } from "next-seo"

import { SEO } from "@/data/static/app"

const fonts: string[] = ["/fonts/Schwifty.woff2"]

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {fonts.map((font) => (
          <link
            key={font}
            rel="preload"
            href={font}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
        <DefaultSeo {...SEO} />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
