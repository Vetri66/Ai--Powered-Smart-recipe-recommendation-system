"use client"
import { motion } from "framer-motion"

const PageTransition = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{
        type: "spring",
        damping: 25,
        stiffness: 300,
        duration: 0.3,
      }}
    >
      {children}
    </motion.div>
  )
}

export default PageTransition
