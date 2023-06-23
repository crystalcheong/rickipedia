import { Head, Html, Main, NextScript } from "next/document"

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
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
