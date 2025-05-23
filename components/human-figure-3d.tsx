"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface HumanFigure3DProps {
  selectedItemType: string | null
  onItemClick: (type: string) => void
}

export function HumanFigure3D({ selectedItemType, onItemClick }: HumanFigure3DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const rotationRef = useRef<number>(0)

  // This would be replaced with actual 3D rendering logic in a real implementation
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Create canvas if it doesn't exist
    if (!canvasRef.current) {
      const canvas = document.createElement("canvas")
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
      container.appendChild(canvas)
      canvasRef.current = canvas
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw a simple human figure silhouette
    ctx.save()

    // Move to center of canvas
    ctx.translate(canvas.width / 2, canvas.height / 2)

    // Move back to draw the figure centered
    ctx.translate(-40, -150)

    // Head - different color based on selected item
    ctx.fillStyle = selectedItemType === "accessory" ? "#d1d5db" : "#e5e7eb"
    ctx.beginPath()
    ctx.arc(40, 30, 30, 0, Math.PI * 2)
    ctx.fill()

    // Body - different color based on selected item
    ctx.fillStyle = selectedItemType === "top" ? "#d1d5db" : "#e5e7eb"
    ctx.fillRect(0, 60, 80, 100)

    // Legs - different color based on selected item
    ctx.fillStyle = selectedItemType === "bottom" ? "#d1d5db" : "#e5e7eb"
    ctx.fillRect(0, 160, 30, 120)
    ctx.fillRect(50, 160, 30, 120)

    // Feet - different color based on selected item
    ctx.fillStyle = selectedItemType === "shoes" ? "#d1d5db" : "#e5e7eb"
    ctx.fillRect(-10, 280, 40, 15)
    ctx.fillRect(50, 280, 40, 15)

    // Arms
    ctx.fillStyle = "#e5e7eb"
    ctx.fillRect(-30, 70, 30, 80)
    ctx.fillRect(80, 70, 30, 80)

    // Restore context state
    ctx.restore()

    // Add click handlers for different body parts
    const handleClick = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top

      // Convert to canvas center coordinates
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Calculate distance from center
      const dx = x - centerX
      const dy = y - centerY

      // Calculate distance from center
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Determine which part was clicked based on y position
      const relativeY = y - rect.top

      if (relativeY < canvas.height * 0.2) {
        // Head/accessories area
        onItemClick("accessory")
      } else if (relativeY < canvas.height * 0.4) {
        // Top/body area
        onItemClick("top")
      } else if (relativeY < canvas.height * 0.7) {
        // Bottom/legs area
        onItemClick("bottom")
      } else {
        // Shoes/feet area
        onItemClick("shoes")
      }
    }

    canvas.addEventListener("click", handleClick)

    // Cleanup function
    return () => {
      canvas.removeEventListener("click", handleClick)
    }
  }, [selectedItemType, onItemClick])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative"
      style={{ cursor: "pointer" }}
    >
      {/* Clickable zones with labels */}
      <div className="absolute inset-0 flex flex-col pointer-events-none">
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ opacity: selectedItemType === "accessory" ? 1 : 0.5 }}
            className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded"
          >
            Accessories
          </motion.div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ opacity: selectedItemType === "top" ? 1 : 0.5 }}
            className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded"
          >
            Tops
          </motion.div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ opacity: selectedItemType === "bottom" ? 1 : 0.5 }}
            className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded"
          >
            Bottoms
          </motion.div>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <motion.div
            animate={{ opacity: selectedItemType === "shoes" ? 1 : 0.5 }}
            className="text-xs text-gray-500 bg-white/80 px-2 py-1 rounded"
          >
            Shoes
          </motion.div>
        </div>
      </div>

      <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
        {!selectedItemType && <p className="text-sm">Tap on a body part to select an item</p>}
      </div>
    </div>
  )
}
