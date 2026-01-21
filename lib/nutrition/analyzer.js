// Nutritional analysis with health optimization
export class NutritionAnalyzer {
  constructor() {
    this.nutritionDB = new Map()
    this.initializeNutritionData()
  }

  initializeNutritionData() {
    // Basic nutrition data per 100g
    const nutritionData = {
      'chicken': { calories: 165, protein: 31, carbs: 0, fat: 3.6, fiber: 0 },
      'beef': { calories: 250, protein: 26, carbs: 0, fat: 17, fiber: 0 },
      'salmon': { calories: 208, protein: 20, carbs: 0, fat: 12, fiber: 0 },
      'rice': { calories: 130, protein: 2.7, carbs: 28, fat: 0.3, fiber: 0.4 },
      'pasta': { calories: 131, protein: 5, carbs: 25, fat: 1.1, fiber: 1.8 },
      'tomato': { calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, fiber: 1.2 },
      'onion': { calories: 40, protein: 1.1, carbs: 9.3, fat: 0.1, fiber: 1.7 },
      'garlic': { calories: 149, protein: 6.4, carbs: 33, fat: 0.5, fiber: 2.1 },
      'cheese': { calories: 113, protein: 7, carbs: 1, fat: 9, fiber: 0 },
      'olive oil': { calories: 884, protein: 0, carbs: 0, fat: 100, fiber: 0 }
    }

    Object.entries(nutritionData).forEach(([ingredient, nutrition]) => {
      this.nutritionDB.set(ingredient, nutrition)
    })
  }

  // Analyze recipe nutrition
  analyzeRecipe(recipe) {
    let totalNutrition = {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0
    }

    recipe.ingredients?.forEach(ingredient => {
      const nutrition = this.nutritionDB.get(ingredient.name.toLowerCase())
      if (nutrition) {
        const multiplier = (ingredient.quantity || 100) / 100
        
        totalNutrition.calories += nutrition.calories * multiplier
        totalNutrition.protein += nutrition.protein * multiplier
        totalNutrition.carbs += nutrition.carbs * multiplier
        totalNutrition.fat += nutrition.fat * multiplier
        totalNutrition.fiber += nutrition.fiber * multiplier
      }
    })

    // Round values
    Object.keys(totalNutrition).forEach(key => {
      totalNutrition[key] = Math.round(totalNutrition[key] * 10) / 10
    })

    return {
      ...totalNutrition,
      servings: recipe.servings || 1,
      perServing: this.calculatePerServing(totalNutrition, recipe.servings || 1),
      healthScore: this.calculateHealthScore(totalNutrition),
      macroRatio: this.calculateMacroRatio(totalNutrition)
    }
  }

  calculatePerServing(nutrition, servings) {
    const perServing = {}
    Object.keys(nutrition).forEach(key => {
      perServing[key] = Math.round((nutrition[key] / servings) * 10) / 10
    })
    return perServing
  }

  calculateHealthScore(nutrition) {
    let score = 50 // Base score

    // Protein bonus
    if (nutrition.protein > 20) score += 15
    else if (nutrition.protein > 10) score += 10

    // Fiber bonus
    if (nutrition.fiber > 5) score += 15
    else if (nutrition.fiber > 3) score += 10

    // Calorie penalty for high calories
    if (nutrition.calories > 800) score -= 20
    else if (nutrition.calories > 600) score -= 10

    // Fat penalty for excessive fat
    if (nutrition.fat > 30) score -= 15
    else if (nutrition.fat > 20) score -= 10

    return Math.max(0, Math.min(100, score))
  }

  calculateMacroRatio(nutrition) {
    const totalCalories = nutrition.calories
    if (totalCalories === 0) return { protein: 0, carbs: 0, fat: 0 }

    const proteinCal = nutrition.protein * 4
    const carbsCal = nutrition.carbs * 4
    const fatCal = nutrition.fat * 9

    return {
      protein: Math.round((proteinCal / totalCalories) * 100),
      carbs: Math.round((carbsCal / totalCalories) * 100),
      fat: Math.round((fatCal / totalCalories) * 100)
    }
  }

  // Optimize recipe for health goals
  optimizeForHealth(recipe, goals = {}) {
    const { targetCalories, targetProtein, lowFat, highFiber } = goals
    const analysis = this.analyzeRecipe(recipe)
    const suggestions = []

    if (targetCalories && analysis.calories > targetCalories) {
      suggestions.push({
        type: 'reduce_calories',
        message: `Reduce portion sizes or substitute high-calorie ingredients`,
        impact: `Current: ${analysis.calories} cal, Target: ${targetCalories} cal`
      })
    }

    if (targetProtein && analysis.protein < targetProtein) {
      suggestions.push({
        type: 'increase_protein',
        message: `Add lean protein sources like chicken, fish, or legumes`,
        impact: `Current: ${analysis.protein}g, Target: ${targetProtein}g`
      })
    }

    if (lowFat && analysis.fat > 15) {
      suggestions.push({
        type: 'reduce_fat',
        message: `Use cooking spray instead of oil, choose lean cuts`,
        impact: `Current fat: ${analysis.fat}g`
      })
    }

    if (highFiber && analysis.fiber < 5) {
      suggestions.push({
        type: 'increase_fiber',
        message: `Add vegetables, whole grains, or legumes`,
        impact: `Current fiber: ${analysis.fiber}g`
      })
    }

    return {
      analysis,
      suggestions,
      optimized: suggestions.length === 0
    }
  }
}