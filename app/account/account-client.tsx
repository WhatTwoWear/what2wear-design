"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Camera, Trophy, Edit, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type Outfit } from "@/components/app-data-provider"
import { motion } from "framer-motion"

export default function AccountClient() {
  const { t, language, setLanguage } = useLanguage()
  const { userProfile, updateUserProfile, updateUsername, likedOutfits, addTopOutfit, login, logout, sendMagicLink } =
    useAppData()

  const [isLanguageDialogOpen, setIsLanguageDialogOpen] = useState(false)
  const [isAddTopOutfitOpen, setIsAddTopOutfitOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isEditUsernameOpen, setIsEditUsernameOpen] = useState(false)
  const [loginTab, setLoginTab] = useState("email")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [newUsername, setNewUsername] = useState(userProfile.name)

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

  const handleLogin = async () => {
    if (loginTab === "email") {
      await login(email, password)
      setIsLoginOpen(false)
      setEmail("")
      setPassword("")
    } else {
      await sendMagicLink(email)
      setIsLoginOpen(false)
      setEmail("")
    }
  }

  const handleLogout = () => {
    logout()
  }

  const handleUpdateUsername = () => {
    if (newUsername.trim()) {
      updateUsername(newUsername)
      setIsEditUsernameOpen(false)
    }
  }

  // If user is not logged in, show login prompt
  if (!userProfile.isLoggedIn) {
    return (
      <div className="container p-4 flex flex-col items-center justify-center min-h-[80vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center space-y-6 max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-gray-100 mx-auto flex items-center justify-center">
            <span className="text-2xl font-bold text-gray-400">?</span>
          </div>

          <h1 className="text-2xl font-bold">{t("account.notLoggedIn")}</h1>

          <Button size="lg" className="w-full" onClick={() => setIsLoginOpen(true)}>
            {t("account.login")}
          </Button>
        </motion.div>

        {/* Login Dialog */}
        <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>{t("account.login")}</DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="email" value={loginTab} onValueChange={setLoginTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="email">Email & Password</TabsTrigger>
                <TabsTrigger value="magic">Magic Link</TabsTrigger>
              </TabsList>

              <TabsContent value="email" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="email">{t("account.email")}</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="password">{t("account.password")}</Label>
                    <Button variant="link" size="sm" className="h-auto p-0">
                      {t("account.forgotPassword")}
                    </Button>
                  </div>
                  <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
              </TabsContent>

              <TabsContent value="magic" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="magic-email">{t("account.email")}</Label>
                  <Input id="magic-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>

                <p className="text-sm text-gray-500">
                  We'll send you a magic link to log in instantly without a password.
                </p>
              </TabsContent>
            </Tabs>

            <DialogFooter className="mt-4">
              <Button onClick={handleLogin}>
                {loginTab === "email" ? t("account.signIn") : t("account.magicLink")}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    )
  }

  return (
    <div className="container p-4 pb-20">
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
            <div className="flex-1">
              <div className="flex items-center">
                <h2 className="text-xl font-bold">{userProfile.name}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 ml-2"
                  onClick={() => {
                    setNewUsername(userProfile.name)
                    setIsEditUsernameOpen(true)
                  }}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex items-center justify-between mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-gray-500"
                  onClick={() => setIsLanguageDialogOpen(true)}
                >
                  {language === "en" ? t("account.english") : t("account.german")}
                </Button>

                <Button variant="ghost" size="sm" className="h-8 text-red-500" onClick={handleLogout}>
                  <LogOut className="h-4 w-4 mr-1" />
                  {t("account.logout")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats section */}
      <h2 className="text-lg font-medium mb-3">{t("account.stats")}</h2>
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-500">{t("account.outfitsCreated")}</p>
              <p className="text-2xl font-bold">{userProfile.outfitsCreated}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("account.wardrobeItems")}</p>
              <p className="text-2xl font-bold">{userProfile.wardrobeItems}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">{t("account.mostUsedColor")}</p>
              <div className="flex items-center mt-1">
                {userProfile.mostUsedColor && (
                  <>
                    <div
                      className="w-4 h-4 rounded-full mr-2"
                      style={{
                        backgroundColor:
                          userProfile.mostUsedColor.toLowerCase() === "white"
                            ? "#f9fafb"
                            : userProfile.mostUsedColor.toLowerCase(),
                        border: userProfile.mostUsedColor.toLowerCase() === "white" ? "1px solid #e5e7eb" : "none",
                      }}
                    />
                    <span>{userProfile.mostUsedColor}</span>
                  </>
                )}
              </div>
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
              <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden relative">
                <Trophy className="h-6 w-6 text-gray-400" />
                <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center text-white text-xs font-bold">
                  {index + 1}
                </div>
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

      {/* Edit Username Dialog */}
      <Dialog open={isEditUsernameOpen} onOpenChange={setIsEditUsernameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("account.editUsername")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input value={newUsername} onChange={(e) => setNewUsername(e.target.value)} />
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUsernameOpen(false)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleUpdateUsername}>{t("common.save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
