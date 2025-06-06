"use client"

import type React from "react"

import { useState } from "react"
import { PlusCircle, Search, X, Upload, Wand2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/components/language-provider"
import { useAppData, type ClothingItem } from "@/components/app-data-provider"
import { motion } from "framer-motion"

export default function WardrobeClient() {
  const { t } = useLanguage()
  const { clothingItems, addClothingItem, updateClothingItem, deleteClothingItem, detectDominantColor, userProfile } =
    useAppData()

  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [isViewItemOpen, setIsViewItemOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null)
  const [newItem, setNewItem] = useState<Omit<ClothingItem, "id">>({
    name: "",
    type: "top",
    color: "",
    brand: "",
    size: "",
    style: "casual",
    images: [],
  })
  const [isDetectingColor, setIsDetectingColor] = useState(false)

  // Color swatches
  const colorSwatches = [
    { name: "Black", value: "#000000" },
    { name: "White", value: "#ffffff" },
    { name: "Gray", value: "#808080" },
    { name: "Navy", value: "#000080" },
    { name: "Blue", value: "#0000ff" },
    { name: "Red", value: "#ff0000" },
    { name: "Green", value: "#008000" },
    { name: "Yellow", value: "#ffff00" },
    { name: "Purple", value: "#800080" },
    { name: "Pink", value: "#ffc0cb" },
    { name: "Brown", value: "#a52a2a" },
    { name: "Beige", value: "#f5f5dc" },
  ]

  // Style options
  const styleOptions = [
    { value: "casual", label: t("wardrobe.styleCasual") },
    { value: "sport", label: t("wardrobe.styleSport") },
    { value: "business", label: t("wardrobe.styleBusiness") },
    { value: "formal", label: t("wardrobe.styleFormal") },
  ]

  // Filter items based on search query
  const filteredItems = clothingItems.filter(
    (item) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.color.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.style && item.style.toLowerCase().includes(searchQuery.toLowerCase())),
  )

  const handleAddItem = () => {
    addClothingItem(newItem)
    setNewItem({
      name: "",
      type: "top",
      color: "",
      brand: "",
      size: "",
      style: "casual",
      images: [],
    })
    setIsAddItemOpen(false)
  }

  const handleViewItem = (item: ClothingItem) => {
    setSelectedItem(item)
    setIsViewItemOpen(true)
  }

  const handleDeleteItem = () => {
    if (selectedItem) {
      deleteClothingItem(selectedItem.id)
      setIsViewItemOpen(false)
      setSelectedItem(null)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, isNewItem: boolean) => {
    const file = e.target.files?.[0]
    if (!file) return

    // In a real app, this would upload to a server
    // For now, we'll use a data URL
    const reader = new FileReader()
    reader.onload = async () => {
      const imageUrl = reader.result as string

      if (isNewItem) {
        setNewItem((prev) => ({
          ...prev,
          images: [...prev.images, imageUrl],
        }))

        // Auto-detect color if no color is set yet
        if (!newItem.color && isNewItem) {
          setIsDetectingColor(true)
          try {
            const detectedColor = await detectDominantColor(imageUrl)
            setNewItem((prev) => ({
              ...prev,
              color: detectedColor,
            }))
          } catch (error) {
            console.error("Error detecting color:", error)
          } finally {
            setIsDetectingColor(false)
          }
        }
      } else if (selectedItem) {
        const updatedItem = {
          ...selectedItem,
          images: [...selectedItem.images, imageUrl],
        }
        setSelectedItem(updatedItem)
        updateClothingItem(selectedItem.id, { images: updatedItem.images })
      }
    }
    reader.readAsDataURL(file)

    // Reset the input
    e.target.value = ""
  }

  const handleDetectColor = async (imageUrl: string, isNewItem: boolean) => {
    setIsDetectingColor(true)
    try {
      const detectedColor = await detectDominantColor(imageUrl)

      if (isNewItem) {
        setNewItem((prev) => ({
          ...prev,
          color: detectedColor,
        }))
      } else if (selectedItem) {
        updateClothingItem(selectedItem.id, { color: detectedColor })
        setSelectedItem((prev) => (prev ? { ...prev, color: detectedColor } : null))
      }
    } catch (error) {
      console.error("Error detecting color:", error)
    } finally {
      setIsDetectingColor(false)
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

          <Button size="lg" className="w-full" onClick={() => (window.location.href = "/account")}>
            {t("account.login")}
          </Button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="container p-4 pb-20">
      <h1 className="text-2xl font-bold mb-6">{t("wardrobe.title")}</h1>

      {/* Search and add */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
            placeholder="Search items..."
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6"
              onClick={() => setSearchQuery("")}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Button onClick={() => setIsAddItemOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          {t("wardrobe.addItem")}
        </Button>
      </div>

      {/* Items grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <Card
              key={item.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => handleViewItem(item)}
            >
              <CardContent className="p-4">
                <div className="aspect-square bg-gray-100 rounded-md mb-2 flex items-center justify-center overflow-hidden">
                  {item.images.length > 0 ? (
                    <img
                      src={item.images[0] || "/placeholder.svg"}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm">No image</div>
                  )}
                </div>
                <h3 className="font-medium truncate">{item.name}</h3>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-gray-500 truncate">{item.brand}</p>
                  <div className="flex items-center space-x-1">
                    {item.style && (
                      <Badge variant="outline" className="mr-1">
                        {item.style}
                      </Badge>
                    )}
                    <Badge variant="outline">{item.type}</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-40 h-40 mb-6">
            <img
              src="/placeholder.svg?height=160&width=160"
              alt="Empty wardrobe"
              className="w-full h-full object-contain opacity-50"
            />
          </div>
          <p className="text-gray-500 mb-4">{t("wardrobe.noItems")}</p>
          <Button onClick={() => setIsAddItemOpen(true)}>
            <PlusCircle className="h-4 w-4 mr-2" />
            {t("wardrobe.addFirst")}
          </Button>
        </div>
      )}

      {/* Add item dialog */}
      <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t("wardrobe.addItem")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Image upload first */}
            <div>
              <Label>{t("item.images")}</Label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {newItem.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${newItem.name} ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => handleImageUpload(e, true)} />
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{t("wardrobe.uploadImage")}</span>
                </label>
              </div>
            </div>

            <div>
              <Label htmlFor="name">{t("item.name")}</Label>
              <Input
                id="name"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="type">{t("item.type")}</Label>
              <Select value={newItem.type} onValueChange={(value) => setNewItem({ ...newItem, type: value })}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="top">Top</SelectItem>
                  <SelectItem value="bottom">Bottom</SelectItem>
                  <SelectItem value="shoes">Shoes</SelectItem>
                  <SelectItem value="accessory">Accessory</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="style">{t("wardrobe.style")}</Label>
              <Select value={newItem.style} onValueChange={(value) => setNewItem({ ...newItem, style: value })}>
                <SelectTrigger id="style">
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  {styleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex justify-between items-center">
                <Label htmlFor="color">{t("item.color")}</Label>
                {newItem.images.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDetectColor(newItem.images[0], true)}
                    disabled={isDetectingColor}
                  >
                    {isDetectingColor ? (
                      <span className="text-xs">Detecting...</span>
                    ) : (
                      <>
                        <Wand2 className="h-3 w-3 mr-1" />
                        <span className="text-xs">{t("wardrobe.detectColor")}</span>
                      </>
                    )}
                  </Button>
                )}
              </div>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {colorSwatches.map((color) => (
                  <div
                    key={color.name}
                    className={`aspect-square rounded-md cursor-pointer transition-all ${
                      newItem.color === color.name ? "ring-2 ring-gray-900 scale-110" : ""
                    }`}
                    style={{
                      backgroundColor: color.value,
                      border: color.name === "White" ? "1px solid #e5e7eb" : "none",
                    }}
                    onClick={() => setNewItem({ ...newItem, color: color.name })}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            <div>
              <Label htmlFor="brand">{t("item.brand")}</Label>
              <Input
                id="brand"
                value={newItem.brand}
                onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="size">{t("item.size")}</Label>
              <Input
                id="size"
                value={newItem.size || ""}
                onChange={(e) => setNewItem({ ...newItem, size: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
              {t("item.cancel")}
            </Button>
            <Button onClick={handleAddItem} disabled={!newItem.name || !newItem.type || !newItem.color}>
              {t("item.save")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View item dialog */}
      <Dialog open={isViewItemOpen} onOpenChange={setIsViewItemOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedItem?.name}</DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {selectedItem.images.map((image, index) => (
                  <div key={index} className="aspect-square bg-gray-100 rounded-md overflow-hidden">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`${selectedItem.name} ${index}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                <label className="aspect-square bg-gray-100 rounded-md flex flex-col items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleImageUpload(e, false)}
                  />
                  <Upload className="h-6 w-6 text-gray-400 mb-1" />
                  <span className="text-xs text-gray-500">{t("wardrobe.uploadImage")}</span>
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>{t("item.type")}</Label>
                  <p className="text-sm">{selectedItem.type}</p>
                </div>
                <div>
                  <div className="flex justify-between items-center">
                    <Label>{t("item.color")}</Label>
                    {selectedItem.images.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDetectColor(selectedItem.images[0], false)}
                        disabled={isDetectingColor}
                      >
                        {isDetectingColor ? (
                          <span className="text-xs">Detecting...</span>
                        ) : (
                          <>
                            <Wand2 className="h-3 w-3 mr-1" />
                            <span className="text-xs">{t("wardrobe.detectColor")}</span>
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center mt-1">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{
                        backgroundColor: selectedItem.color.toLowerCase() === "white" ? "#f9fafb" : selectedItem.color,
                        border: selectedItem.color.toLowerCase() === "white" ? "1px solid #e5e7eb" : "none",
                      }}
                    />
                    <span className="text-sm">{selectedItem.color}</span>
                  </div>
                </div>
                <div>
                  <Label>{t("item.brand")}</Label>
                  <p className="text-sm">{selectedItem.brand}</p>
                </div>
                <div>
                  <Label>{t("item.size")}</Label>
                  <p className="text-sm">{selectedItem.size || "-"}</p>
                </div>
                <div>
                  <Label>{t("wardrobe.style")}</Label>
                  <p className="text-sm">{selectedItem.style || "-"}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button variant="destructive" onClick={handleDeleteItem}>
              {t("item.delete")}
            </Button>
            <Button onClick={() => setIsViewItemOpen(false)}>{t("common.cancel")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
