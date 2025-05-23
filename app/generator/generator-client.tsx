"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useLanguage } from "@/components/language-provider"
import { useAppData } from "@/components/app-data-provider"
import { OutfitResult } from "@/components/outfit-result"
import { LoadingScreen } from "@/components/loading-screen"
import { X, Heart } from "lucide-react"
import { motion } from "framer-motion"

export default function GeneratorClient() {
  const { t } = useLanguage()
  const { generateOutfit, currentOutfit, setCurrentOutfit, isLoading, setIsLoading, likeOutfit, renameOutfit } =
    useAppData()
  const [prompt, setPrompt] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([])
  const [isNamingOutfit, setIsNamingOutfit] = useState(false)
  const [outfitName, setOutfitName] = useState("")
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

    // Add thinking message
    setMessages((prev) => [...prev, { role: "assistant", content: t("generator.thinking") }])

    // Show loading
    setIsLoading(true)

    try {
      // Generate outfit
      const outfit = await generateOutfit(userPrompt)

      // Replace thinking message with assistant message
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages.pop() // Remove thinking message
        newMessages.push({
          role: "assistant",
          content: `${t("generator.suggestion")} ${outfit.top.color} ${outfit.top.name}, ${outfit.bottom.color} ${outfit.bottom.name}, and ${outfit.shoes.color} ${outfit.shoes.name}.`,
        })
        return newMessages
      })
    } catch (error) {
      console.error("Error generating outfit:", error)
      setMessages((prev) => {
        const newMessages = [...prev]
        newMessages.pop() // Remove thinking message
        newMessages.push({
          role: "assistant",
          content: "Sorry, I couldn't generate an outfit. Please try again.",
        })
        return newMessages
      })
      setIsLoading(false)
    }
  }

  const handleCancel = () => {
    setCurrentOutfit(null)
    setIsLoading(false)
  }

  const handleLike = () => {
    if (currentOutfit) {
      setOutfitName(currentOutfit.name)
      setIsNamingOutfit(true)
    }
  }

  const handleSaveOutfit = () => {
    if (currentOutfit && outfitName.trim()) {
      // First rename the outfit
      renameOutfit(currentOutfit.id, outfitName)

      // Then like it
      const renamedOutfit = { ...currentOutfit, name: outfitName }
      likeOutfit(renamedOutfit)

      setIsNamingOutfit(false)
      setCurrentOutfit(null)
    }
  }

  // If an outfit is being displayed, show the outfit result
  if (currentOutfit) {
    return (
      <>
        <OutfitResult outfit={currentOutfit} onLike={handleLike} />

        {/* Name outfit dialog */}
        <Dialog open={isNamingOutfit} onOpenChange={setIsNamingOutfit}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("generator.nameOutfit")}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              <Input
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                placeholder="My perfect outfit"
                autoFocus
              />
            </div>

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsNamingOutfit(false)}>
                {t("common.cancel")}
              </Button>
              <Button onClick={handleSaveOutfit} disabled={!outfitName.trim()}>
                <Heart className="h-4 w-4 mr-2" />
                {t("generator.saveOutfit")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {isLoading && <LoadingScreen />}

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold mb-6">{t("generator.title")}</h1>

          {/* Chat messages */}
          <div className="space-y-4 mb-4">
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="text-center py-8"
              >
                <p className="text-gray-500">{t("generator.prompt")}</p>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.role === "user" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.content}
                </div>
              </motion.div>
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
