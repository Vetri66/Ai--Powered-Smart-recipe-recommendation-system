import { useState } from "react"
import { Plus, X } from "lucide-react"
import { getRecipesByIngredients } from "../src/data/recipes"

const IngredientSuggester = ({ onRecipesFound }) => {
  const [ingredients, setIngredients] = useState([])
  const [inputValue, setInputValue] = useState("")

  const addIngredient = () => {
    if (inputValue.trim() && !ingredients.includes(inputValue.trim())) {
      const newIngredients = [...ingredients, inputValue.trim()]
      setIngredients(newIngredients)
      setInputValue("")
      
      // Find recipes with these ingredients
      const matchingRecipes = getRecipesByIngredients(newIngredients)
      onRecipesFound(matchingRecipes)
    }
  }

  const removeIngredient = (ingredient) => {
    const newIngredients = ingredients.filter(ing => ing !== ingredient)
    setIngredients(newIngredients)
    
    if (newIngredients.length > 0) {
      const matchingRecipes = getRecipesByIngredients(newIngredients)
      onRecipesFound(matchingRecipes)
    } else {
      onRecipesFound([])
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        What ingredients do you have?
      </h3>
      
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && addIngredient()}
          placeholder="Add an ingredient..."
          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <button
          onClick={addIngredient}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
      
      {ingredients.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {ingredients.map((ingredient, index) => (
            <span
              key={index}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200"
            >
              {ingredient}
              <button
                onClick={() => removeIngredient(ingredient)}
                className="ml-2 text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default IngredientSuggester