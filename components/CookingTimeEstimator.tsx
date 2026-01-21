"use client"

import { Clock, ChefHat, Flame } from "lucide-react"

export default function CookingTimeEstimator({ recipe, servings = null }) {
  const adjustedServings = servings || recipe.servings
  const servingMultiplier = adjustedServings / recipe.servings

  // Estimate adjusted cooking times
  const adjustedPrepTime = Math.ceil(recipe.prepTime * Math.sqrt(servingMultiplier))
  const adjustedCookTime = Math.ceil((recipe.cookingTime - recipe.prepTime) * servingMultiplier)
  const adjustedTotalTime = adjustedPrepTime + adjustedCookTime

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-100"
      case "medium":
        return "text-yellow-600 bg-yellow-100"
      case "hard":
        return "text-red-600 bg-red-100"
      default:
        return "text-gray-600 bg-gray-100"
    }
  }

  const getTimeEstimate = (totalTime) => {
    if (totalTime <= 15) return { label: "Quick & Easy", color: "text-green-600" }
    if (totalTime <= 30) return { label: "Moderate", color: "text-yellow-600" }
    if (totalTime <= 60) return { label: "Takes Time", color: "text-orange-600" }
    return { label: "Long Cook", color: "text-red-600" }
  }

  const timeEstimate = getTimeEstimate(adjustedTotalTime)

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Cooking Time Estimate</h3>
        {servings && servings !== recipe.servings && (
          <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
            Adjusted for {servings} servings
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <ChefHat className="w-6 h-6 text-blue-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-blue-600">{adjustedPrepTime}m</div>
          <div className="text-sm text-gray-600">Prep Time</div>
        </div>

        <div className="text-center p-4 bg-orange-50 rounded-lg">
          <Flame className="w-6 h-6 text-orange-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-orange-600">{adjustedCookTime}m</div>
          <div className="text-sm text-gray-600">Cook Time</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <Clock className="w-6 h-6 text-green-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-green-600">{adjustedTotalTime}m</div>
          <div className="text-sm text-gray-600">Total Time</div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(recipe.difficulty)}`}>
            {recipe.difficulty}
          </span>
          <span className={`text-sm font-medium ${timeEstimate.color}`}>{timeEstimate.label}</span>
        </div>

        <div className="text-sm text-gray-600">
          Active time: {recipe.activeTime || Math.ceil(adjustedTotalTime * 0.6)}m
        </div>
      </div>

      {servingMultiplier !== 1 && (
        <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Note:</strong> Times are estimated for {adjustedServings} servings. Prep time scales with portion
            size, while cooking time may vary.
          </p>
        </div>
      )}
    </div>
  )
}
