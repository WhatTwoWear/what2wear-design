"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Calendar, Heart } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Outfit } from "@/components/app-data-provider"

export default function LikesClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const { likedOutfits, unlikeOutfit } = useAppData()
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null)
  const [isViewOutfitOpen, setIsViewOutfitOpen] = useState(false)

  const handleViewOutfit = (outfit: Outfit) => {
    setSelectedOutfit(outfit)
    setIsViewOutfitOpen(true)
  }

  const handleUnlikeOutfit = () => {
    if (selectedOutfit) {
      unlikeOutfit(selectedOutfit.id)
      setIsViewOutfitOpen(false)
      setSelectedOutfit(null)
    }
  }

  const handleAssignToEvent = () => {
    if (selectedOutfit) {
      router.push(`/calendar?outfitId=${selectedOutfit.id}`)
    }
  }

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">{t("likes.title")}</h1>

      {likedOutfits.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {likedOutfits.map((outfit) => (
            <Card
              key={outfit.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewOutfit(outfit)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                  {/* Placeholder for outfit visualization */}
                  <div className="text-gray-400">
                    <Heart className="h-8 w-8" />
                  </div>
                </div>
                <h3 className="font-medium truncate">{outfit.name}</h3>
                <p className="text-sm text-gray-500 truncate">{outfit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">{t("likes.noOutfits")}</p>
          <Button onClick={() => router.push("/generator")}>
            <Heart className="h-4 w-4 mr-2" />
            Generate an outfit
          </Button>
        </div>
      )}

      {/* View outfit dialog */}
      <Dialog open={isViewOutfitOpen} onOpenChange={setIsViewOutfitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedOutfit?.name}</DialogTitle>
          </DialogHeader>

          {selectedOutfit && (
            <div className="space-y-4">
              <p className="text-sm text-gray-500">{selectedOutfit.description}</p>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">Top</span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedOutfit.top.name}</p>
                    <p className="text-sm text-gray-500">{selectedOutfit.top.brand}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">Bottom</span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedOutfit.bottom.name}</p>
                    <p className="text-sm text-gray-500">{selectedOutfit.bottom.brand}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">Shoes</span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedOutfit.shoes.name}</p>
                    <p className="text-sm text-gray-500">{selectedOutfit.shoes.brand}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="destructive" onClick={handleUnlikeOutfit}>
              Unlike
            </Button>
            <Button onClick={handleAssignToEvent}>
              <Calendar className="h-4 w-4 mr-2" />
              {t("likes.assignToEvent")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
