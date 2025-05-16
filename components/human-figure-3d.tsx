"use client"

import { useEffect, useRef } from "react"

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

    // Animation function to rotate only the figure
    const animate = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Increment rotation
      rotationRef.current += 0.01

      // Save context state
      ctx.save()

      // Move to center of canvas
      ctx.translate(canvas.width / 2, canvas.height / 2)

      // Rotate
      ctx.rotate(rotationRef.current)

      // Draw a simple human figure silhouette
      ctx.fillStyle = "#e5e7eb"

      // Move back to draw the figure centered
      ctx.translate(-40, -150)

      // Head
      ctx.beginPath()
      ctx.arc(40, 30, 30, 0, Math.PI * 2)
      ctx.fill()

      // Body - different color based on selected item
      if (selectedItemType === "top") {
        ctx.fillStyle = "#d1d5db"
      } else {
        ctx.fillStyle = "#e5e7eb"
      }
      ctx.fillRect(0, 60, 80, 100)

      // Legs - different color based on selected item
      if (selectedItemType === "bottom") {
        ctx.fillStyle = "#d1d5db"
      } else {
        ctx.fillStyle = "#e5e7eb"
      }
      ctx.fillRect(0, 160, 30, 120)
      ctx.fillRect(50, 160, 30, 120)

      // Feet - different color based on selected item
      if (selectedItemType === "shoes") {
        ctx.fillStyle = "#d1d5db"
      } else {
        ctx.fillStyle = "#e5e7eb"
      }
      ctx.fillRect(-10, 280, 40, 15)
      ctx.fillRect(50, 280, 40, 15)

      // Arms
      ctx.fillStyle = "#e5e7eb"
      ctx.fillRect(-30, 70, 30, 80)
      ctx.fillRect(80, 70, 30, 80)

      // Restore context state
      ctx.restore()

      // Request next frame
      animationRef.current = requestAnimationFrame(animate)
    }

    // Start animation
    animate()

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

      // Calculate angle from center
      const angle = Math.atan2(dy, dx) - rotationRef.current

      // Calculate distance from center
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Check if click is within figure radius
      if (distance < 100) {
        // Determine which part was clicked based on angle and distance
        if (distance < 40) {
          // Top/body area
          onItemClick("top")
        } else if (angle > -Math.PI / 4 && angle < Math.PI / 4) {
          // Right side (arms)
          onItemClick("top")
        } else if (angle > Math.PI / 4 && angle < (3 * Math.PI) / 4) {
          // Bottom (legs/shoes)
          if (distance > 80) {
            onItemClick("shoes")
          } else {
            onItemClick("bottom")
          }
        } else if (
          (angle > (3 * Math.PI) / 4 && angle <= Math.PI) ||
          (angle >= -Math.PI && angle < (-3 * Math.PI) / 4)
        ) {
          // Left side (arms)
          onItemClick("top")
        } else {
          // Top (head/shoulders)
          onItemClick("top")
        }
      }
    }

    canvas.addEventListener("click", handleClick)

    // Cleanup function
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
      canvas.removeEventListener("click", handleClick)
    }
  }, [selectedItemType, onItemClick])

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative"
      style={{ cursor: "pointer" }}
    >
      <div className="absolute inset-0 flex items-center justify-center text-gray-400 pointer-events-none">
        {!selectedItemType && <p className="text-sm">Click on a body part to select an item</p>}
      </div>
    </div>
  )
}
