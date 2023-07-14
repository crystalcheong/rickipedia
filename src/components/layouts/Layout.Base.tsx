import { GitBranch } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/router"
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
import { Button, NextImage } from "@/components/ui"
import { Toaster } from "@/components/ui/Toaster"
import { AppRoutes, ExternalLinks } from "@/data/static"
import { AppVersion } from "@/data/static/app"
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
  const router = useRouter()
  return (
    <>
      <NextSeo {...seo} />

      {/* SPACE BACKGROUND */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <aside className="space" />
      </div>

      <header
        className={cn(
          "z-40 md:sticky md:top-0",
          "fixed inset-x-0 bottom-0",
          "backdrop-blur-md"
        )}
      >
        <nav
          className={cn(
            "mx-auto w-10/12",
            "flex flex-row place-content-between place-items-center gap-4",
            "py-1"
          )}
        >
          <Logo
            variant="image"
            className=""
          />

          <div
            className={cn(
              "flex flex-1 flex-row gap-3 sm:gap-8 md:gap-6",
              "place-content-evenly md:place-content-center"
            )}
          >
            {Object.entries(AppRoutes)
              .filter(([route]) => !["Home"].includes(route))
              .map(([route, info]) => {
                const isActiveRoute: boolean =
                  info.href === "/"
                    ? router.asPath === info.href
                    : router.asPath.includes(info.href)
                return (
                  <Link
                    key={`footer-route-${route}`}
                    href={info.href}
                    rel="noreferrer"
                  >
                    <Button
                      variant={isActiveRoute ? "default" : "link"}
                      size="sm"
                      className="!p-2"
                    >
                      <span className="sr-only md:not-sr-only">{route}</span>
                      <info.icon className="h-4 w-4 md:hidden" />
                    </Button>
                  </Link>
                )
              })}
          </div>
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
      <Toaster />
      <footer
        className={cn(
          "border-t",
          "bg-background/80 backdrop-blur-sm",
          "scroll-pb-10 pb-10 md:pb-0"
        )}
      >
        <main
          className={cn(
            "mx-auto w-10/12",
            "py-4",
            "flex flex-col gap-4 sm:gap-1"
          )}
        >
          <header className="flex flex-row flex-wrap place-content-between place-items-center gap-x-12 gap-y-1">
            <Logo />

            <aside className="flex flex-row flex-wrap gap-4">
              {Object.entries(ExternalLinks).map(([link, data]) => (
                <Link
                  key={`footer-link-${link}`}
                  href={data.href}
                  target="_blank"
                  rel="noreferrer"
                  className={cn(
                    "dark:hover:slime hover:rick group text-muted-foreground hover:bg-clip-text hover:text-transparent sm:text-sm",
                    "inline-flex flex-row place-content-center place-items-center gap-1"
                  )}
                >
                  <data.icon className="h-4 w-4 group-hover:text-[#3898AA] dark:group-hover:text-[#8CE261]" />
                  <span className="sr-only sm:not-sr-only">{link}</span>
                </Link>
              ))}

              <Link
                href={`${ExternalLinks.Github.href}/releases/tag/v${AppVersion}`}
                rel="noreferrer"
                className={cn(
                  "dark:hover:slime hover:rick group text-muted-foreground hover:bg-clip-text hover:text-transparent sm:text-sm",
                  "inline-flex flex-row place-content-center place-items-center gap-1"
                )}
              >
                <GitBranch className="h-4 w-4 group-hover:text-[#3898AA] dark:group-hover:text-[#8CE261]" />
                Build: {AppVersion}
              </Link>
            </aside>
          </header>

          <aside
            className={cn(
              "flex flex-col gap-2 sm:flex-row",
              "place-items-start sm:place-items-center"
            )}
          >
            {Object.entries(AppRoutes).map(([route, { href }]) => (
              <Link
                key={`footer-route-${route}`}
                href={href}
                rel="noreferrer"
                className={cn(
                  "text-muted-foreground sm:text-sm",
                  "dark:hover:slime hover:rick hover:bg-clip-text hover:text-transparent"
                )}
              >
                {route}
              </Link>
            ))}
            <ThemeSwitch className="mx-auto mt-6 sm:m-0 sm:ml-auto" />
          </aside>
        </main>
      </footer>
    </>
  )
}

export default BaseLayout
