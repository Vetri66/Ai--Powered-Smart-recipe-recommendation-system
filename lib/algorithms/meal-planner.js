// Dynamic Programming for meal planning optimization
export class MealPlanner {
  constructor() {
    this.memoCache = new Map() // Memoization for DP
  }

  // Optimize meal plan using dynamic programming
  optimizeMealPlan(recipes, days, constraints = {}) {
    const { maxCalories = 2000, minProtein = 50, budget = 100 } = constraints
    const cacheKey = `${recipes.length}-${days}-${maxCalories}-${minProtein}-${budget}`
    
    if (this.memoCache.has(cacheKey)) {
      return this.memoCache.get(cacheKey)
    }

    // DP table: dp[day][calories][protein] = max satisfaction
    const dp = Array(days + 1).fill().map(() => 
      Array(maxCalories + 1).fill().map(() => 
        Array(minProtein + 1).fill(-1)
      )
    )

    dp[0][0][0] = 0

    for (let day = 0; day < days; day++) {
      for (let cal = 0; cal <= maxCalories; cal++) {
        for (let prot = 0; prot <= minProtein; prot++) {
          if (dp[day][cal][prot] === -1) continue

          recipes.forEach(recipe => {
            const newCal = Math.min(maxCalories, cal + recipe.calories)
            const newProt = Math.min(minProtein, prot + recipe.protein)
            const satisfaction = dp[day][cal][prot] + recipe.rating

            if (dp[day + 1][newCal][newProt] < satisfaction) {
              dp[day + 1][newCal][newProt] = satisfaction
            }
          })
        }
      }
    }

    // Backtrack to find optimal meal plan
    const plan = this.backtrackPlan(dp, recipes, days, maxCalories, minProtein)
    this.memoCache.set(cacheKey, plan)
    return plan
  }

  backtrackPlan(dp, recipes, days, maxCalories, minProtein) {
    const plan = []
    let bestSatisfaction = -1
    let bestCal = 0, bestProt = 0

    // Find best end state
    for (let cal = 0; cal <= maxCalories; cal++) {
      for (let prot = 0; prot <= minProtein; prot++) {
        if (dp[days][cal][prot] > bestSatisfaction) {
          bestSatisfaction = dp[days][cal][prot]
          bestCal = cal
          bestProt = prot
        }
      }
    }

    // Reconstruct path
    for (let day = days - 1; day >= 0; day--) {
      for (const recipe of recipes) {
        const prevCal = bestCal - recipe.calories
        const prevProt = bestProt - recipe.protein

        if (prevCal >= 0 && prevProt >= 0 && 
            dp[day][prevCal][prevProt] + recipe.rating === dp[day + 1][bestCal][bestProt]) {
          plan.unshift({ day: day + 1, recipe })
          bestCal = prevCal
          bestProt = prevProt
          break
        }
      }
    }

    return { plan, totalSatisfaction: bestSatisfaction }
  }

  // Generate shopping list from meal plan
  generateShoppingList(mealPlan) {
    const ingredients = new Map()
    
    mealPlan.forEach(({ recipe }) => {
      recipe.ingredients?.forEach(ingredient => {
        const current = ingredients.get(ingredient.name) || { quantity: 0, unit: ingredient.unit }
        current.quantity += ingredient.quantity
        ingredients.set(ingredient.name, current)
      })
    })

    return Array.from(ingredients.entries()).map(([name, { quantity, unit }]) => ({
      name,
      quantity: Math.ceil(quantity),
      unit,
      category: this.categorizeIngredient(name)
    }))
  }

  categorizeIngredient(ingredient) {
    const categories = {
      'Produce': ['tomato', 'onion', 'garlic', 'basil', 'lemon', 'carrot', 'potato'],
      'Meat': ['chicken', 'beef', 'pork', 'salmon', 'fish'],
      'Dairy': ['milk', 'cheese', 'butter', 'yogurt', 'cream'],
      'Pantry': ['rice', 'pasta', 'flour', 'sugar', 'salt', 'pepper', 'oil']
    }

    for (const [category, items] of Object.entries(categories)) {
      if (items.some(item => ingredient.toLowerCase().includes(item))) {
        return category
      }
    }
    return 'Other'
  }
}