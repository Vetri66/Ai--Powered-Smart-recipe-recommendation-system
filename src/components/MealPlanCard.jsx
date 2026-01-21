"use client"
import { motion } from "framer-motion"
import { Clock, Users, Trash2 } from "lucide-react"

const MealPlanCard = ({ recipe, onRemove }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ scale: 1.02 }}
      className="bg-gray-50 rounded-lg p-3 border border-gray-200 hover:border-primary-300 transition-all duration-200"
    >
      <div className="flex items-start space-x-3">
        {/* Recipe Image */}
        <img
          src={recipe.image || "/placeholder.svg"}
          alt={recipe.name}
          className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
        />

        {/* Recipe Info */}
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-800 text-sm line-clamp-1">{recipe.name}</h4>
          <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3" />
              <span>{recipe.cookingTime}m</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-3 w-3" />
              <span>{recipe.servings}</span>
            </div>
          </div>
        </div>

        {/* Remove Button */}
        <button onClick={onRemove} className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-200">
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}

export default MealPlanCard
