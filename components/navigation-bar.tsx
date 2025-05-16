"use client"

import { usePathname, useRouter } from "next/navigation"
import { ShoppingBag, Wand2, Calendar, Heart } from "lucide-react"
import { useLanguage } from "./language-provider"

export function NavigationBar() {
  const pathname = usePathname()
  const router = useRouter()
  const { t } = useLanguage()

  const navItems = [
    {
      name: t("nav.wardrobe"),
      icon: ShoppingBag,
      path: "/wardrobe",
    },
    {
      name: t("nav.calendar"),
      icon: Calendar,
      path: "/calendar",
    },
    {
      name: t("nav.generator"),
      icon: Wand2,
      path: "/generator",
      highlight: true,
    },
    {
      name: t("nav.likes"),
      icon: Heart,
      path: "/likes",
    },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.path

          return (
            <button
              key={item.path}
              className={`flex flex-col items-center justify-center w-full h-full transition-colors ${
                isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"
              } ${item.highlight ? "scale-110" : ""}`}
              onClick={() => router.push(item.path)}
            >
              <item.icon className={`h-6 w-6 ${isActive ? "text-gray-900" : "text-gray-500"}`} />
              <span className="text-xs mt-1">{item.name}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}
