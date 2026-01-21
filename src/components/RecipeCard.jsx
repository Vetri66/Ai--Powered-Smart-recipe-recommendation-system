"use client"
import { motion } from "framer-motion"
import { Clock, Users, Star, Heart, Plus } from "lucide-react"
import { useRecipe } from "../context/RecipeContext"

const RecipeCard = ({ recipe, onViewDetails }) => {
  const { favorites, toggleFavorite, addToMealPlan } = useRecipe()
  const isFavorite = favorites.some((fav) => fav.id === recipe.id)

  const handleAddToPlanner = (e) => {
    e.stopPropagation()
    // For demo purposes, add to today (you could make this more sophisticated)
    const today = new Date().toLocaleDateString("en-US", { weekday: "lowercase" })
    const days = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
    const currentDay = days[new Date().getDay()]
    addToMealPlan(currentDay, recipe)
  }

  const handleToggleFavorite = (e) => {
    e.stopPropagation()
    toggleFavorite(recipe)
  }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="recipe-card cursor-pointer overflow-hidden"
      onClick={() => onViewDetails && onViewDetails(recipe)}
    >
      {/* Recipe Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-3 right-3 flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleFavorite}
            className={`p-2 rounded-full backdrop-blur-sm transition-colors duration-200 ${
              isFavorite ? "bg-red-500 text-white" : "bg-white/80 text-gray-600 hover:text-red-500"
            }`}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToPlanner}
            className="p-2 rounded-full bg-white/80 backdrop-blur-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
          </motion.button>
        </div>
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              recipe.difficulty === "Easy"
                ? "bg-green-100 text-green-800"
                : recipe.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
            }`}
          >
            {recipe.difficulty}
          </span>
        </div>
      </div>

      {/* Recipe Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">{recipe.name}</h3>
          <div className="flex items-center space-x-1 ml-2">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600">{recipe.rating}</span>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>

        <div className="flex items-center justify-between text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center space-x-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default RecipeCard
