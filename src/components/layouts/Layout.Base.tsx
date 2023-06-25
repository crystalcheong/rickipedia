import Link from "next/link"
import { NextSeo, type NextSeoProps } from "next-seo"
import {
  type ComponentProps,
  type FC,
  type PropsWithChildren,
  useEffect,
  useState,
} from "react"

import Logo from "@/components/Logo"
import { RenderGuard } from "@/components/providers"
import ThemeSwitch from "@/components/Theme.Switch"
import { NextImage } from "@/components/ui"
import { AppRoutes, ExternalLinks } from "@/data/static"
import { cn } from "@/utils"

interface SlimePortalProps extends PropsWithChildren {
  show?: boolean
}

export const SlimePortal: FC<SlimePortalProps> = ({
  children,
  show = false,
}: SlimePortalProps) => {
  const [showPortal, setShowPortal] = useState<boolean>(show)

  useEffect(() => {
    setTimeout(function () {
      setShowPortal(false)
    }, 500)
  }, [children])

  return (
    <>
      {showPortal ? (
        <NextImage
          isPriority
          useSkeleton
          src={"/assets/Portal.webp"}
          alt={"logo"}
          width={500}
          height={500}
          className={cn(
            "relative",
            "m-auto !w-[50vh]",
            "animate-rotateIn transition-all ease-in-out hover:scale-150"
          )}
        />
      ) : (
        children
      )}
    </>
  )
}

export interface BaseLayoutProps extends ComponentProps<"main"> {
  showPortal?: boolean
  seo?: Partial<NextSeoProps>
}

const BaseLayout = ({
  showPortal = true,
  children,
  className,
  seo,
  ...rest
}: BaseLayoutProps) => {
  return (
    <>
      <NextSeo {...seo} />

      {/* SPACE BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <aside className="space" />
      </div>

      <header className={cn("sticky top-0 z-40", " backdrop-blur-md")}>
        <nav
          className={cn(
            "mx-auto w-10/12",
            "flex flex-row place-content-between place-items-center gap-4",
            "py-4"
          )}
        >
          <Logo variant="image" />
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
        <SlimePortal show={showPortal}>
          <RenderGuard>{children}</RenderGuard>
        </SlimePortal>
      </main>
      <footer className={cn("border-t")}>
        <main className={cn("mx-auto w-10/12", "py-4", "flex flex-col gap-4")}>
          <header className="flex flex-row flex-wrap place-content-between place-items-center">
            <Logo />

            <aside className="flex flex-row flex-wrap gap-4">
              {Object.entries(ExternalLinks).map(([link, data]) => (
                <Link
                  key={`footer-link-${link}`}
                  href={data.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "hover:slime text-muted-foreground hover:bg-clip-text hover:text-transparent sm:text-sm",
                    "inline-flex flex-row place-content-center place-items-center gap-1"
                  )}
                >
                  <data.icon className="h-4 w-4" />
                  <span className="sr-only sm:not-sr-only">{link}</span>
                </Link>
              ))}
            </aside>
          </header>

          <aside className="flex flex-col gap-2 sm:flex-row">
            {Object.entries(AppRoutes).map(([route, href]) => (
              <Link
                key={`footer-route-${route}`}
                href={href}
                rel="noreferrer"
                className="hover:slime text-muted-foreground hover:bg-clip-text hover:text-transparent sm:text-sm"
              >
                {route}
              </Link>
            ))}
          </aside>
        </main>
      </footer>
    </>
  )
}

export default BaseLayout
