"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Heart, Calendar, Edit, ChevronRight } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Outfit } from "@/components/app-data-provider"
import { motion } from "framer-motion"

export default function HomeClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const { isFirstVisit, completeFirstVisit, likedOutfits, outfits, renameOutfit, likeOutfit, assignOutfitToEvent } =
    useAppData()

  const [showWelcome, setShowWelcome] = useState(true)
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null)
  const [isOutfitDialogOpen, setIsOutfitDialogOpen] = useState(false)
  const [newOutfitName, setNewOutfitName] = useState("")

  // Filter out outfits that are already liked
  const unsavedOutfits = outfits
    .filter((outfit) => !likedOutfits.some((likedOutfit) => likedOutfit.id === outfit.id))
    .slice(0, 5) // Show only the 5 most recent

  // Handle first visit
  useEffect(() => {
    if (!isFirstVisit) {
      setShowWelcome(false)
    }
  }, [isFirstVisit])

  const handleSwipeUp = () => {
    completeFirstVisit()
    setShowWelcome(false)
    router.push("/generator")
  }

  const handleOutfitClick = (outfit: Outfit) => {
    setSelectedOutfit(outfit)
    setNewOutfitName(outfit.name)
    setIsOutfitDialogOpen(true)
  }

  const handleRenameOutfit = () => {
    if (selectedOutfit && newOutfitName.trim()) {
      renameOutfit(selectedOutfit.id, newOutfitName)
      setIsOutfitDialogOpen(false)
    }
  }

  const handleLikeOutfit = () => {
    if (selectedOutfit) {
      likeOutfit(selectedOutfit)
      setIsOutfitDialogOpen(false)
    }
  }

  const handleAssignToEvent = () => {
    if (selectedOutfit) {
      router.push(`/calendar?outfitId=${selectedOutfit.id}`)
    }
  }

  // Welcome screen for first visit
  if (showWelcome) {
    return (
      <motion.div
        className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mb-8"
        >
          <div className="font-bold text-5xl text-center mb-4">
            <span className="text-gray-900">W</span>
            <span className="text-gray-500">hat2</span>
            <span className="text-gray-900">W</span>
            <span className="text-gray-500">ear</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="space-y-4 text-center"
        >
          <h1 className="text-3xl font-bold text-gray-900">{t("onboarding.welcome")}</h1>
          <p className="text-gray-500 max-w-md mx-auto">{t("onboarding.subtitle")}</p>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center"
          onClick={handleSwipeUp}
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              repeat: Number.POSITIVE_INFINITY,
              duration: 1.5,
            }}
          >
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
              <path d="M12 19V5M5 12l7-7 7 7" />
            </svg>
          </motion.div>
          <p className="text-sm text-gray-400 mt-2">{t("onboarding.swipeToStart")}</p>
        </motion.div>
      </motion.div>
    )
  }

  return (
    <div className="container p-4 pb-20">
      {/* Saved Outfits Section */}
      <section className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{t("home.savedOutfits")}</h2>
          {likedOutfits.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => router.push("/likes")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        {likedOutfits.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {likedOutfits.slice(0, 4).map((outfit) => (
              <Card
                key={outfit.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOutfitClick(outfit)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    <Heart className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="font-medium truncate">{outfit.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{outfit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500">{t("home.noSavedOutfits")}</p>
            <Button className="mt-4" onClick={() => router.push("/generator")}>
              <Heart className="h-4 w-4 mr-2" />
              Generate an outfit
            </Button>
          </div>
        )}
      </section>

      {/* Unsaved Outfits Section */}
      {unsavedOutfits.length > 0 && (
        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{t("home.unsavedOutfits")}</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {unsavedOutfits.map((outfit) => (
              <Card
                key={outfit.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleOutfitClick(outfit)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    <div className="text-gray-400">
                      {new Date(outfit.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
                    </div>
                  </div>
                  <h3 className="font-medium truncate">{outfit.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{outfit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* Outfit Dialog */}
      <Dialog open={isOutfitDialogOpen} onOpenChange={setIsOutfitDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Outfit Options</DialogTitle>
          </DialogHeader>

          {selectedOutfit && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Name</label>
                <Input value={newOutfitName} onChange={(e) => setNewOutfitName(e.target.value)} />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <Button onClick={handleRenameOutfit}>
                  <Edit className="h-4 w-4 mr-2" />
                  {t("likes.rename")}
                </Button>

                {!likedOutfits.some((o) => o.id === selectedOutfit.id) && (
                  <Button onClick={handleLikeOutfit}>
                    <Heart className="h-4 w-4 mr-2" />
                    {t("generator.like")}
                  </Button>
                )}

                <Button onClick={handleAssignToEvent}>
                  <Calendar className="h-4 w-4 mr-2" />
                  {t("likes.assign")}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
