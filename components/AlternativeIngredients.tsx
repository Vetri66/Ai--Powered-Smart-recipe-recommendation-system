"use client"

import { useState } from "react"
import { RefreshCw, Info } from "lucide-react"

export default function AlternativeIngredients({ recipe, onIngredientReplace }) {
  const [showAlternatives, setShowAlternatives] = useState({})

  const toggleAlternatives = (ingredientName) => {
    setShowAlternatives((prev) => ({
      ...prev,
      [ingredientName]: !prev[ingredientName],
    }))
  }

  const replaceIngredient = (originalIngredient, alternative) => {
    onIngredientReplace(originalIngredient, alternative)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <RefreshCw className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Ingredient Alternatives</h3>
        <Info className="w-4 h-4 text-gray-400" title="Click on ingredients to see alternatives" />
      </div>

      <div className="space-y-3">
        {recipe.ingredients.map((ingredient) => (
          <div key={ingredient.name} className="border rounded-lg p-3">
            <button
              onClick={() => toggleAlternatives(ingredient.name)}
              className="w-full flex items-center justify-between text-left hover:bg-gray-50 p-2 rounded"
            >
              <div>
                <span className="font-medium text-gray-800">{ingredient.name}</span>
                <span className="text-gray-600 ml-2">({ingredient.amount})</span>
              </div>
              <div className="flex items-center gap-2">
                {ingredient.alternatives && ingredient.alternatives.length > 0 && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                    {ingredient.alternatives.length} alternatives
                  </span>
                )}
                <RefreshCw
                  className={`w-4 h-4 text-gray-400 transition-transform ${
                    showAlternatives[ingredient.name] ? "rotate-180" : ""
                  }`}
                />
              </div>
            </button>

            {showAlternatives[ingredient.name] && ingredient.alternatives && (
              <div className="mt-3 pl-4 border-l-2 border-green-200">
                <p className="text-sm text-gray-600 mb-2">Alternative options:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {ingredient.alternatives.map((alternative) => (
                    <button
                      key={alternative}
                      onClick={() => replaceIngredient(ingredient, alternative)}
                      className="text-left p-2 bg-gray-50 hover:bg-green-50 rounded border hover:border-green-300 transition-colors"
                    >
                      <span className="text-sm text-gray-700">{alternative}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
