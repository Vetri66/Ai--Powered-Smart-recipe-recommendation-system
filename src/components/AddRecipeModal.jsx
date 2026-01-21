"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { X, Search, Plus } from "lucide-react"
import { recipes, searchRecipes } from "../data/recipes"
import { useRecipe } from "../context/RecipeContext"

const AddRecipeModal = ({ day, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const { addToMealPlan } = useRecipe()

  const categories = ["all", "healthy", "asian", "italian", "seafood", "dessert", "salad"]

  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    if (searchQuery.trim()) {
      filtered = searchRecipes(searchQuery)
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((recipe) => recipe.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    return filtered
  }, [searchQuery, selectedCategory])

  const handleAddRecipe = (recipe) => {
    addToMealPlan(day, recipe)
    onClose()
  }

  const dayLabels = {
    monday: "Monday",
    tuesday: "Tuesday",
    wednesday: "Wednesday",
    thursday: "Thursday",
    friday: "Friday",
    saturday: "Saturday",
    sunday: "Sunday",
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Add Recipe to {dayLabels[day]}</h2>
              <p className="text-green-100 mt-1">Choose a recipe to add to your meal plan</p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-green-700 rounded-full transition-colors duration-200">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Recipe Grid */}
        <div className="p-6 max-h-96 overflow-y-auto">
          {filteredRecipes.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No recipes found matching your criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredRecipes.map((recipe) => (
                <div key={recipe.id} className="relative">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                    <img
                      src={recipe.image || "/placeholder.svg"}
                      alt={recipe.name}
                      className="w-full h-32 object-cover rounded-t-xl"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2 line-clamp-1">{recipe.name}</h3>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{recipe.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {recipe.cookingTime} min • {recipe.servings} servings
                        </span>
                        <button
                          onClick={() => handleAddRecipe(recipe)}
                          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AddRecipeModal
