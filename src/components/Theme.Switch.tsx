import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { Laptop, Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"
import { Fragment } from "react"

import { RenderGuard } from "@/components/providers"
import { Button, Separator } from "@/components/ui"

const ThemeModes = {
  light: {
    icon: SunMedium,
  },
  dark: {
    icon: Moon,
  },
  system: {
    icon: Laptop,
  },
}

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  return (
    <RenderGuard renderIf={!!theme}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 px-0 md:h-8 md:w-8"
          >
            <ThemeModes.light.icon className="dark:hidden" />
            <ThemeModes.dark.icon className="hidden dark:block" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="space-y-1 rounded-md border bg-background p-2"
        >
          {Object.entries(ThemeModes).map(([mode, data]) => (
            <Fragment key={`mode-${mode}`}>
              <DropdownMenuItem
                onClick={() => setTheme(mode)}
                className="flex flex-row place-items-center gap-1"
              >
                <data.icon className="mr-2 h-4 w-4" />
                <span className="capitalize">{mode}</span>
              </DropdownMenuItem>
              <Separator className="last:hidden" />
            </Fragment>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </RenderGuard>
  )
}

export default ThemeSwitch
