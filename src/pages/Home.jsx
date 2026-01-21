"use client"

import { useState, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, Filter } from "lucide-react"
import { recipes, searchRecipes } from "../data/recipes"
import { useRecipe } from "../context/RecipeContext"
import RecipeCard from "../components/RecipeCard"
import RecipeModal from "../components/RecipeModal"
import SearchBar from "../components/SearchBar"
import FilterPanel from "../components/FilterPanel"

const Home = () => {
  const { searchQuery, selectedCategory, selectedDifficulty } = useRecipe()
  const [selectedRecipe, setSelectedRecipe] = useState(null)
  const [showFilters, setShowFilters] = useState(false)

  // Filter recipes based on search query and filters
  const filteredRecipes = useMemo(() => {
    let filtered = recipes

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

    return filtered
  }, [searchQuery, selectedCategory, selectedDifficulty])

  const categories = ["all", "healthy", "asian", "italian", "seafood", "dessert", "salad"]
  const difficulties = ["all", "easy", "medium", "hard"]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Discover Amazing Recipes</h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100 max-w-3xl mx-auto">
              Find the perfect recipe for any occasion. From quick weeknight dinners to impressive weekend feasts.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <SearchBar />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filter Toggle and Results Count */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <Filter className="h-4 w-4" />
              <span>Filters</span>
            </button>
            <span className="text-gray-600">
              {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? "s" : ""} found
            </span>
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
            <p className="text-gray-500">Try adjusting your search terms or filters</p>
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
