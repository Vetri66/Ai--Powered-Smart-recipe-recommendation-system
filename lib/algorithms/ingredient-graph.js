// Ingredient relationship graph using adjacency list
export class IngredientGraph {
  constructor() {
    this.adjacencyList = new Map()
    this.ingredientIndex = new Map() // Hash table for O(1) lookups
    this.initializeGraph()
  }

  initializeGraph() {
    // Common ingredient relationships
    const relationships = [
      ['tomato', 'basil', 0.9], ['tomato', 'mozzarella', 0.8], ['tomato', 'garlic', 0.7],
      ['chicken', 'garlic', 0.8], ['chicken', 'onion', 0.7], ['chicken', 'lemon', 0.6],
      ['pasta', 'cheese', 0.8], ['pasta', 'tomato', 0.7], ['pasta', 'olive oil', 0.6],
      ['rice', 'soy sauce', 0.8], ['rice', 'ginger', 0.7], ['rice', 'garlic', 0.6],
      ['beef', 'onion', 0.8], ['beef', 'mushroom', 0.7], ['beef', 'wine', 0.6],
      ['salmon', 'lemon', 0.9], ['salmon', 'dill', 0.8], ['salmon', 'capers', 0.7]
    ]

    relationships.forEach(([ing1, ing2, weight]) => {
      this.addEdge(ing1, ing2, weight)
    })
  }

  addEdge(ingredient1, ingredient2, weight = 0.5) {
    if (!this.adjacencyList.has(ingredient1)) {
      this.adjacencyList.set(ingredient1, [])
      this.ingredientIndex.set(ingredient1, this.ingredientIndex.size)
    }
    if (!this.adjacencyList.has(ingredient2)) {
      this.adjacencyList.set(ingredient2, [])
      this.ingredientIndex.set(ingredient2, this.ingredientIndex.size)
    }
    
    this.adjacencyList.get(ingredient1).push({ ingredient: ingredient2, weight })
    this.adjacencyList.get(ingredient2).push({ ingredient: ingredient1, weight })
  }

  // Find complementary ingredients using graph traversal
  findComplementaryIngredients(ingredients, maxDepth = 2) {
    const suggestions = new Map()
    const visited = new Set(ingredients)

    const dfs = (ingredient, depth, currentWeight) => {
      if (depth > maxDepth || !this.adjacencyList.has(ingredient)) return

      this.adjacencyList.get(ingredient).forEach(({ ingredient: neighbor, weight }) => {
        if (!visited.has(neighbor)) {
          const score = currentWeight * weight
          suggestions.set(neighbor, Math.max(suggestions.get(neighbor) || 0, score))
          
          if (depth < maxDepth) {
            dfs(neighbor, depth + 1, score * 0.7)
          }
        }
      })
    }

    ingredients.forEach(ingredient => dfs(ingredient, 0, 1.0))
    
    return Array.from(suggestions.entries())
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10)
      .map(([ingredient, score]) => ({ ingredient, score: Math.round(score * 100) }))
  }

  // Find alternative ingredients
  findAlternatives(ingredient) {
    const alternatives = new Map()
    
    if (!this.adjacencyList.has(ingredient)) return []

    this.adjacencyList.get(ingredient).forEach(({ ingredient: neighbor, weight }) => {
      if (weight > 0.6) { // High similarity threshold
        alternatives.set(neighbor, weight)
      }
    })

    return Array.from(alternatives.entries())
      .sort(([,a], [,b]) => b - a)
      .map(([alt, score]) => ({ ingredient: alt, similarity: Math.round(score * 100) }))
  }
}