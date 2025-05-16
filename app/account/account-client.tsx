"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Trophy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Outfit } from "@/components/app-data-provider"

export default function AccountClient() {
  const { t, language, setLanguage } = useLanguage()
  const { userProfile, updateUserProfile, likedOutfits, addTopOutfit } = useAppData()
  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false)
  const [isAddTopOutfitOpen, setIsAddTopOutfitOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleProfilePictureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, this would upload to a server
    // For now, we'll use a data URL
    const reader = new FileReader()
    reader.onload = () => {
      const imageUrl = reader.result as string
      updateUserProfile({ profilePicture: imageUrl })
    }
    reader.readAsDataURL(file)

    // Reset the input
    e.target.value = ""
  }

  const handleAddTopOutfit = (outfit: Outfit) => {
    addTopOutfit(outfit)
    setIsAddTopOutfitOpen(false)
  }

  return (
    <div className="container p-4">
      <h1 className="text-2xl font-bold mb-6">{t("account.title")}</h1>

      {/* Profile section */}
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-gray-100 overflow-hidden">
                {userProfile.profilePicture ? (
                  <img
                    src={userProfile.profilePicture || "/placeholder.svg"}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <span className="text-2xl font-bold">{userProfile.name.charAt(0)}</span>
                  </div>
                )}
              </div>
              <Button
                variant="outline"
                size="icon"
                className="absolute bottom-0 right-0 rounded-full h-8 w-8 bg-white"
                onClick={() => fileInputRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                <span className="sr-only">{t("account.changePicture")}</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfilePictureChange}
              />
            </div>
            <div>
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-8 text-gray-500"
                onClick={() => setIsLanguageDialogOpen(true)}
              >
                {language === "en" ? t("account.english") : t("account.german")}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats section */}
      <h2 className="text-lg font-medium mb-3">{t("account.stats")}</h2>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t("account.outfitsCreated")}</p>
              <p className="text-2xl font-bold">{userProfile.outfitsCreated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("account.wardrobeItems")}</p>
              <p className="text-2xl font-bold">{userProfile.wardrobeItems}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Top outfits section */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium">{t("account.topOutfits")}</h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddTopOutfitOpen(true)}
          disabled={likedOutfits.length === 0}
        >
          {t("account.addTopOutfit")}
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {userProfile.topOutfits.map((outfit, index) => (
          <Card key={outfit.id}>
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                <Trophy className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium truncate">{outfit.name}</p>
            </CardContent>
          </Card>
        ))}
        {Array.from({ length: 3 - userProfile.topOutfits.length }).map((_, index) => (
          <Card key={`empty-${index}`}>
            <CardContent className="p-3">
              <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsAddTopOutfitOpen(true)}
                  disabled={likedOutfits.length === 0}
                >
                  + Add
                </Button>
              </div>
              <p className="text-sm text-gray-400 truncate">Empty slot</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Language dialog */}
      <Dialog open={isLanguageDialogOpen} onOpenChange={setIsLanguageDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("account.language")}</DialogTitle>
          </DialogHeader>

          <RadioGroup value={language} onValueChange={setLanguage}>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="en" id="en" />
              <Label htmlFor="en">{t("account.english")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="de" id="de" />
              <Label htmlFor="de">{t("account.german")}</Label>
            </div>
          </RadioGroup>

          <DialogFooter>
            <Button onClick={() => setIsLanguageDialogOpen(false)}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add top outfit dialog */}
      <Dialog open={isAddTopOutfitOpen} onOpenChange={setIsAddTopOutfitOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("account.addTopOutfit")}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-3 max-h-[400px] overflow-y-auto">
            {likedOutfits.map((outfit) => (
              <Card
                key={outfit.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => handleAddTopOutfit(outfit)}
              >
                <CardContent className="p-3">
                  <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                    <Trophy className="h-6 w-6 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium truncate">{outfit.name}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddTopOutfitOpen(false)}>
              {t("common.cancel")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
