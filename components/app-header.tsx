"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { User, Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useLanguage } from "./language-provider"

export function AppHeader() {
  const router = useRouter()
  const pathname = usePathname()
  const { language, setLanguage, t } = useLanguage()

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "de" : "en")
  }

  return (
    <header className="sticky top-0 z-10 bg-white border-b border-gray-200">
      <div className="container flex justify-between items-center h-14 px-4">
        {/* Logo - acts as home button */}
        <Link href="/" className="flex items-center">
          <div className="font-bold text-2xl text-gray-900">
            <span className="text-gray-900">W</span>
            <span className="text-gray-500">hat2</span>
            <span className="text-gray-900">W</span>
            <span className="text-gray-500">ear</span>
          </div>
        </Link>

        {/* Right side controls */}
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLanguage}
            aria-label={language === "en" ? "Switch to German" : "Switch to English"}
            className="flex items-center"
          >
            <Globe className="h-5 w-5 mr-1" />
            <span className="text-xs font-medium">{language === "en" ? "ENG" : "DE"}</span>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/account")}
            aria-label="Account"
            className="relative"
          >
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}
