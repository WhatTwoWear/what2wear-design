"use client"

import { useEffect, useState } from "react"

export function LoadingScreen() {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => {
        if (prev.length >= 3) return ""
        return prev + "."
      })
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white z-50">
      <div className="animate-pulse">
        <div className="font-bold text-4xl text-center mb-4">
          <span className="text-gray-900">W</span>
          <span className="text-gray-500">hat2</span>
          <span className="text-gray-900">W</span>
          <span className="text-gray-500">ear</span>
        </div>
      </div>
      <p className="text-gray-500 mt-4">Loading{dots}</p>
    </div>
  )
}
