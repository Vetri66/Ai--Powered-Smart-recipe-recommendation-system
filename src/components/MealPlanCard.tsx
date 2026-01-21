import { motion } from "framer-motion"
import { Clock, Users, X } from "lucide-react"

const MealPlanCard = ({ recipe, onRemove }) => {
  const getFallbackImage = (category) => {
    const fallbacks = {
      'healthy': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=120&fit=crop',
      'asian': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=200&h=120&fit=crop',
      'italian': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=200&h=120&fit=crop',
      'seafood': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=200&h=120&fit=crop',
      'dessert': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=120&fit=crop',
      'salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=200&h=120&fit=crop'
    }
    return fallbacks[category?.toLowerCase()] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=120&fit=crop'
  }
  
  const fallbackImage = getFallbackImage(recipe.category)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="bg-white dark:bg-gray-700 rounded-lg overflow-hidden shadow-md relative group"
    >
      <button
        onClick={onRemove}
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-red-500 hover:bg-red-600 rounded-full"
      >
        <X className="h-3 w-3 text-white" />
      </button>
      
      <div className="relative h-20 overflow-hidden">
        <img
          src={recipe.image || fallbackImage}
          alt={recipe.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target
            if (target.src !== fallbackImage) {
              target.src = fallbackImage
            }
          }}
          loading="lazy"
        />
      </div>
      
      <div className="p-3">
        <h4 className="font-medium text-sm text-gray-800 dark:text-white mb-2 line-clamp-2">
          {recipe.name}
        </h4>
        
        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-300">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{recipe.cookingTime}min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{recipe.servings}</span>
          </div>
          <div className="text-green-600 font-semibold">
            {recipe.calories}cal
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default MealPlanCard