// Hash table-based recipe indexing for O(1) lookups
export class RecipeIndexer {
  constructor() {
    this.recipeIndex = new Map() // Main hash table
    this.ingredientIndex = new Map() // Ingredient -> recipes mapping
    this.tagIndex = new Map() // Tag -> recipes mapping
    this.nutritionIndex = new Map() // Nutrition range -> recipes
    this.timeIndex = new Map() // Cooking time -> recipes
  }

  // Add recipe to all indices
  addRecipe(recipe) {
    const id = recipe.id || this.generateId(recipe.name)
    
    // Main index
    this.recipeIndex.set(id, recipe)
    
    // Ingredient index
    recipe.ingredients?.forEach(ingredient => {
      if (!this.ingredientIndex.has(ingredient.name)) {
        this.ingredientIndex.set(ingredient.name, new Set())
      }
      this.ingredientIndex.get(ingredient.name).add(id)
    })
    
    // Tag index
    recipe.tags?.forEach(tag => {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set())
      }
      this.tagIndex.get(tag).add(id)
    })
    
    // Nutrition index
    const calorieRange = this.getCalorieRange(recipe.calories)
    if (!this.nutritionIndex.has(calorieRange)) {
      this.nutritionIndex.set(calorieRange, new Set())
    }
    this.nutritionIndex.get(calorieRange).add(id)
    
    // Time index
    const timeRange = this.getTimeRange(recipe.cookingTime)
    if (!this.timeIndex.has(timeRange)) {
      this.timeIndex.set(timeRange, new Set())
    }
    this.timeIndex.get(timeRange).add(id)
  }

  // Fast recipe search using hash tables
  searchRecipes(query) {
    const results = new Set()
    
    // Search by ingredients
    if (query.ingredients) {
      const ingredientResults = this.searchByIngredients(query.ingredients)
      ingredientResults.forEach(id => results.add(id))
    }
    
    // Search by tags
    if (query.tags) {
      query.tags.forEach(tag => {
        const tagResults = this.tagIndex.get(tag) || new Set()
        tagResults.forEach(id => results.add(id))
      })
    }
    
    // Filter by nutrition
    if (query.maxCalories) {
      const nutritionResults = this.searchByNutrition(query.maxCalories)
      if (results.size === 0) {
        nutritionResults.forEach(id => results.add(id))
      } else {
        // Intersection
        const filtered = new Set()
        results.forEach(id => {
          if (nutritionResults.has(id)) filtered.add(id)
        })
        return Array.from(filtered).map(id => this.recipeIndex.get(id))
      }
    }
    
    // Filter by cooking time
    if (query.maxTime) {
      const timeResults = this.searchByTime(query.maxTime)
      if (results.size === 0) {
        timeResults.forEach(id => results.add(id))
      } else {
        const filtered = new Set()
        results.forEach(id => {
          if (timeResults.has(id)) filtered.add(id)
        })
        return Array.from(filtered).map(id => this.recipeIndex.get(id))
      }
    }
    
    return Array.from(results).map(id => this.recipeIndex.get(id))
  }

  searchByIngredients(ingredients) {
    const results = new Set()
    let first = true
    
    ingredients.forEach(ingredient => {
      const recipeIds = this.ingredientIndex.get(ingredient) || new Set()
      
      if (first) {
        recipeIds.forEach(id => results.add(id))
        first = false
      } else {
        // Intersection for AND logic
        const intersection = new Set()
        results.forEach(id => {
          if (recipeIds.has(id)) intersection.add(id)
        })
        results.clear()
        intersection.forEach(id => results.add(id))
      }
    })
    
    return results
  }

  searchByNutrition(maxCalories) {
    const results = new Set()
    
    for (const [range, recipeIds] of this.nutritionIndex.entries()) {
      const [min, max] = range.split('-').map(Number)
      if (max <= maxCalories) {
        recipeIds.forEach(id => results.add(id))
      }
    }
    
    return results
  }

  searchByTime(maxTime) {
    const results = new Set()
    
    for (const [range, recipeIds] of this.timeIndex.entries()) {
      const [min, max] = range.split('-').map(Number)
      if (max <= maxTime) {
        recipeIds.forEach(id => results.add(id))
      }
    }
    
    return results
  }

  getCalorieRange(calories) {
    if (calories <= 200) return '0-200'
    if (calories <= 400) return '201-400'
    if (calories <= 600) return '401-600'
    if (calories <= 800) return '601-800'
    return '801+'
  }

  getTimeRange(minutes) {
    if (minutes <= 15) return '0-15'
    if (minutes <= 30) return '16-30'
    if (minutes <= 60) return '31-60'
    if (minutes <= 120) return '61-120'
    return '121+'
  }

  generateId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now()
  }
}