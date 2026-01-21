import { motion } from "framer-motion"
import { X, Search } from "lucide-react"
import { useState } from "react"
import { recipes } from "../data/recipes"
import { useRecipe } from "../context/RecipeContext"

const AddRecipeModal = ({ day, onClose }) => {
  const [searchQuery, setSearchQuery] = useState("")
  const { addToMealPlan } = useRecipe()
  
  const filteredRecipes = recipes.filter(recipe =>
    recipe.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAddRecipe = (recipe) => {
    if (addToMealPlan) {
      addToMealPlan(day, recipe)
    }
    onClose()
  }
  
  const getFallbackImage = (category) => {
    const fallbacks = {
      'healthy': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
      'asian': 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop',
      'italian': 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop',
      'seafood': 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
      'dessert': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
      'salad': 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop'
    }
    return fallbacks[category?.toLowerCase()] || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjQiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA2NCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjY0IiBoZWlnaHQ9IjQ4IiBmaWxsPSIjMTBiOTgxIi8+Cjx0ZXh0IHg9IjMyIiB5PSIyNCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPvCfjZ08L3RleHQ+Cjwvc3ZnPgo='
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
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-gray-800 rounded-xl max-w-2xl w-full max-h-[80vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Add Recipe to {day?.charAt(0).toUpperCase() + day?.slice(1)}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <div className="p-6">
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search recipes..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="max-h-96 overflow-y-auto space-y-3">
            {filteredRecipes.map((recipe) => {
              const fallbackImage = getFallbackImage(recipe.category)
              return (
                <div
                  key={recipe.id}
                  className="flex items-center gap-3 p-3 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => handleAddRecipe(recipe)}
                >
                  <div className="w-16 h-12 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                    <img
                      src={recipe.image || fallbackImage}
                      alt={recipe.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        if (e.target.src !== fallbackImage) {
                          e.target.src = fallbackImage
                        }
                      }}
                      loading="lazy"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 dark:text-white">{recipe.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {recipe.cookingTime} min • {recipe.servings} servings • {recipe.calories} cal
                    </p>
                    <div className="flex gap-1 mt-1">
                      {recipe.tags?.slice(0, 2).map((tag, index) => (
                        <span key={index} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs rounded-full">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleAddRecipe(recipe)
                    }}
                  >
                    Add
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default AddRecipeModal