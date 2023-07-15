import {
  BookmarkPlus,
  Clapperboard,
  Github,
  Globe2,
  Home,
  LogIn,
  LogOut,
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
  Favourites: {
    href: "/favourites",
    icon: BookmarkPlus,
  },
}

export const AuthRoutes = {
  SignIn: {
    href: "/auth/signIn",
    icon: LogIn,
  },
  SignOut: {
    href: "/auth/signOut",
    icon: LogOut,
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
