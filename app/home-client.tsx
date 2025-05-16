"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/language-provider"
import { useAppData } from "@/components/app-data-provider"

export default function HomeClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const { showOnboarding, completeOnboarding } = useAppData()

  // If onboarding is completed, redirect to generator
  useEffect(() => {
    if (!showOnboarding) {
      router.push("/generator")
    }
  }, [showOnboarding, router])

  const handleGetStarted = () => {
    completeOnboarding()
    router.push("/generator")
  }

  if (!showOnboarding) {
    return null // Will redirect
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
      <div className="animate-fade-in space-y-8">
        <div className="font-bold text-5xl mb-4">
          <span className="text-gray-900">W</span>
          <span className="text-gray-500">hat2</span>
          <span className="text-gray-900">W</span>
          <span className="text-gray-500">ear</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-gray-900">{t("home.welcome")}</h1>
          <p className="text-gray-500 max-w-md mx-auto">{t("home.subtitle")}</p>
        </div>

        <div className="flex justify-center">
          <Button size="lg" className="rounded-full px-8 bg-gray-900 hover:bg-gray-800" onClick={handleGetStarted}>
            {t("home.getStarted")}
          </Button>
        </div>

        {/* Swipe indicator */}
        <div className="absolute bottom-10 left-0 right-0 flex flex-col items-center">
          <div className="animate-bounce">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-400"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </div>
          <p className="text-sm text-gray-400 mt-2">Swipe to start</p>
        </div>
      </div>
    </div>
  )
}
