"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, Share2, X } from "lucide-react"
import { useLanguage } from "./language-provider"
import { HumanFigure3D } from "./human-figure-3d"
import { ItemCarousel } from "./item-carousel"
import { useAppData, type Outfit } from "./app-data-provider"

// Add onLike prop to the interface
interface OutfitResultProps {
  outfit: Outfit
  onLike?: () => void
}

// Update the component to use the onLike prop
export function OutfitResult({ outfit, onLike }: OutfitResultProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const { likeOutfit } = useAppData()
  const [selectedItemType, setSelectedItemType] = useState<string | null>(null)

  const handleItemClick = (type: string) => {
    setSelectedItemType(type === selectedItemType ? null : type)
  }

  const handleLike = () => {
    if (onLike) {
      onLike()
    } else {
      likeOutfit(outfit)
    }
  }

  const handleAssign = () => {
    // Navigate to calendar with this outfit
    router.push(`/calendar?outfitId=${outfit.id}`)
  }

  const handleExit = () => {
    router.push("/")
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 3D Human Figure */}
      <div className="h-[350px] bg-gray-100 rounded-xl overflow-hidden relative">
        <HumanFigure3D onItemClick={handleItemClick} selectedItemType={selectedItemType} />

        {/* Exit button */}
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 rounded-full bg-white shadow-md"
          onClick={handleExit}
          aria-label={t("generator.exit")}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Outfit Items */}
      <div className="space-y-3">
        <OutfitItem
          type="top"
          name={outfit.top.name}
          color={outfit.top.color || ""}
          brand={outfit.top.brand || ""}
          isSelected={selectedItemType === "top"}
          onClick={() => handleItemClick("top")}
        />
        <OutfitItem
          type="bottom"
          name={outfit.bottom.name}
          color={outfit.bottom.color || ""}
          brand={outfit.bottom.brand || ""}
          isSelected={selectedItemType === "bottom"}
          onClick={() => handleItemClick("bottom")}
        />
        <OutfitItem
          type="shoes"
          name={outfit.shoes.name}
          color={outfit.shoes.color || ""}
          brand={outfit.shoes.brand || ""}
          isSelected={selectedItemType === "shoes"}
          onClick={() => handleItemClick("shoes")}
        />
      </div>

      {/* Alternative suggestions */}
      {selectedItemType && <ItemCarousel type={selectedItemType} />}

      {/* Action buttons */}
      <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex space-x-3">
        <Button className="flex-1 rounded-full bg-gray-900 hover:bg-gray-800 text-white" onClick={handleLike}>
          <Heart className="mr-2 h-4 w-4" />
          {t("generator.like")}
        </Button>
        <Button variant="outline" className="flex-1 rounded-full" onClick={handleAssign}>
          <Calendar className="mr-2 h-4 w-4" />
          {t("generator.assign")}
        </Button>
        <Button variant="outline" className="flex-1 rounded-full">
          <Share2 className="mr-2 h-4 w-4" />
          {t("generator.share")}
        </Button>
      </div>
    </div>
  )
}

interface OutfitItemProps {
  type: string
  name: string
  color: string
  brand: string
  isSelected?: boolean
  onClick?: () => void
}

function OutfitItem({ type, name, color, brand, isSelected, onClick }: OutfitItemProps) {
  // Add safety check for color
  const colorValue = color || ""
  const isWhite = colorValue.toLowerCase() === "white"

  return (
    <Card
      className={`overflow-hidden transition-all duration-200 ${isSelected ? "ring-2 ring-gray-900" : ""}`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-gray-500">{brand}</p>
            <div className="flex items-center mt-1">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{
                  backgroundColor: !isWhite ? colorValue : "#f9fafb",
                  border: isWhite ? "1px solid #e5e7eb" : "none",
                }}
              />
              <span className="text-sm">{colorValue}</span>
            </div>
          </div>
          <Badge variant="outline">{type}</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
