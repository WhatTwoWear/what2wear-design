"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useAppData, type ClothingItem } from "./app-data-provider"

interface ItemCarouselProps {
  type: string
}

export function ItemCarousel({ type }: ItemCarouselProps) {
  const { clothingItems } = useAppData()
  const [items, setItems] = useState<ClothingItem[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)

  // Filter items by type
  useEffect(() => {
    const filteredItems = clothingItems.filter((item) => item.type.toLowerCase() === type.toLowerCase())

    // If no items of this type exist, create placeholder items
    if (filteredItems.length === 0) {
      const placeholders: ClothingItem[] = [
        {
          id: `placeholder_${type}_1`,
          name: type === "top" ? "T-shirt" : type === "bottom" ? "Jeans" : "Sneakers",
          type,
          color: type === "top" ? "Black" : type === "bottom" ? "Blue" : "White",
          brand: "Generic",
          images: ["/placeholder.svg?height=300&width=300"],
        },
        {
          id: `placeholder_${type}_2`,
          name: type === "top" ? "Polo Shirt" : type === "bottom" ? "Chinos" : "Loafers",
          type,
          color: type === "top" ? "Navy" : type === "bottom" ? "Beige" : "Brown",
          brand: "Generic",
          images: ["/placeholder.svg?height=300&width=300"],
        },
        {
          id: `placeholder_${type}_3`,
          name: type === "top" ? "Sweater" : type === "bottom" ? "Shorts" : "Boots",
          type,
          color: type === "top" ? "Gray" : type === "bottom" ? "Black" : "Black",
          brand: "Generic",
          images: ["/placeholder.svg?height=300&width=300"],
        },
      ]
      setItems(placeholders)
    } else {
      setItems(filteredItems)
    }

    setCurrentIndex(0)
  }, [type, clothingItems])

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : items.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < items.length - 1 ? prev + 1 : 0))
  }

  // Ensure we have a valid currentItem with fallback values
  const currentItem = items[currentIndex] || {
    id: "",
    name: "",
    color: "",
    brand: "",
    type: "",
    images: [],
  }

  // Safely access color with fallback
  const colorValue = currentItem?.color || ""
  const isWhite = colorValue.toLowerCase() === "white"

  return (
    <div className="space-y-3">
      <h3 className="font-medium">Alternative {type} options</h3>
      <div className="relative">
        <Card className="overflow-hidden">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">{currentItem.name}</h3>
                <p className="text-sm text-gray-500">{currentItem.brand}</p>
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
            </div>
          </CardContent>
        </Card>

        {items.length > 1 && (
          <div className="absolute inset-y-0 left-0 right-0 flex justify-between items-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-md"
              onClick={handlePrevious}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full bg-white shadow-md"
              onClick={handleNext}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next</span>
            </Button>
          </div>
        )}
      </div>
      <div className="flex justify-center">
        {items.map((_, index) => (
          <div
            key={index}
            className={`h-1.5 w-1.5 rounded-full mx-1 ${index === currentIndex ? "bg-gray-900" : "bg-gray-300"}`}
          />
        ))}
      </div>
    </div>
  )
}
