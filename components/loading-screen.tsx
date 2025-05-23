"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

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
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="font-bold text-4xl text-center">
          <span className="text-gray-900">W</span>
          <span className="text-gray-500">hat2</span>
          <span className="text-gray-900">W</span>
          <span className="text-gray-500">ear</span>
        </div>
      </motion.div>

      <motion.div
        animate={{
          opacity: [0.5, 1, 0.5],
          y: [0, -10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 1.5,
        }}
      >
        <p className="text-gray-500">Loading{dots}</p>
      </motion.div>
    </div>
  )
}
