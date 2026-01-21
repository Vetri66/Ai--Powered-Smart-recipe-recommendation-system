"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Clock, Users, Star, Heart, Plus } from "lucide-react"
import { useRecipe } from "../context/RecipeContext"

const RecipeModal = ({ recipe, onClose }) => {
  const [activeTab, setActiveTab] = useState("ingredients")
  const { favorites, toggleFavorite, addToMealPlan } = useRecipe()
  const isFavorite = favorites.some((fav) => fav.id === recipe.id)

  const tabs = [
    { id: "ingredients", label: "Ingredients" },
    { id: "instructions", label: "Instructions" },
    { id: "nutrition", label: "Nutrition" },
  ]

  const handleAddToPlanner = () => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "lowercase" })
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const currentDay = days[new Date().getDay()]
    addToMealPlan(currentDay, recipe)
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
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative">
          <img src={recipe.image || "/placeholder.svg"} alt={recipe.name} className="w-full h-64 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-sm rounded-full text-white hover:bg-white/30 transition-colors duration-200"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Recipe Title and Info */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <h2 className="text-3xl font-bold mb-2">{recipe.name}</h2>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.cookingTime} min</span>
              </div>
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span>{recipe.rating}</span>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  recipe.difficulty === "Easy"
                    ? "bg-green-500"
                    : recipe.difficulty === "Medium"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              >
                {recipe.difficulty}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <p className="text-gray-600 flex-1 mr-4">{recipe.description}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => toggleFavorite(recipe)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                  isFavorite
                    ? "bg-red-100 text-red-700 hover:bg-red-200"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                <span>{isFavorite ? "Favorited" : "Favorite"}</span>
              </button>
              <button
                onClick={handleAddToPlanner}
                className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors duration-200"
              >
                <Plus className="h-4 w-4" />
                <span>Add to Planner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <div className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-primary-600 text-primary-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 max-h-96 overflow-y-auto">
          <AnimatePresence mode="wait">
            {activeTab === "ingredients" && (
              <motion.div
                key="ingredients"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-800">{ingredient.name}</span>
                      <span className="text-gray-600">{ingredient.amount}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "instructions" && (
              <motion.div
                key="instructions"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <p className="text-gray-700 pt-1">{instruction}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === "nutrition" && (
              <motion.div
                key="nutrition"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {Object.entries(recipe.nutrition).map(([key, value]) => (
                    <div key={key} className="text-center p-4 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-primary-600">{value}</div>
                      <div className="text-sm text-gray-600 capitalize">
                        {key === "calories"
                          ? "Calories"
                          : key === "protein"
                            ? "Protein (g)"
                            : key === "carbs"
                              ? "Carbs (g)"
                              : key === "fat"
                                ? "Fat (g)"
                                : "Fiber (g)"}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecipeModal
