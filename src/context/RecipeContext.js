"use client"

import { createContext, useContext, useState } from 'react'

const RecipeContext = createContext()

export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    return {
      searchQuery: '',
      selectedCategory: 'all',
      selectedDifficulty: 'all',
      shoppingList: [],
      mealPlan: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
      },
      setSearchQuery: () => {},
      setSelectedCategory: () => {},
      setSelectedDifficulty: () => {},
      addToShoppingList: () => {},
      removeFromShoppingList: () => {},
      clearShoppingList: () => {},
      addToMealPlan: () => {},
      removeFromMealPlan: () => {},
      generateShoppingList: () => {}
    }
  }
  return context
}

export const RecipeProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [mealPlan, setMealPlan] = useState({
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: []
  })
  const [shoppingList, setShoppingList] = useState([])

  const addToMealPlan = (day, recipe) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), recipe]
    }))
  }

  const removeFromMealPlan = (day, recipeId) => {
    setMealPlan(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(recipe => recipe.id !== recipeId)
    }))
  }

  const addToShoppingList = (item) => {
    setShoppingList(prev => {
      const exists = prev.find(existing => existing.name === item.name)
      if (exists) return prev
      return [...prev, item]
    })
  }

  const removeFromShoppingList = (itemName) => {
    setShoppingList(prev => prev.filter(item => item.name !== itemName))
  }

  const clearShoppingList = () => {
    setShoppingList([])
  }

  const generateShoppingList = () => {
    const ingredients = []
    Object.values(mealPlan).flat().forEach(recipe => {
      if (recipe.ingredients) {
        recipe.ingredients.forEach(ingredient => {
          const existing = ingredients.find(item => item.name === ingredient.name)
          if (existing) {
            existing.amount += ` + ${ingredient.amount}`
          } else {
            ingredients.push({ ...ingredient, recipeId: recipe.id })
          }
        })
      }
    })
    setShoppingList(ingredients)
  }

  const value = {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedDifficulty,
    setSelectedDifficulty,
    mealPlan,
    shoppingList,
    addToMealPlan,
    removeFromMealPlan,
    addToShoppingList,
    removeFromShoppingList,
    clearShoppingList,
    generateShoppingList
  }

  return (
    <RecipeContext.Provider value={value}>
      {children}
    </RecipeContext.Provider>
  )
}