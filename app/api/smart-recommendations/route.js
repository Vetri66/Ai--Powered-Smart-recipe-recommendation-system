import { NextResponse } from 'next/server'
import { IngredientGraph } from '../../../lib/algorithms/ingredient-graph'
import { RecipeIndexer } from '../../../lib/algorithms/recipe-indexer'
import { NutritionAnalyzer } from '../../../lib/nutrition/analyzer'

const ingredientGraph = new IngredientGraph()
const recipeIndexer = new RecipeIndexer()
const nutritionAnalyzer = new NutritionAnalyzer()

// Sample recipes for demonstration
const sampleRecipes = [
  {
    id: 'chicken-pasta',
    name: 'Chicken Pasta',
    ingredients: [
      { name: 'chicken', quantity: 200 },
      { name: 'pasta', quantity: 150 },
      { name: 'tomato', quantity: 100 },
      { name: 'garlic', quantity: 10 }
    ],
    cookingTime: 25,
    calories: 450,
    protein: 35,
    rating: 4.5,
    tags: ['dinner', 'protein', 'italian']
  },
  {
    id: 'salmon-rice',
    name: 'Salmon Rice Bowl',
    ingredients: [
      { name: 'salmon', quantity: 150 },
      { name: 'rice', quantity: 100 },
      { name: 'garlic', quantity: 5 }
    ],
    cookingTime: 20,
    calories: 380,
    protein: 28,
    rating: 4.7,
    tags: ['healthy', 'protein', 'asian']
  },
  {
    id: 'beef-stir-fry',
    name: 'Beef Stir Fry',
    ingredients: [
      { name: 'beef', quantity: 200 },
      { name: 'onion', quantity: 100 },
      { name: 'garlic', quantity: 8 }
    ],
    cookingTime: 15,
    calories: 320,
    protein: 30,
    rating: 4.3,
    tags: ['quick', 'protein', 'asian']
  },
  {
    id: 'tomato-basil-pasta',
    name: 'Tomato Basil Pasta',
    ingredients: [
      { name: 'pasta', quantity: 200 },
      { name: 'tomato', quantity: 150 },
      { name: 'basil', quantity: 20 }
    ],
    cookingTime: 18,
    calories: 280,
    protein: 12,
    rating: 4.1,
    tags: ['vegetarian', 'italian']
  }
]

// Initialize with sample data
sampleRecipes.forEach(recipe => recipeIndexer.addRecipe(recipe))

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}))
    const { ingredients = [], preferences = {}, type = 'default' } = body

    if (!ingredients || ingredients.length === 0) {
      return NextResponse.json({
        suggestions: [],
        message: 'No ingredients provided'
      })
    }

    switch (type) {
      case 'ingredient-suggestions':
        return handleIngredientSuggestions(ingredients)
      
      case 'recipe-search':
        return handleRecipeSearch({ ingredients, ...preferences })
      
      case 'nutrition-analysis':
        return handleNutritionAnalysis(ingredients)
      
      case 'alternatives':
        return handleAlternatives(ingredients[0])
      
      default:
        return handleSmartRecommendations(ingredients, preferences)
    }
  } catch (error) {
    console.error('Smart recommendations error:', error)
    return NextResponse.json({
      suggestions: [],
      message: 'Service temporarily unavailable'
    }, { status: 200 })
  }
}

function handleIngredientSuggestions(ingredients) {
  const suggestions = ingredientGraph.findComplementaryIngredients(ingredients)
  
  return NextResponse.json({
    suggestions,
    message: `Found ${suggestions.length} complementary ingredients`
  })
}

function handleRecipeSearch(query) {
  const recipes = recipeIndexer.searchRecipes(query)
  
  // Add nutrition analysis to each recipe
  const enrichedRecipes = recipes.map(recipe => ({
    ...recipe,
    nutrition: nutritionAnalyzer.analyzeRecipe(recipe)
  }))
  
  return NextResponse.json({
    recipes: enrichedRecipes,
    count: enrichedRecipes.length
  })
}

function handleNutritionAnalysis(recipeData) {
  const analysis = nutritionAnalyzer.analyzeRecipe({ ingredients: recipeData })
  
  return NextResponse.json({
    analysis,
    recommendations: analysis.healthScore < 70 ? [
      'Consider adding more vegetables for fiber',
      'Try lean protein sources',
      'Reduce added fats and oils'
    ] : ['Great nutritional balance!']
  })
}

function handleAlternatives(ingredient) {
  const alternatives = ingredientGraph.findAlternatives(ingredient)
  
  return NextResponse.json({
    ingredient,
    alternatives,
    message: `Found ${alternatives.length} alternative ingredients`
  })
}

function handleSmartRecommendations(ingredients, preferences) {
  // Combine multiple algorithms for smart recommendations
  const complementary = ingredientGraph.findComplementaryIngredients(ingredients)
  const recipes = recipeIndexer.searchRecipes({ 
    ingredients, 
    maxCalories: preferences.maxCalories,
    maxTime: preferences.maxTime 
  })
  
  const recommendations = {
    complementaryIngredients: complementary.slice(0, 5),
    suggestedRecipes: recipes.slice(0, 3).map(recipe => ({
      ...recipe,
      nutrition: nutritionAnalyzer.analyzeRecipe(recipe),
      matchScore: calculateMatchScore(recipe, ingredients)
    })),
    alternatives: ingredients.map(ing => ({
      ingredient: ing,
      alternatives: ingredientGraph.findAlternatives(ing).slice(0, 3)
    }))
  }
  
  return NextResponse.json(recommendations)
}

function calculateMatchScore(recipe, userIngredients) {
  const recipeIngredients = recipe.ingredients?.map(i => i.name) || []
  const matches = userIngredients.filter(ing => 
    recipeIngredients.some(recIng => recIng.toLowerCase().includes(ing.toLowerCase()))
  )
  
  return Math.round((matches.length / userIngredients.length) * 100)
}