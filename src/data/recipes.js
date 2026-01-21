// Mock recipe data for the Smart Recipe Recommendation System
export const recipes = [
  {
    id: 1,
    name: "Mediterranean Quinoa Bowl",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop",
    cookingTime: 25,
    servings: 4,
    difficulty: "Easy",
    category: "Healthy",
    tags: ["vegetarian", "gluten-free", "mediterranean"],
    rating: 4.8,
    description: "A nutritious and colorful quinoa bowl packed with Mediterranean flavors and fresh vegetables.",
    dietaryRestrictions: ["vegetarian", "gluten-free", "dairy-free-option"],
    ingredients: [
      { name: "Quinoa", amount: "1 cup", category: "grains", alternatives: ["Brown rice", "Bulgur wheat", "Couscous"] },
      {
        name: "Cherry tomatoes",
        amount: "1 cup",
        category: "vegetables",
        alternatives: ["Regular tomatoes", "Sun-dried tomatoes"],
      },
      { name: "Cucumber", amount: "1 large", category: "vegetables", alternatives: ["Zucchini", "Bell peppers"] },
      { name: "Red onion", amount: "1/2 medium", category: "vegetables", alternatives: ["Shallots", "Green onions"] },
      { name: "Kalamata olives", amount: "1/2 cup", category: "pantry", alternatives: ["Green olives", "Capers"] },
      {
        name: "Feta cheese",
        amount: "4 oz",
        category: "dairy",
        alternatives: ["Goat cheese", "Vegan feta", "Nutritional yeast"],
      },
      { name: "Olive oil", amount: "3 tbsp", category: "pantry", alternatives: ["Avocado oil", "Walnut oil"] },
      { name: "Lemon juice", amount: "2 tbsp", category: "pantry", alternatives: ["Lime juice", "White wine vinegar"] },
      { name: "Fresh herbs", amount: "1/4 cup", category: "herbs", alternatives: ["Dried herbs", "Basil", "Oregano"] },
    ],
    instructions: [
      "Rinse quinoa and cook according to package directions. Let cool.",
      "Dice cucumber, halve cherry tomatoes, and thinly slice red onion.",
      "Whisk together olive oil, lemon juice, salt, and pepper for dressing.",
      "Combine quinoa with vegetables, olives, and feta cheese.",
      "Drizzle with dressing and toss gently.",
      "Garnish with fresh herbs and serve chilled.",
    ],
    calories: 320,
    protein: 12,
    nutrition: {
      calories: 320,
      protein: 12,
      carbs: 35,
      fat: 16,
      fiber: 5,
      sugar: 8,
      sodium: 450,
      vitaminC: 25,
      iron: 15,
      calcium: 20,
    },
    prepTime: 15,
    activeTime: 10,
    totalTime: 25,
  },
  {
    id: 2,
    name: "Spicy Thai Basil Chicken",
    image: "https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?w=400&h=300&fit=crop",
    cookingTime: 20,
    servings: 3,
    difficulty: "Medium",
    category: "Asian",
    tags: ["spicy", "thai", "quick"],
    rating: 4.6,
    description: "Authentic Thai stir-fry with aromatic basil and bold flavors that comes together in minutes.",
    dietaryRestrictions: ["gluten-free-option", "dairy-free"],
    ingredients: [
      { name: "Chicken breast", amount: "1 lb", category: "meat", alternatives: ["Chicken thighs", "Tofu", "Shrimp"] },
      { name: "Thai basil", amount: "1 cup", category: "herbs", alternatives: ["Regular basil", "Mint leaves"] },
      { name: "Garlic", amount: "4 cloves", category: "vegetables", alternatives: ["Garlic powder", "Shallots"] },
      { name: "Thai chilies", amount: "3-4", category: "vegetables", alternatives: ["Jalapeños", "Red pepper flakes"] },
      { name: "Fish sauce", amount: "2 tbsp", category: "pantry", alternatives: ["Soy sauce", "Coconut aminos"] },
      { name: "Soy sauce", amount: "1 tbsp", category: "pantry", alternatives: ["Tamari", "Coconut aminos"] },
      { name: "Sugar", amount: "1 tsp", category: "pantry", alternatives: ["Honey", "Maple syrup", "Coconut sugar"] },
      { name: "Vegetable oil", amount: "2 tbsp", category: "pantry", alternatives: ["Peanut oil", "Sesame oil"] },
      {
        name: "Jasmine rice",
        amount: "2 cups cooked",
        category: "grains",
        alternatives: ["Brown rice", "Cauliflower rice"],
      },
    ],
    instructions: [
      "Slice chicken into thin strips and season with salt.",
      "Heat oil in a wok or large skillet over high heat.",
      "Add garlic and chilies, stir-fry for 30 seconds.",
      "Add chicken and cook until no longer pink, about 5 minutes.",
      "Add fish sauce, soy sauce, and sugar. Stir to combine.",
      "Remove from heat and stir in Thai basil until wilted.",
      "Serve immediately over jasmine rice.",
    ],
    calories: 285,
    protein: 28,
    nutrition: {
      calories: 285,
      protein: 28,
      carbs: 18,
      fat: 12,
      fiber: 2,
      sugar: 4,
      sodium: 890,
      vitaminA: 15,
      iron: 8,
      calcium: 5,
    },
    prepTime: 10,
    activeTime: 10,
    totalTime: 20,
  },
  {
    id: 3,
    name: "Creamy Mushroom Risotto",
    image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400&h=300&fit=crop",
    cookingTime: 35,
    servings: 4,
    difficulty: "Hard",
    category: "Italian",
    tags: ["vegetarian", "creamy", "comfort"],
    rating: 4.9,
    description: "Rich and creamy risotto with earthy mushrooms and fresh herbs, perfect for a cozy dinner.",
    dietaryRestrictions: ["vegetarian", "dairy-free"],
    ingredients: [
      {
        name: "Arborio rice",
        amount: "1.5 cups",
        category: "grains",
        alternatives: ["Carnaroli rice", "Vialone Nano rice"],
      },
      {
        name: "Mixed mushrooms",
        amount: "8 oz",
        category: "vegetables",
        alternatives: ["Button mushrooms", "Portobello mushrooms"],
      },
      { name: "Vegetable broth", amount: "6 cups", category: "pantry", alternatives: ["Chicken broth", "Beef broth"] },
      { name: "White wine", amount: "1/2 cup", category: "pantry", alternatives: ["Dry white wine", "Sherry"] },
      { name: "Onion", amount: "1 medium", category: "vegetables", alternatives: ["Red onion", "Shallots"] },
      { name: "Garlic", amount: "3 cloves", category: "vegetables", alternatives: ["Garlic powder", "Fresh garlic"] },
      {
        name: "Parmesan cheese",
        amount: "1 cup grated",
        category: "dairy",
        alternatives: ["Grated Parmesan", "Grated Romano"],
      },
      { name: "Butter", amount: "3 tbsp", category: "dairy", alternatives: ["Clarified butter", "Ghee"] },
      { name: "Fresh thyme", amount: "2 tsp", category: "herbs", alternatives: ["Dried thyme", "Fresh parsley"] },
    ],
    instructions: [
      "Heat broth in a saucepan and keep warm over low heat.",
      "Sauté mushrooms in 1 tbsp butter until golden. Set aside.",
      "In the same pan, sauté onion and garlic until translucent.",
      "Add rice and stir for 2 minutes until lightly toasted.",
      "Add wine and stir until absorbed.",
      "Add warm broth one ladle at a time, stirring constantly.",
      "Continue until rice is creamy and tender, about 20 minutes.",
      "Stir in mushrooms, remaining butter, Parmesan, and thyme.",
    ],
    calories: 380,
    protein: 14,
    nutrition: {
      calories: 380,
      protein: 14,
      carbs: 58,
      fat: 12,
      fiber: 3,
      sugar: 2,
      sodium: 500,
      vitaminC: 10,
      iron: 10,
      calcium: 15,
    },
    prepTime: 20,
    activeTime: 15,
    totalTime: 35,
  },
  {
    id: 4,
    name: "Grilled Salmon with Lemon Herbs",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    cookingTime: 15,
    servings: 4,
    difficulty: "Easy",
    category: "Seafood",
    tags: ["healthy", "quick", "protein"],
    rating: 4.7,
    description: "Perfectly grilled salmon with a bright lemon herb marinade, light and flavorful.",
    dietaryRestrictions: ["seafood", "dairy-free"],
    ingredients: [
      {
        name: "Salmon fillets",
        amount: "4 pieces",
        category: "seafood",
        alternatives: ["Trout fillets", "Cod fillets"],
      },
      { name: "Lemon", amount: "2 large", category: "fruits", alternatives: ["Lime", "Orange"] },
      { name: "Fresh dill", amount: "1/4 cup", category: "herbs", alternatives: ["Fresh parsley", "Fresh basil"] },
      { name: "Fresh parsley", amount: "1/4 cup", category: "herbs", alternatives: ["Fresh dill", "Fresh mint"] },
      { name: "Olive oil", amount: "3 tbsp", category: "pantry", alternatives: ["Avocado oil", "Canola oil"] },
      { name: "Garlic", amount: "2 cloves", category: "vegetables", alternatives: ["Garlic powder", "Fresh garlic"] },
      { name: "Salt", amount: "1 tsp", category: "pantry", alternatives: ["Sea salt", "Table salt"] },
      {
        name: "Black pepper",
        amount: "1/2 tsp",
        category: "pantry",
        alternatives: ["White pepper", "Ground black pepper"],
      },
    ],
    instructions: [
      "Preheat grill to medium-high heat.",
      "Mix olive oil, lemon juice, minced garlic, dill, and parsley.",
      "Season salmon with salt and pepper.",
      "Marinate salmon in herb mixture for 10 minutes.",
      "Grill salmon for 4-5 minutes per side until flaky.",
      "Serve with lemon wedges and remaining herb mixture.",
    ],
    calories: 245,
    protein: 35,
    nutrition: {
      calories: 245,
      protein: 35,
      carbs: 2,
      fat: 11,
      fiber: 0,
      sugar: 1,
      sodium: 300,
      vitaminD: 10,
      iron: 1,
      calcium: 10,
    },
    prepTime: 10,
    activeTime: 5,
    totalTime: 15,
  },
  {
    id: 5,
    name: "Chocolate Avocado Mousse",
    image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop",
    cookingTime: 10,
    servings: 6,
    difficulty: "Easy",
    category: "Dessert",
    tags: ["vegan", "healthy", "chocolate"],
    rating: 4.5,
    description: "Rich and creamy chocolate mousse made with avocados for a healthier dessert option.",
    dietaryRestrictions: ["vegan", "gluten-free"],
    ingredients: [
      { name: "Ripe avocados", amount: "3 large", category: "fruits", alternatives: ["Bananas", "Mangos"] },
      {
        name: "Cocoa powder",
        amount: "1/4 cup",
        category: "pantry",
        alternatives: ["Cocoa powder", "Dark chocolate powder"],
      },
      { name: "Maple syrup", amount: "1/4 cup", category: "pantry", alternatives: ["Honey", "Agave nectar"] },
      {
        name: "Vanilla extract",
        amount: "1 tsp",
        category: "pantry",
        alternatives: ["Vanilla extract", "Almond extract"],
      },
      { name: "Coconut milk", amount: "2 tbsp", category: "pantry", alternatives: ["Almond milk", "Soy milk"] },
      { name: "Sea salt", amount: "pinch", category: "pantry", alternatives: ["Table salt", "Kosher salt"] },
      {
        name: "Dark chocolate chips",
        amount: "2 tbsp",
        category: "pantry",
        alternatives: ["White chocolate chips", "Milk chocolate chips"],
      },
    ],
    instructions: [
      "Scoop avocado flesh into a food processor.",
      "Add cocoa powder, maple syrup, vanilla, and salt.",
      "Process until smooth and creamy.",
      "Add coconut milk if needed for consistency.",
      "Taste and adjust sweetness as desired.",
      "Chill for at least 30 minutes before serving.",
      "Garnish with chocolate chips and serve.",
    ],
    calories: 165,
    protein: 3,
    nutrition: {
      calories: 165,
      protein: 3,
      carbs: 18,
      fat: 11,
      fiber: 7,
      sugar: 10,
      sodium: 5,
      vitaminC: 1,
      iron: 1,
      calcium: 1,
    },
    prepTime: 5,
    activeTime: 5,
    totalTime: 10,
  },
  {
    id: 6,
    name: "Classic Caesar Salad",
    image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    cookingTime: 15,
    servings: 4,
    difficulty: "Easy",
    category: "Salad",
    tags: ["vegetarian", "classic", "fresh"],
    rating: 4.4,
    description: "Crisp romaine lettuce with homemade Caesar dressing, parmesan, and crunchy croutons.",
    dietaryRestrictions: ["vegetarian", "dairy-free"],
    ingredients: [
      {
        name: "Romaine lettuce",
        amount: "2 heads",
        category: "vegetables",
        alternatives: ["Iceberg lettuce", "Arugula"],
      },
      {
        name: "Parmesan cheese",
        amount: "1/2 cup",
        category: "dairy",
        alternatives: ["Grated Parmesan", "Grated Romano"],
      },
      { name: "Bread", amount: "4 slices", category: "grains", alternatives: ["Crackers", "Pita bread"] },
      {
        name: "Mayonnaise",
        amount: "1/2 cup",
        category: "pantry",
        alternatives: ["Homemade mayonnaise", "Avocado mayonnaise"],
      },
      { name: "Lemon juice", amount: "2 tbsp", category: "pantry", alternatives: ["Lime juice", "White wine vinegar"] },
      { name: "Worcestershire sauce", amount: "1 tsp", category: "pantry", alternatives: ["Fish sauce", "Tamari"] },
      { name: "Garlic", amount: "2 cloves", category: "vegetables", alternatives: ["Garlic powder", "Fresh garlic"] },
      { name: "Anchovy paste", amount: "1 tsp", category: "pantry", alternatives: ["Sardine paste", "Tuna paste"] },
    ],
    instructions: [
      "Cut bread into cubes and toast until golden for croutons.",
      "Wash and chop romaine lettuce into bite-sized pieces.",
      "Mix mayonnaise, lemon juice, Worcestershire, garlic, and anchovy paste.",
      "Toss lettuce with dressing until well coated.",
      "Top with grated Parmesan and croutons.",
      "Serve immediately while lettuce is crisp.",
    ],
    calories: 220,
    protein: 8,
    nutrition: {
      calories: 220,
      protein: 8,
      carbs: 12,
      fat: 16,
      fiber: 4,
      sugar: 2,
      sodium: 1000,
      vitaminC: 5,
      iron: 2,
      calcium: 10,
    },
    prepTime: 10,
    activeTime: 5,
    totalTime: 15,
  },
]

// Helper functions for filtering and searching
export const getRecipesByCategory = (category) => {
  return recipes.filter((recipe) => recipe.category.toLowerCase() === category.toLowerCase())
}

export const searchRecipes = (query) => {
  const lowercaseQuery = query.toLowerCase()
  return recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(lowercaseQuery) ||
      recipe.description.toLowerCase().includes(lowercaseQuery) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
      recipe.ingredients.some((ingredient) => ingredient.name.toLowerCase().includes(lowercaseQuery)),
  )
}

export const getRecipesByDifficulty = (difficulty) => {
  return recipes.filter((recipe) => recipe.difficulty.toLowerCase() === difficulty.toLowerCase())
}

export const getRecipesByCookingTime = (maxTime) => {
  return recipes.filter((recipe) => recipe.cookingTime <= maxTime)
}

export const getRecipesByDietaryRestrictions = (restrictions) => {
  return recipes.filter((recipe) =>
    restrictions.every((restriction) => recipe.dietaryRestrictions.includes(restriction)),
  )
}

export const getRecipesByIngredients = (availableIngredients) => {
  return recipes
    .filter((recipe) => {
      const recipeIngredients = recipe.ingredients.map((ing) => ing.name.toLowerCase())
      const matchCount = availableIngredients.filter((ingredient) =>
        recipeIngredients.some((recipeIng) => recipeIng.includes(ingredient.toLowerCase())),
      ).length
      return matchCount >= Math.ceil(recipeIngredients.length * 0.6) // 60% ingredient match
    })
    .sort((a, b) => {
      // Sort by ingredient match percentage
      const aMatch =
        availableIngredients.filter((ingredient) =>
          a.ingredients.some((ing) => ing.name.toLowerCase().includes(ingredient.toLowerCase())),
        ).length / a.ingredients.length
      const bMatch =
        availableIngredients.filter((ingredient) =>
          b.ingredients.some((ing) => ing.name.toLowerCase().includes(ingredient.toLowerCase())),
        ).length / b.ingredients.length
      return bMatch - aMatch
    })
}

export const getRecipesByNutrition = (maxCalories, minProtein = 0) => {
  return recipes.filter((recipe) => recipe.nutrition.calories <= maxCalories && recipe.nutrition.protein >= minProtein)
}

export const optimizeMealPlan = (mealPlan, targetCalories = 2000, targetProtein = 150) => {
  const totalNutrition = Object.values(mealPlan)
    .flat()
    .reduce(
      (total, recipe) => ({
        calories: total.calories + recipe.nutrition.calories,
        protein: total.protein + recipe.nutrition.protein,
        carbs: total.carbs + recipe.nutrition.carbs,
        fat: total.fat + recipe.nutrition.fat,
        fiber: total.fiber + recipe.nutrition.fiber,
      }),
      { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
    )

  const suggestions = []

  if (totalNutrition.calories < targetCalories * 0.8) {
    suggestions.push("Consider adding more calorie-dense meals or snacks")
  }
  if (totalNutrition.protein < targetProtein * 0.8) {
    suggestions.push("Add more protein-rich recipes to meet your goals")
  }
  if (totalNutrition.fiber < 25) {
    suggestions.push("Include more high-fiber foods like vegetables and whole grains")
  }

  return { totalNutrition, suggestions }
}
