"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, Plus, ChefHat } from "lucide-react"
import { useRecipe } from "../../src/context/RecipeContext"
import MealPlanCard from "../../src/components/MealPlanCard"
import AddRecipeModal from "../../src/components/AddRecipeModal"
import { useRouter } from "next/navigation"

const Planner = () => {
  const { mealPlan = {}, removeFromMealPlan = () => {}, generateShoppingList = () => {} } = useRecipe()
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedDay, setSelectedDay] = useState(null)
  const router = useRouter()

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ]

  const handleAddRecipe = (day) => {
    setSelectedDay(day)
    setShowAddModal(true)
  }

  const handleRemoveRecipe = (day, recipeId) => {
    removeFromMealPlan(day, recipeId)
  }

  const getTotalRecipes = () => {
    if (!mealPlan || typeof mealPlan !== 'object') return 0
    return Object.values(mealPlan).reduce((total, dayRecipes) => {
      return total + (Array.isArray(dayRecipes) ? dayRecipes.length : 0)
    }, 0)
  }

  const handleGenerateShoppingList = () => {
    generateShoppingList()
    router.push('/shopping')
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calendar className="h-8 w-8 text-green-600" />
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Weekly Meal Planner</h1>
          </div>
          <p className="text-lg text-gray-600 mb-6">
            Plan your meals for the week and generate a shopping list automatically
          </p>

          {/* Stats and Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{getTotalRecipes()}</div>
              <div className="text-sm text-gray-600">Planned Meals</div>
            </div>
            <button
              onClick={handleGenerateShoppingList}
              disabled={getTotalRecipes() === 0}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Generate Shopping List
            </button>
          </div>
        </motion.div>

        {/* Weekly Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-7 gap-4">
          {days.map((day, index) => (
            <motion.div
              key={day.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
            >
              {/* Day Header */}
              <div className="bg-green-600 dark:bg-green-700 text-white p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">{day.label}</h3>
                  <button
                    onClick={() => handleAddRecipe(day.key)}
                    className="p-1 hover:bg-green-700 rounded-full transition-colors duration-200"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Meals for the day */}
              <div className="p-4 min-h-[300px] dark:bg-gray-800">
                <AnimatePresence>
                  {(!mealPlan[day.key] || mealPlan[day.key].length === 0) ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex flex-col items-center justify-center h-48 text-gray-400 dark:text-gray-500"
                    >
                      <ChefHat className="h-12 w-12 mb-2" />
                      <p className="text-sm text-center">No meals planned</p>
                      <button
                        onClick={() => handleAddRecipe(day.key)}
                        className="mt-2 text-green-600 hover:text-green-700 text-sm font-medium"
                      >
                        Add a recipe
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      {(mealPlan[day.key] || []).map((recipe, recipeIndex) => (
                        <MealPlanCard
                          key={`${recipe.id}-${recipeIndex}`}
                          recipe={recipe}
                          onRemove={() => handleRemoveRecipe(day.key, recipe.id)}
                        />
                      ))}
                    </div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Add Recipe Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddRecipeModal
            day={selectedDay}
            onClose={() => {
              setShowAddModal(false)
              setSelectedDay(null)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}

export default Planner
