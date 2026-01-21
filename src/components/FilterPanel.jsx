"use client"
import { motion } from "framer-motion"
import { X } from "lucide-react"
import { useRecipe } from "../context/RecipeContext"

const FilterPanel = ({ categories, difficulties, onClose }) => {
  const { selectedCategory, selectedDifficulty, setCategory, setDifficulty } = useRecipe()

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg border border-gray-200 p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Filters</h3>
        <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Category Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Category</h4>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setCategory(category)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Difficulty Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Difficulty</h4>
          <div className="flex flex-wrap gap-2">
            {difficulties.map((difficulty) => (
              <button
                key={difficulty}
                onClick={() => setDifficulty(difficulty)}
                className={`px-3 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedDifficulty === difficulty
                    ? "bg-primary-600 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Clear Filters */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            setCategory("all")
            setDifficulty("all")
          }}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
        >
          Clear all filters
        </button>
      </div>
    </motion.div>
  )
}

export default FilterPanel
