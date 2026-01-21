"use client"
import { Routes, Route } from "react-router-dom"
import { motion } from "framer-motion"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import Planner from "./pages/Planner"
import Shopping from "./pages/Shopping"
import Profile from "./pages/Profile"
import Toast from "./components/Toast"
import { RecipeProvider } from "./context/RecipeContext"
import { useToast } from "./hooks/useToast"

function AppContent() {
  const { toast, showToast, hideToast } = useToast()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <motion.main initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/planner" element={<Planner />} />
          <Route path="/shopping" element={<Shopping />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </motion.main>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </div>
  )
}

function App() {
  return (
    <RecipeProvider>
      <AppContent />
    </RecipeProvider>
  )
}

export default App
