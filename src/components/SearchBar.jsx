"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Search, X } from "lucide-react"
import { useRecipe } from "../context/RecipeContext"

const SearchBar = () => {
  const { searchQuery, setSearchQuery } = useRecipe()
  const [isFocused, setIsFocused] = useState(false)

  const handleClear = () => {
    setSearchQuery("")
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="relative"
    >
      <div className={`relative transition-all duration-300 ${isFocused ? "transform scale-105" : ""}`}>
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search recipes, ingredients, or cuisines..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className="w-full pl-12 pr-12 py-4 text-lg bg-white border-2 border-transparent rounded-xl shadow-lg focus:border-primary-300 focus:ring-4 focus:ring-primary-100 outline-none transition-all duration-300"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Search suggestions could go here */}
      {searchQuery && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
        >
          <div className="p-4">
            <p className="text-sm text-gray-600">Searching for "{searchQuery}"...</p>
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default SearchBar
