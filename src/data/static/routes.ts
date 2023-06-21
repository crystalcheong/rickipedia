export interface Route {
  label: string
  href: string
}

export const AppRoutes: (Route & {
  nodes?: Route[]
})[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "Characters",
    href: "/character",
  },
  {
    label: "Locations",
    href: "/locations",
  },
]
