import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu"
import { Laptop2, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import { type ReactNode } from "react"

import { RenderGuard } from "@/components/providers"

const ThemeModes: Record<string, ReactNode> = {
  light: <Sun className="h-12" />,
  dark: <Moon className="h-12" />,
  system: <Laptop2 className="h-12" />,
}

const ThemeSwitch = () => {
  const { theme, setTheme } = useTheme()
  return (
    <RenderGuard renderIf={!!theme}>
      <DropdownMenu>
        <DropdownMenuTrigger aria-label="theme-switch button">
          {ThemeModes[theme ?? "system"]}
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={setTheme}
          >
            {Object.entries(ThemeModes).map(([mode]) => (
              <DropdownMenuRadioItem
                value={mode}
                key={`mode-${mode}`}
                className=" capitalize"
              >
                {mode}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </RenderGuard>
  )
}

export default ThemeSwitch
