import { useState } from "react"

const RecipeFilters = ({ onFiltersChange }) => {
  const [filters, setFilters] = useState({})

  const updateFilters = (key, value) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
        Recipe Filters
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Cooking Time
          </label>
          <select
            onChange={(e) => updateFilters('maxTime', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Any time</option>
            <option value="15">Under 15 min</option>
            <option value="30">Under 30 min</option>
            <option value="60">Under 1 hour</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Max Calories
          </label>
          <select
            onChange={(e) => updateFilters('maxCalories', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">Any calories</option>
            <option value="200">Under 200 cal</option>
            <option value="400">Under 400 cal</option>
            <option value="600">Under 600 cal</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Cuisine Type
          </label>
          <select
            onChange={(e) => updateFilters('cuisine', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All cuisines</option>
            <option value="italian">Italian</option>
            <option value="asian">Asian</option>
            <option value="mexican">Mexican</option>
            <option value="indian">Indian</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default RecipeFilters