"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { useAppData } from "@/components/app-data-provider"
import { OutfitResult } from "@/components/outfit-result"
import { LoadingScreen } from "@/components/loading-screen"
import { X } from "lucide-react"

export default function GeneratorClient() {
  const { t } = useLanguage()
  const { generateOutfit, currentOutfit, setCurrentOutfit, isLoading, setIsLoading } = useAppData()
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const chatEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of chat when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!prompt.trim()) return

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: prompt }])

    // Clear input
    const userPrompt = prompt
    setPrompt("")

    // Show loading
    setIsLoading(true)

    try {
      // Generate outfit
      const outfit = await generateOutfit(userPrompt)

      // Add assistant message
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `I've created an outfit based on your request: "${userPrompt}". It includes a ${outfit.top.color} ${outfit.top.name} from ${outfit.top.brand}, ${outfit.bottom.color} ${outfit.bottom.name} from ${outfit.bottom.brand}, and ${outfit.shoes.color} ${outfit.shoes.name} from ${outfit.shoes.brand}.`,
        },
      ])
    } catch (error) {
      console.error("Error generating outfit:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't generate an outfit. Please try again.",
        },
      ])
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setCurrentOutfit(null)
    setIsLoading(false)
  }

  // If an outfit is being displayed, show the outfit result
  if (currentOutfit) {
    return <OutfitResult outfit={currentOutfit} />
  }

  return (
    <div className="flex flex-col h-full">
      {isLoading && <LoadingScreen />}

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t("generator.title")}</h1>

          {/* Chat messages */}
          <div className="space-y-4 mb-4">
            {messages.length === 0 && <p className="text-gray-500 text-center py-8">{t("generator.prompt")}</p>}

            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
        </div>
      </div>

      {/* Input area */}
      <div className="border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex items-center space-x-2">
            <Input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder={t("generator.placeholder")}
              className="flex-1"
              disabled={isLoading}
            />

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleCancel}
              disabled={!isLoading}
              aria-label="Cancel"
            >
              <X className="h-4 w-4" />
            </Button>

            <Button
              type="submit"
              size="icon"
              className="bg-gray-900 hover:bg-gray-800 text-white rounded-full h-10 w-10 flex items-center justify-center"
              disabled={!prompt.trim() || isLoading}
              aria-label="Generate outfit"
            >
              <span className="text-xl font-bold">W</span>
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
