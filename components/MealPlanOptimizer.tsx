"use client"

import { useState, useEffect } from "react"
import { TrendingUp, Target, AlertCircle, CheckCircle } from "lucide-react"
import { optimizeMealPlan } from "../src/data/recipes"

export default function MealPlanOptimizer({ mealPlan, targetCalories = 2000, targetProtein = 150 }) {
  const [optimization, setOptimization] = useState(null)
  const [goals, setGoals] = useState({
    calories: targetCalories,
    protein: targetProtein,
    fiber: 25,
    maxSodium: 2300,
  })

  useEffect(() => {
    const result = optimizeMealPlan(mealPlan, goals.calories, goals.protein)
    setOptimization(result)
  }, [mealPlan, goals])

  if (!optimization) return null

  const { totalNutrition, suggestions } = optimization

  const getProgressColor = (current, target, isReverse = false) => {
    const percentage = (current / target) * 100
    if (isReverse) {
      return percentage > 100
        ? "text-red-600 bg-red-100"
        : percentage > 80
          ? "text-yellow-600 bg-yellow-100"
          : "text-green-600 bg-green-100"
    }
    return percentage >= 80
      ? "text-green-600 bg-green-100"
      : percentage >= 60
        ? "text-yellow-600 bg-yellow-100"
        : "text-red-600 bg-red-100"
  }

  const nutritionGoals = [
    {
      name: "Calories",
      current: totalNutrition.calories,
      target: goals.calories,
      unit: "kcal",
      icon: TrendingUp,
    },
    {
      name: "Protein",
      current: totalNutrition.protein,
      target: goals.protein,
      unit: "g",
      icon: Target,
    },
    {
      name: "Fiber",
      current: totalNutrition.fiber,
      target: goals.fiber,
      unit: "g",
      icon: CheckCircle,
    },
  ]

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-5 h-5 text-green-600" />
        <h3 className="text-lg font-semibold text-gray-800">Meal Plan Optimization</h3>
      </div>

      {/* Goal Adjusters */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Daily Calorie Goal: {goals.calories}</label>
          <input
            type="range"
            min="1200"
            max="3000"
            step="50"
            value={goals.calories}
            onChange={(e) => setGoals((prev) => ({ ...prev, calories: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Protein Goal: {goals.protein}g</label>
          <input
            type="range"
            min="50"
            max="250"
            step="5"
            value={goals.protein}
            onChange={(e) => setGoals((prev) => ({ ...prev, protein: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Fiber Goal: {goals.fiber}g</label>
          <input
            type="range"
            min="15"
            max="50"
            step="1"
            value={goals.fiber}
            onChange={(e) => setGoals((prev) => ({ ...prev, fiber: Number(e.target.value) }))}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
          />
        </div>
      </div>

      {/* Progress Indicators */}
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {nutritionGoals.map((goal) => {
          const percentage = Math.min((goal.current / goal.target) * 100, 100)
          const colorClass = getProgressColor(goal.current, goal.target)
          const Icon = goal.icon

          return (
            <div key={goal.name} className={`p-4 rounded-lg ${colorClass}`}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{goal.name}</span>
                </div>
                <span className="text-sm">
                  {Math.round(goal.current)}/{goal.target} {goal.unit}
                </span>
              </div>
              <div className="w-full bg-white/50 rounded-full h-2">
                <div className="h-2 rounded-full bg-current opacity-60" style={{ width: `${percentage}%` }}></div>
              </div>
              <div className="text-xs mt-1">{percentage.toFixed(0)}% of goal</div>
            </div>
          )
        })}
      </div>

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="border-t pt-4">
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="w-4 h-4 text-blue-600" />
            <h4 className="font-medium text-gray-800">Optimization Suggestions</h4>
          </div>
          <ul className="space-y-2">
            {suggestions.map((suggestion, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                {suggestion}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weekly Summary */}
      <div className="border-t pt-4 mt-4">
        <h4 className="font-medium text-gray-800 mb-3">Weekly Nutrition Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{Math.round(totalNutrition.calories * 7)}</div>
            <div className="text-xs text-gray-600">Weekly Calories</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{Math.round(totalNutrition.protein * 7)}g</div>
            <div className="text-xs text-gray-600">Weekly Protein</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{Math.round(totalNutrition.carbs * 7)}g</div>
            <div className="text-xs text-gray-600">Weekly Carbs</div>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-bold text-gray-800">{Math.round(totalNutrition.fat * 7)}g</div>
            <div className="text-xs text-gray-600">Weekly Fat</div>
          </div>
        </div>
      </div>
    </div>
  )
}
