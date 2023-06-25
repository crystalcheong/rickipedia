import { Github, Globe2 } from "lucide-react"

export const AppRoutes = {
  Home: "/",
  Characters: "/character",
  Locations: "/location",
}

export const ExternalLinks = {
  Github: {
    href: "https://github.com/crystalcheong/rickipedia",
    icon: Github,
  },
  API: {
    href: "https://rickandmortyapi.com/",
    icon: Globe2,
  },
}
