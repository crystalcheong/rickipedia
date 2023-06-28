import {
  Clapperboard,
  Github,
  Globe2,
  Home,
  Map,
  Search,
  Users,
} from "lucide-react"

export const AppRoutes = {
  Home: {
    href: "/",
    icon: Home,
  },
  Search: {
    href: "/search",
    icon: Search,
  },
  Characters: {
    href: "/character",
    icon: Users,
  },
  Locations: {
    href: "/location",
    icon: Map,
  },
  Episodes: {
    href: "/episode",
    icon: Clapperboard,
  },
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
