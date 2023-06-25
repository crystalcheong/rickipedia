import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { Laptop, Moon, SunMedium } from "lucide-react"
import { useTheme } from "next-themes"

import { RenderGuard } from "@/components/providers"
import { Button } from "@/components/ui"

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
            className="h-8 w-8 px-0"
          >
            <ThemeModes.light.icon className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <ThemeModes.dark.icon className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {Object.entries(ThemeModes).map(([mode, data]) => (
            <DropdownMenuItem
              key={`mode-${mode}`}
              onClick={() => setTheme(mode)}
              className="flex flex-row place-items-center gap-1"
            >
              <data.icon className="mr-2 h-4 w-4" />
              <span className="capitalize">{mode}</span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </RenderGuard>
  )
}

export default ThemeSwitch
