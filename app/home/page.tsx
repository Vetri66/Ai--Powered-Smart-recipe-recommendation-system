"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter, Clock, Users } from "lucide-react"
import { recipes, searchRecipes, getRecipesByNutrition } from "../../src/data/recipes"
import { useRecipe } from "../../src/context/RecipeContext"
import RecipeCard from "../../components/RecipeCard"
import RecipeModal from "../../components/RecipeModal"
import SearchBar from "../../components/SearchBar"
import FilterPanel from "../../components/FilterPanel"
import IngredientSuggester from "../../components/IngredientSuggester"
import DietaryFilter from "../../components/DietaryFilter"
import NutritionAnalyzer from "../../components/NutritionAnalyzer"
import RecipeGenerator from "../../components/ai/recipe-generator"
import RecipeFilters from "../../components/recipe-filters"

const Home = () => {
  const { searchQuery, selectedCategory, selectedDifficulty } = useRecipe()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [selectedDietaryRestrictions, setSelectedDietaryRestrictions] = useState([])
  const [ingredientBasedRecipes, setIngredientBasedRecipes] = useState([])
  const [maxCalories, setMaxCalories] = useState(2000)
  const [minProtein, setMinProtein] = useState(0)
  const [maxCookingTime, setMaxCookingTime] = useState(60)
  const [activeTab, setActiveTab] = useState("all") // 'all', 'ingredients', 'nutrition'
  const [recipeFilters, setRecipeFilters] = useState({})

  // Filter recipes based on search query and filters
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

    // If using ingredient-based search, start with those recipes
    if (activeTab === "ingredients" && ingredientBasedRecipes.length > 0) {
      filtered = ingredientBasedRecipes
    }

    // Apply search query
    if (searchQuery.trim()) {
      filtered = searchRecipes(searchQuery)
    }

    // Apply category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter((recipe) => recipe.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    // Apply difficulty filter
    if (selectedDifficulty !== "all") {
      filtered = filtered.filter((recipe) => recipe.difficulty.toLowerCase() === selectedDifficulty.toLowerCase())
    }

    if (selectedDietaryRestrictions.length > 0) {
      filtered = filtered.filter((recipe) =>
        selectedDietaryRestrictions.some(
          (restriction) =>
            recipe.dietaryRestrictions?.includes(restriction) ||
            recipe.dietaryRestrictions?.includes(restriction + "-option"),
        ),
      )
    }

    if (activeTab === "nutrition") {
      filtered = getRecipesByNutrition(maxCalories, minProtein).filter((recipe) =>
        filtered.some((f) => f.id === recipe.id),
      )
    }

    if (maxCookingTime < 60) {
      filtered = filtered.filter((recipe) => recipe.cookingTime <= maxCookingTime)
    }

    return filtered
  }, [
    searchQuery,
    selectedCategory,
    selectedDifficulty,
    selectedDietaryRestrictions,
    ingredientBasedRecipes,
    maxCalories,
    minProtein,
    maxCookingTime,
    activeTab,
  ])

  const categories = ["all", "healthy", "asian", "italian", "seafood", "dessert", "salad"]
  const difficulties = ["all", "easy", "medium", "hard"]

  const handleIngredientRecipes = (recipes) => {
    setIngredientBasedRecipes(recipes)
    if (recipes.length > 0) {
      setActiveTab("ingredients")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-600 to-green-800 dark:from-green-700 dark:to-green-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Search className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">🍳 Smart Recipe Discovery 👨🍳</h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100 max-w-3xl mx-auto">
              🤖 AI-powered recipe generation • 🥘 Smart ingredient matching • 📊 Nutritional optimization
            </p>

            {/* Search Tabs */}
            <div className="flex justify-center mb-6">
              <div className="bg-white/10 rounded-lg p-1 flex">
                <button
                  onClick={() => setActiveTab("all")}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === "all" ? "bg-white text-green-600" : "text-white hover:bg-white/20"
                  }`}
                >
                  All Recipes
                </button>
                <button
                  onClick={() => setActiveTab("ingredients")}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === "ingredients" ? "bg-white text-green-600" : "text-white hover:bg-white/20"
                  }`}
                >
                  By Ingredients
                </button>
                <button
                  onClick={() => setActiveTab("nutrition")}
                  className={`px-4 py-2 rounded-md transition-all ${
                    activeTab === "nutrition" ? "bg-white text-green-600" : "text-white hover:bg-white/20"
                  }`}
                >
                  By Nutrition
                </button>
              </div>
            </div>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <RecipeFilters onFiltersChange={setRecipeFilters} />
        {activeTab === "ingredients" && (
          <div className="space-y-6">
            <RecipeGenerator />
            <IngredientSuggester onRecipesFound={handleIngredientRecipes} />
          </div>
        )}

        {activeTab === "nutrition" && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Nutrition Filters</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Calories: {maxCalories}</label>
                <input
                  type="range"
                  min="200"
                  max="1000"
                  value={maxCalories}
                  onChange={(e) => setMaxCalories(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Protein: {minProtein}g</label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={minProtein}
                  onChange={(e) => setMinProtein(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Cooking Time: {maxCookingTime} min
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={maxCookingTime}
                  onChange={(e) => setMaxCookingTime(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-green"
                />
              </div>
            </div>
          </div>
        )}

        <DietaryFilter
          selectedRestrictions={selectedDietaryRestrictions}
          onRestrictionsChange={setSelectedDietaryRestrictions}
        />

        {/* Filter Toggle and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              <span>More Filters</span>
            </button>
            <span className="text-gray-600 dark:text-gray-300">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
            </span>
            {filteredRecipes.length > 0 && (
              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    Avg:{" "}
                    {Math.round(filteredRecipes.reduce((sum, r) => sum + r.cookingTime, 0) / filteredRecipes.length)}{" "}
                    min
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    Avg: {Math.round(filteredRecipes.reduce((sum, r) => sum + r.servings, 0) / filteredRecipes.length)}{" "}
                    servings
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Filter Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
            >
              <FilterPanel categories={categories} difficulties={difficulties} onClose={() => setShowFilters(false)} />
            </motion.div>
          )}
        </AnimatePresence>

        {filteredRecipes.length > 0 && activeTab !== "ingredients" && (
          <div className="mb-8">
            <NutritionAnalyzer recipes={filteredRecipes} />
          </div>
        )}

        {/* Recipe Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {filteredRecipes.map((recipe) => (
              <RecipeCard key={recipe.id} recipe={recipe} onViewDetails={setSelectedRecipe} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* No Results */}
        {filteredRecipes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="h-16 w-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No recipes found</h3>
            <p className="text-gray-500">
              {activeTab === "ingredients"
                ? "Try adding more ingredients or adjusting your filters"
                : "Try adjusting your search terms or filters"}
            </p>
          </motion.div>
        )}
      </div>

      {/* Recipe Modal */}
      <AnimatePresence>
        {selectedRecipe && <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />}
      </AnimatePresence>
    </div>
  )
}

export default Home