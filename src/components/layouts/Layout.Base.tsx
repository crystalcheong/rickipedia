import Link from "next/link"
import { type ComponentProps } from "react"

import { ErrorBoundary } from "@/components/providers"
import ThemeSwitch from "@/components/Theme.Switch"
import { NextImage } from "@/components/ui"
import { AppRoutes } from "@/data/static"
import { AppName } from "@/data/static/app"
import { cn } from "@/utils"

type Props = ComponentProps<"main">

const BaseLayout = ({ children, className, ...rest }: Props) => {
  return (
    <>
      <header
        className={cn("sticky top-0 z-40", "bg-background/80 backdrop-blur-md")}
      >
        <nav
          className={cn(
            "mx-auto w-10/12",
            "flex flex-row place-content-between place-items-center gap-4",
            "py-4"
          )}
        >
          <Link href="/">
            <NextImage
              isPriority
              useSkeleton
              src={"/assets/Logo.png"}
              alt={"logo"}
              width={500}
              height={500}
              className={cn(
                "object-cover object-left-top",
                "relative",
                "my-0 mt-auto",
                "h-12 w-full",
                "rounded-full",
                "shadow-lg shadow-green-500/50 hover:shadow-sm"
              )}
            />
          </Link>
          <ThemeSwitch />
        </nav>
      </header>
      <main
        className={cn(
          "scroll-py-10 py-10",
          "mx-auto min-h-[80vh] w-10/12",
          "[&>*]:w-full",
          className
        )}
        {...rest}
      >
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <footer className={cn("border-t")}>
        <main className={cn("mx-auto w-10/12", "py-4", "flex flex-col gap-4")}>
          <h4 className="slime bg-clip-text text-transparent">{AppName}</h4>

          <aside className="flex flex-col gap-2 sm:flex-row">
            {AppRoutes.map((route) => (
              <Link
                key={`footer-route-${route.label}`}
                href={route.href}
                className="hover:slime text-sm text-muted-foreground hover:bg-clip-text hover:text-transparent"
              >
                {route.label}
              </Link>
            ))}
          </aside>
        </main>
      </footer>
    </>
  )
}

export default BaseLayout
