import { Laptop, Moon, SunMedium } from "lucide-react"
import { block } from "million/react"
import { useTheme } from "next-themes"
import { Fragment } from "react"

import { RenderGuard } from "@/components/providers"
import { Separator } from "@/components/ui"
import {
  Menubar,
  MenubarMenu,
  type MenubarRoot,
  MenubarTrigger,
} from "@/components/ui/Menubar"
import { cn } from "@/utils"

const ThemeModes = {
  dark: {
    icon: Moon,
  },
  light: {
    icon: SunMedium,
  },
  system: {
    icon: Laptop,
  },
}

type ThemeSwitchProps = MenubarRoot
const ThemeSwitch = block(({ className, ...rest }: ThemeSwitchProps) => {
  const { theme, setTheme } = useTheme()
  return (
    <RenderGuard renderIf={!!theme}>
      <Menubar
        className={cn("w-fit rounded-md", className)}
        {...rest}
      >
        <MenubarMenu>
          {Object.entries(ThemeModes).map(([mode, data]) => (
            <Fragment key={`mode-${mode}`}>
              <MenubarTrigger
                onClick={() => setTheme(mode)}
                className={cn(
                  "flex flex-row place-items-center gap-1",
                  theme === mode
                    ? "rick dark:slime !text-black"
                    : "text-muted-foreground"
                )}
              >
                <data.icon className="h-4 w-4" />
                <span className="sr-only capitalize md:not-sr-only">
                  {mode}
                </span>
              </MenubarTrigger>
              <Separator
                className="last:hidden"
                orientation="vertical"
              />
            </Fragment>
          ))}
        </MenubarMenu>
      </Menubar>
    </RenderGuard>
  )
})

export default ThemeSwitch
