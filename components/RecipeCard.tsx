import { motion } from "framer-motion"
import { Clock, Users, Star, ChefHat } from "lucide-react"

const RecipeCard = ({ recipe, onViewDetails }) => {
  const getFallbackImage = (category) => {
    const fallbacks = {
      'healthy': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      'asian': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      'italian': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
      'seafood': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      'dessert': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
    }
    return fallbacks[category.toLowerCase()] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop'
  }
  
  const fallbackImage = getFallbackImage(recipe.category)

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -5 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl"
      onClick={() => onViewDetails(recipe)}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={recipe.image || fallbackImage}
          alt={recipe.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          onError={(e) => {
            const target = e.target
            if (target.src !== fallbackImage) {
              target.src = fallbackImage
            } else {
              target.src = 'https://via.placeholder.com/400x300/10b981/ffffff?text=Recipe+Image'
            }
          }}
          loading="lazy"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
          <Star className="h-3 w-3 text-yellow-500 fill-current" />
          <span className="text-xs font-medium">{recipe.rating}</span>
        </div>
        <div className="absolute top-3 left-3 bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          {recipe.category}
        </div>
      </div>

      <div className="p-4">
        <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2 line-clamp-2">{recipe.name}</h3>
        
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-3">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            <span>{recipe.cookingTime} min</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-4 w-4" />
            <span>{recipe.servings} servings</span>
          </div>
          <div className="flex items-center gap-1">
            <ChefHat className="h-4 w-4" />
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-sm">
            <span className="text-green-600 dark:text-green-400 font-semibold">{recipe.calories}</span>
            <span className="text-gray-500 ml-1">cal</span>
          </div>
          <div className="text-sm">
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{recipe.protein}g</span>
            <span className="text-gray-500 ml-1">protein</span>
          </div>
        </div>

        {recipe.dietaryRestrictions && recipe.dietaryRestrictions.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {recipe.dietaryRestrictions.slice(0, 2).map((restriction, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
              >
                {restriction}
              </span>
            ))}
            {recipe.dietaryRestrictions.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                +{recipe.dietaryRestrictions.length - 2}
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  )
}

export default RecipeCard