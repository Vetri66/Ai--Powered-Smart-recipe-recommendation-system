"use client"

import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Check, X, AlertCircle, Info } from "lucide-react"

const Toast = ({ message, type = "success", isVisible, onClose, duration = 3000 }) => {
  const icons = {
    success: Check,
    error: X,
    warning: AlertCircle,
    info: Info,
  }

  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  }

  const Icon = icons[type]

  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose()
      }, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed top-4 right-4 z-50"
        >
          <div className={`flex items-center space-x-3 px-4 py-3 rounded-lg shadow-lg ${colors[type]}`}>
            <Icon className="h-5 w-5" />
            <span className="font-medium">{message}</span>
            <button onClick={onClose} className="ml-2 hover:opacity-80 transition-opacity duration-200">
              <X className="h-4 w-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default Toast
