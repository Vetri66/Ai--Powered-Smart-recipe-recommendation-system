import { motion } from "framer-motion"
import { X, Clock, Users, Star, Heart } from "lucide-react"
import { useState, useEffect } from "react"

const RecipeModal = ({ recipe, onClose }) => {
  const [isFavorite, setIsFavorite] = useState(false)
  
  useEffect(() => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]')
    setIsFavorite(favorites.some(fav => fav.id === recipe.id))
  }, [recipe.id])
  
  const toggleFavorite = () => {
    const favorites = JSON.parse(localStorage.getItem('favoriteRecipes') || '[]')
    let newFavorites
    
    if (isFavorite) {
      newFavorites = favorites.filter(fav => fav.id !== recipe.id)
    } else {
      newFavorites = [...favorites, recipe]
    }
    
    localStorage.setItem('favoriteRecipes', JSON.stringify(newFavorites))
    setIsFavorite(!isFavorite)
    
    // Dispatch custom event to update profile count
    window.dispatchEvent(new Event('favoritesUpdated'))
  }
  
  if (!recipe) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative">
          <img
            src={recipe.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"}
            alt={recipe.name}
            className="w-full h-64 object-cover rounded-t-xl"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button
              onClick={toggleFavorite}
              className={`bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all ${
                isFavorite ? 'text-red-500' : 'text-gray-600'
              }`}
            >
              <Heart className={`h-5 w-5 ${isFavorite ? 'fill-current' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="bg-white bg-opacity-90 rounded-full p-2 hover:bg-opacity-100 transition-all"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{recipe.name}</h2>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium">{recipe.rating}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-6 mb-6 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{recipe.cookingTime} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{recipe.servings} servings</span>
            </div>
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full text-xs">
              {recipe.difficulty}
            </span>
          </div>
          
          <p className="text-gray-700 dark:text-gray-300 mb-6">{recipe.description}</p>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Ingredients</h3>
              <ul className="space-y-2">
                {recipe.ingredients?.map((ingredient, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    • {ingredient.amount} {ingredient.name}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Instructions</h3>
              <ol className="space-y-2">
                {recipe.instructions?.map((instruction, index) => (
                  <li key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    {index + 1}. {instruction}
                  </li>
                ))}
              </ol>
            </div>
          </div>
          
          {recipe.nutrition && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">Nutrition Facts</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Calories:</span> {recipe.nutrition.calories}
                </div>
                <div>
                  <span className="font-medium">Protein:</span> {recipe.nutrition.protein}g
                </div>
                <div>
                  <span className="font-medium">Carbs:</span> {recipe.nutrition.carbs}g
                </div>
                <div>
                  <span className="font-medium">Fat:</span> {recipe.nutrition.fat}g
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}

export default RecipeModal