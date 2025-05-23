"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Calendar, Heart, Edit, Trash2 } from "lucide-react"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Outfit } from "@/components/app-data-provider"
import { motion } from "framer-motion"

export default function LikesClient() {
  const router = useRouter()
  const { t } = useLanguage()
  const { likedOutfits, unlikeOutfit, renameOutfit, addTopOutfit, userProfile } = useAppData()
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null)
  const [isViewOutfitOpen, setIsViewOutfitOpen] = useState(false)
  const [isRenameOutfitOpen, setIsRenameOutfitOpen] = useState(false)
  const [newOutfitName, setNewOutfitName] = useState("")

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

  const handleRenameClick = () => {
    if (selectedOutfit) {
      setNewOutfitName(selectedOutfit.name)
      setIsRenameOutfitOpen(true)
    }
  }

  const handleRenameOutfit = () => {
    if (selectedOutfit && newOutfitName.trim()) {
      renameOutfit(selectedOutfit.id, newOutfitName)
      setSelectedOutfit({ ...selectedOutfit, name: newOutfitName })
      setIsRenameOutfitOpen(false)
    }
  }

  const handlePromoteToTop = () => {
    if (selectedOutfit) {
      addTopOutfit(selectedOutfit)
      setIsViewOutfitOpen(false)
    }
  }

  const canPromoteToTop =
    selectedOutfit &&
    userProfile.topOutfits.length < 3 &&
    !userProfile.topOutfits.some((outfit) => outfit.id === selectedOutfit.id)

  return (
    <div className="container p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">{t("likes.title")}</h1>

      {likedOutfits.length > 0 ? (
        <motion.div
          className="grid grid-cols-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {likedOutfits.map((outfit) => (
            <motion.div
              key={outfit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleViewOutfit(outfit)}
              >
                <CardContent className="p-4">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    <div className="text-gray-400">
                      <Heart className="h-8 w-8" />
                    </div>
                  </div>
                  <h3 className="font-medium truncate">{outfit.name}</h3>
                  <p className="text-sm text-gray-500 truncate">{outfit.description}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-40 h-40 mb-6">
            <img
              src="/placeholder.svg?height=160&width=160"
              alt="No saved outfits"
              className="w-full h-full object-contain opacity-50"
            />
          </div>
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
            <DialogTitle className="flex items-center justify-between">
              <span>{selectedOutfit?.name}</span>
              <Button variant="ghost" size="icon" onClick={handleRenameClick}>
                <Edit className="h-4 w-4" />
              </Button>
            </DialogTitle>
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
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            selectedOutfit.top.color.toLowerCase() === "white" ? "#f9fafb" : selectedOutfit.top.color,
                          border: selectedOutfit.top.color.toLowerCase() === "white" ? "1px solid #e5e7eb" : "none",
                        }}
                      />
                      <p className="text-sm text-gray-500">{selectedOutfit.top.brand}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">Bottom</span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedOutfit.bottom.name}</p>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            selectedOutfit.bottom.color.toLowerCase() === "white"
                              ? "#f9fafb"
                              : selectedOutfit.bottom.color,
                          border: selectedOutfit.bottom.color.toLowerCase() === "white" ? "1px solid #e5e7eb" : "none",
                        }}
                      />
                      <p className="text-sm text-gray-500">{selectedOutfit.bottom.brand}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-xs font-medium">Shoes</span>
                  </div>
                  <div>
                    <p className="font-medium">{selectedOutfit.shoes.name}</p>
                    <div className="flex items-center">
                      <div
                        className="w-3 h-3 rounded-full mr-2"
                        style={{
                          backgroundColor:
                            selectedOutfit.shoes.color.toLowerCase() === "white"
                              ? "#f9fafb"
                              : selectedOutfit.shoes.color,
                          border: selectedOutfit.shoes.color.toLowerCase() === "white" ? "1px solid #e5e7eb" : "none",
                        }}
                      />
                      <p className="text-sm text-gray-500">{selectedOutfit.shoes.brand}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="destructive" onClick={handleUnlikeOutfit} className="sm:order-1">
              <Trash2 className="h-4 w-4 mr-2" />
              Unlike
            </Button>

            {canPromoteToTop && (
              <Button variant="outline" onClick={handlePromoteToTop} className="sm:order-2">
                {t("likes.promote")}
              </Button>
            )}

            <Button onClick={handleAssignToEvent} className="sm:order-3">
              <Calendar className="h-4 w-4 mr-2" />
              {t("likes.assign")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename outfit dialog */}
      <Dialog open={isRenameOutfitOpen} onOpenChange={setIsRenameOutfitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("likes.rename")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={newOutfitName}
              onChange={(e) => setNewOutfitName(e.target.value)}
              placeholder="Outfit name"
              autoFocus
            />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameOutfitOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleRenameOutfit} disabled={!newOutfitName.trim()}>
              {t("common.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
