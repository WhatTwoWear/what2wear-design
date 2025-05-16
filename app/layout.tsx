import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { LanguageProvider } from "@/components/language-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AppDataProvider } from "@/components/app-data-provider"
import { NavigationBar } from "@/components/navigation-bar"
import { AppHeader } from "@/components/app-header"
import "@/app/globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "What2Wear",
  description: "Your personal outfit generator and wardrobe manager",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <LanguageProvider>
            <AppDataProvider>
              <div className="flex flex-col h-screen">
                <AppHeader />
                <main className="flex-1 overflow-y-auto pb-16">{children}</main>
                <NavigationBar />
              </div>
              <Toaster />
            </AppDataProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
