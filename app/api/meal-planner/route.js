import { NextResponse } from 'next/server'
import { MealPlanner } from '../../../lib/algorithms/meal-planner'

const mealPlanner = new MealPlanner()

// Sample recipes with nutrition data
const recipes = [
  {
    id: 1,
    name: 'Grilled Chicken Salad',
    calories: 320,
    protein: 35,
    cookingTime: 15,
    rating: 4.5,
    ingredients: [
      { name: 'chicken', quantity: 150, unit: 'g' },
      { name: 'lettuce', quantity: 100, unit: 'g' },
      { name: 'tomato', quantity: 50, unit: 'g' }
    ]
  },
  {
    id: 2,
    name: 'Salmon Rice Bowl',
    calories: 450,
    protein: 30,
    cookingTime: 20,
    rating: 4.7,
    ingredients: [
      { name: 'salmon', quantity: 120, unit: 'g' },
      { name: 'rice', quantity: 80, unit: 'g' },
      { name: 'broccoli', quantity: 100, unit: 'g' }
    ]
  },
  {
    id: 3,
    name: 'Vegetable Stir Fry',
    calories: 280,
    protein: 12,
    cookingTime: 12,
    rating: 4.2,
    ingredients: [
      { name: 'mixed vegetables', quantity: 200, unit: 'g' },
      { name: 'tofu', quantity: 100, unit: 'g' },
      { name: 'soy sauce', quantity: 15, unit: 'ml' }
    ]
  },
  {
    id: 4,
    name: 'Beef Steak',
    calories: 520,
    protein: 45,
    cookingTime: 25,
    rating: 4.8,
    ingredients: [
      { name: 'beef', quantity: 200, unit: 'g' },
      { name: 'potato', quantity: 150, unit: 'g' },
      { name: 'asparagus', quantity: 100, unit: 'g' }
    ]
  }
]

export async function POST(request) {
  try {
    const { days = 7, constraints = {}, type = 'optimize' } = await request.json()

    switch (type) {
      case 'optimize':
        return handleMealPlanOptimization(days, constraints)
      
      case 'shopping-list':
        return handleShoppingListGeneration(await request.json())
      
      case 'nutrition-goals':
        return handleNutritionGoals(days, constraints)
      
      default:
        return handleMealPlanOptimization(days, constraints)
    }
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

function handleMealPlanOptimization(days, constraints) {
  const optimizedPlan = mealPlanner.optimizeMealPlan(recipes, days, constraints)
  
  // Calculate total nutrition
  const totalNutrition = optimizedPlan.plan.reduce((total, { recipe }) => ({
    calories: total.calories + recipe.calories,
    protein: total.protein + recipe.protein,
    cost: total.cost + (recipe.cost || 10) // Default cost
  }), { calories: 0, protein: 0, cost: 0 })

  return NextResponse.json({
    mealPlan: optimizedPlan.plan,
    totalSatisfaction: optimizedPlan.totalSatisfaction,
    totalNutrition,
    averagePerDay: {
      calories: Math.round(totalNutrition.calories / days),
      protein: Math.round(totalNutrition.protein / days),
      cost: Math.round(totalNutrition.cost / days)
    },
    meetsConstraints: validateConstraints(totalNutrition, days, constraints)
  })
}

function handleShoppingListGeneration(data) {
  const { mealPlan } = data
  
  if (!mealPlan || !Array.isArray(mealPlan)) {
    return NextResponse.json({ error: 'Invalid meal plan data' }, { status: 400 })
  }

  const shoppingList = mealPlanner.generateShoppingList(mealPlan)
  
  // Group by category for better organization
  const groupedList = shoppingList.reduce((groups, item) => {
    const category = item.category
    if (!groups[category]) groups[category] = []
    groups[category].push(item)
    return groups
  }, {})

  // Calculate estimated cost
  const estimatedCost = shoppingList.reduce((total, item) => {
    const unitCost = getEstimatedUnitCost(item.name)
    return total + (item.quantity * unitCost)
  }, 0)

  return NextResponse.json({
    shoppingList: groupedList,
    totalItems: shoppingList.length,
    estimatedCost: Math.round(estimatedCost * 100) / 100,
    categories: Object.keys(groupedList)
  })
}

function handleNutritionGoals(days, constraints) {
  const { targetCalories = 2000, targetProtein = 150 } = constraints
  
  // Find recipes that best match nutrition goals
  const nutritionOptimizedRecipes = recipes
    .map(recipe => ({
      ...recipe,
      nutritionScore: calculateNutritionScore(recipe, { targetCalories: targetCalories/3, targetProtein: targetProtein/3 })
    }))
    .sort((a, b) => b.nutritionScore - a.nutritionScore)

  const recommendations = {
    highProtein: recipes.filter(r => r.protein > 25).slice(0, 3),
    lowCalorie: recipes.filter(r => r.calories < 350).slice(0, 3),
    balanced: nutritionOptimizedRecipes.slice(0, 3),
    quickMeals: recipes.filter(r => r.cookingTime < 20).slice(0, 3)
  }

  return NextResponse.json({
    recommendations,
    dailyTargets: {
      calories: targetCalories,
      protein: targetProtein,
      meals: 3
    },
    tips: [
      'Aim for 25-30g protein per meal',
      'Include vegetables in every meal',
      'Balance carbs and healthy fats',
      'Stay hydrated throughout the day'
    ]
  })
}

function validateConstraints(nutrition, days, constraints) {
  const dailyAverage = {
    calories: nutrition.calories / days,
    protein: nutrition.protein / days
  }

  const checks = {
    caloriesOk: !constraints.maxCalories || dailyAverage.calories <= constraints.maxCalories,
    proteinOk: !constraints.minProtein || dailyAverage.protein >= constraints.minProtein,
    budgetOk: !constraints.budget || nutrition.cost <= constraints.budget
  }

  return {
    ...checks,
    allMet: Object.values(checks).every(Boolean)
  }
}

function calculateNutritionScore(recipe, targets) {
  const calorieScore = Math.max(0, 100 - Math.abs(recipe.calories - targets.targetCalories))
  const proteinScore = Math.max(0, 100 - Math.abs(recipe.protein - targets.targetProtein) * 2)
  
  return (calorieScore + proteinScore) / 2
}

function getEstimatedUnitCost(ingredient) {
  const costs = {
    'chicken': 0.08,
    'salmon': 0.15,
    'beef': 0.12,
    'rice': 0.02,
    'pasta': 0.03,
    'vegetables': 0.04,
    'cheese': 0.10
  }
  
  return costs[ingredient.toLowerCase()] || 0.05
}