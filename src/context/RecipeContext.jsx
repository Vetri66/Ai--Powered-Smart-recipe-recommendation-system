"use client"

import { createContext, useContext, useReducer } from "react"

// Initial state for the recipe context
const initialState = {
  mealPlan: {
    monday: [],
    tuesday: [],
    wednesday: [],
    thursday: [],
    friday: [],
    saturday: [],
    sunday: [],
  },
  shoppingList: [],
  favorites: [],
  searchQuery: "",
  selectedCategory: "all",
  selectedDifficulty: "all",
}

// Action types
const ACTIONS = {
  ADD_TO_MEAL_PLAN: "ADD_TO_MEAL_PLAN",
  REMOVE_FROM_MEAL_PLAN: "REMOVE_FROM_MEAL_PLAN",
  ADD_TO_SHOPPING_LIST: "ADD_TO_SHOPPING_LIST",
  REMOVE_FROM_SHOPPING_LIST: "REMOVE_FROM_SHOPPING_LIST",
  TOGGLE_FAVORITE: "TOGGLE_FAVORITE",
  SET_SEARCH_QUERY: "SET_SEARCH_QUERY",
  SET_CATEGORY: "SET_CATEGORY",
  SET_DIFFICULTY: "SET_DIFFICULTY",
  GENERATE_SHOPPING_LIST: "GENERATE_SHOPPING_LIST",
  CLEAR_SHOPPING_LIST: "CLEAR_SHOPPING_LIST",
}

// Reducer function
const recipeReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.ADD_TO_MEAL_PLAN:
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.payload.day]: [...state.mealPlan[action.payload.day], action.payload.recipe],
        },
      }

    case ACTIONS.REMOVE_FROM_MEAL_PLAN:
      return {
        ...state,
        mealPlan: {
          ...state.mealPlan,
          [action.payload.day]: state.mealPlan[action.payload.day].filter(
            (recipe) => recipe.id !== action.payload.recipeId,
          ),
        },
      }

    case ACTIONS.ADD_TO_SHOPPING_LIST:
      const existingItem = state.shoppingList.find((item) => item.name === action.payload.name)
      if (existingItem) {
        return {
          ...state,
          shoppingList: state.shoppingList.map((item) =>
            item.name === action.payload.name ? { ...item, amount: item.amount + " + " + action.payload.amount } : item,
          ),
        }
      }
      return {
        ...state,
        shoppingList: [...state.shoppingList, { ...action.payload, checked: false }],
      }

    case ACTIONS.REMOVE_FROM_SHOPPING_LIST:
      return {
        ...state,
        shoppingList: state.shoppingList.filter((item) => item.name !== action.payload),
      }

    case ACTIONS.TOGGLE_FAVORITE:
      const isFavorite = state.favorites.some((fav) => fav.id === action.payload.id)
      return {
        ...state,
        favorites: isFavorite
          ? state.favorites.filter((fav) => fav.id !== action.payload.id)
          : [...state.favorites, action.payload],
      }

    case ACTIONS.SET_SEARCH_QUERY:
      return {
        ...state,
        searchQuery: action.payload,
      }

    case ACTIONS.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload,
      }

    case ACTIONS.SET_DIFFICULTY:
      return {
        ...state,
        selectedDifficulty: action.payload,
      }

    case ACTIONS.GENERATE_SHOPPING_LIST:
      const ingredients = []
      Object.values(state.mealPlan)
        .flat()
        .forEach((recipe) => {
          recipe.ingredients.forEach((ingredient) => {
            const existing = ingredients.find((item) => item.name === ingredient.name)
            if (existing) {
              existing.amount = existing.amount + " + " + ingredient.amount
            } else {
              ingredients.push({ ...ingredient, checked: false })
            }
          })
        })
      return {
        ...state,
        shoppingList: ingredients,
      }

    case ACTIONS.CLEAR_SHOPPING_LIST:
      return {
        ...state,
        shoppingList: [],
      }

    default:
      return state
  }
}

// Create context
const RecipeContext = createContext()

// Context provider component
export const RecipeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(recipeReducer, initialState)

  // Action creators
  const addToMealPlan = (day, recipe) => {
    dispatch({ type: ACTIONS.ADD_TO_MEAL_PLAN, payload: { day, recipe } })
  }

  const removeFromMealPlan = (day, recipeId) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_MEAL_PLAN, payload: { day, recipeId } })
  }

  const addToShoppingList = (ingredient) => {
    dispatch({ type: ACTIONS.ADD_TO_SHOPPING_LIST, payload: ingredient })
  }

  const removeFromShoppingList = (ingredientName) => {
    dispatch({ type: ACTIONS.REMOVE_FROM_SHOPPING_LIST, payload: ingredientName })
  }

  const toggleFavorite = (recipe) => {
    dispatch({ type: ACTIONS.TOGGLE_FAVORITE, payload: recipe })
  }

  const setSearchQuery = (query) => {
    dispatch({ type: ACTIONS.SET_SEARCH_QUERY, payload: query })
  }

  const setCategory = (category) => {
    dispatch({ type: ACTIONS.SET_CATEGORY, payload: category })
  }

  const setDifficulty = (difficulty) => {
    dispatch({ type: ACTIONS.SET_DIFFICULTY, payload: difficulty })
  }

  const generateShoppingList = () => {
    dispatch({ type: ACTIONS.GENERATE_SHOPPING_LIST })
  }

  const clearShoppingList = () => {
    dispatch({ type: ACTIONS.CLEAR_SHOPPING_LIST })
  }

  const value = {
    ...state,
    addToMealPlan,
    removeFromMealPlan,
    addToShoppingList,
    removeFromShoppingList,
    toggleFavorite,
    setSearchQuery,
    setCategory,
    setDifficulty,
    generateShoppingList,
    clearShoppingList,
  }

  return <RecipeContext.Provider value={value}>{children}</RecipeContext.Provider>
}

// Custom hook to use the recipe context
export const useRecipe = () => {
  const context = useContext(RecipeContext)
  if (!context) {
    throw new Error("useRecipe must be used within a RecipeProvider")
  }
  return context
}
