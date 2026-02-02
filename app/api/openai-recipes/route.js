import OpenAI from 'openai'
import { GoogleGenerativeAI } from '@google/generative-ai'

function validateIngredients(ingredients) {
  const nonFoodItems = ['soap', 'detergent', 'shampoo', 'toothpaste', 'medicine', 'cleaning', 'chemical', 'poison', 'bleach', 'plastic', 'metal', 'glass', 'paper']
  const validIngredients = []
  const invalidIngredients = []
  const suggestions = []

  ingredients.forEach(ingredient => {
    const lowerIng = ingredient.toLowerCase().trim()
    if (nonFoodItems.some(item => lowerIng.includes(item))) {
      invalidIngredients.push(ingredient)
      // Suggest proper food alternatives
      if (lowerIng.includes('soap')) suggestions.push('Instead of soap, try: fish with lemon and herbs')
      if (lowerIng.includes('pickle')) suggestions.push('Pickles work! Try: fish with pickled vegetables')
      if (lowerIng.includes('detergent')) suggestions.push('Try cooking ingredients: vegetables, spices, herbs')
    } else {
      validIngredients.push(ingredient)
    }
  })

  // Check for unusual but valid combinations
  if (validIngredients.length > 0) {
    const hasPickle = validIngredients.some(ing => ing.toLowerCase().includes('pickle'))
    const hasFish = validIngredients.some(ing => ing.toLowerCase().includes('fish'))
    
    if (hasPickle && hasFish) {
      suggestions.push('Great combo! Fish with pickled vegetables makes a tangy dish')
    }
  }

  return {
    isValid: invalidIngredients.length === 0,
    validIngredients,
    invalidIngredients,
    suggestions: suggestions.length > 0 ? suggestions : ['Try common ingredients like: chicken, rice, vegetables, spices']
  }
}

export async function POST(req) {
  try {
    const { ingredients, preferences = '', dietaryRestrictions = [] } = await req.json()
    
    if (!ingredients || ingredients.length === 0) {
      return new Response(JSON.stringify({ error: 'Ingredients are required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    console.log('Generating recipe with ingredients:', ingredients)
    
    // Validate ingredients first
    const validationResult = validateIngredients(ingredients)
    if (!validationResult.isValid) {
      return new Response(JSON.stringify({
        error: 'Non-food items detected',
        message: 'Please use only edible ingredients for cooking',
        invalidIngredients: validationResult.invalidIngredients,
        suggestions: validationResult.suggestions,
        validAlternatives: ['fish', 'chicken', 'vegetables', 'rice', 'spices', 'herbs']
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not configured, trying Gemini fallback')
      return tryGeminiFallback(validationResult.validIngredients, preferences, dietaryRestrictions)
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `You are a professional chef. Create a delicious and safe recipe using ONLY these ingredients: ${validationResult.validIngredients.join(', ')}.
    
    CRITICAL RULES:
    - Only use the provided food ingredients
    - Create a realistic, edible recipe
    - If ingredients seem unusual together, make the best possible dish
    - Focus on flavor combinations that work
    
    Additional preferences: ${preferences}
    Dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "cookingTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "ingredients": [
        {"name": "ingredient name", "amount": "1 cup", "optional": false}
      ],
      "instructions": [
        "Step 1 instruction",
        "Step 2 instruction"
      ],
      "nutrition": {
        "calories": 350,
        "protein": 20,
        "carbs": 45,
        "fat": 12,
        "fiber": 8
      },
      "tags": ["healthy", "quick", "vegetarian"],
      "category": "main-dish"
    }`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional chef and nutritionist. Create detailed, practical recipes that are delicious and nutritionally balanced. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 1500
    })

    const recipeText = completion.choices[0].message.content.trim()
    
    // Parse the JSON response
    let recipe
    try {
      recipe = JSON.parse(recipeText)
      
      // Add unique ID and ensure all required fields
      recipe.id = `openai-${Date.now()}`
      recipe.source = 'OpenAI Generated'
      recipe.createdAt = new Date().toISOString()
      
      // Validate required fields
      if (!recipe.name || !recipe.ingredients || !recipe.instructions) {
        throw new Error('Missing required fields')
      }
      
    } catch (parseError) {
      console.error('JSON parsing failed:', parseError)
      
      // Fallback recipe structure
      recipe = {
        id: `openai-fallback-${Date.now()}`,
        name: "AI Generated Recipe",
        description: "A delicious recipe created with your ingredients",
        cookingTime: 30,
        servings: 4,
        difficulty: "Medium",
        ingredients: validationResult.validIngredients.map(ing => ({
          name: ing,
          amount: "As needed",
          optional: false
        })),
        instructions: [
          "Prepare all ingredients according to the AI suggestions below:",
          recipeText
        ],
        nutrition: {
          calories: 300,
          protein: 15,
          carbs: 30,
          fat: 10,
          fiber: 5
        },
        tags: ["ai-generated"],
        category: "main-dish",
        source: 'OpenAI Generated',
        createdAt: new Date().toISOString()
      }
    }

    return new Response(JSON.stringify(recipe), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('OpenAI API Error:', error)
    
    // Try Gemini AI as fallback
    const { ingredients, preferences = '', dietaryRestrictions = [] } = await req.json()
    const validationResult = validateIngredients(ingredients)
    return tryGeminiFallback(validationResult.validIngredients, preferences, dietaryRestrictions)
  }
}

async function tryGeminiFallback(validIngredients, preferences, dietaryRestrictions) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.warn('Gemini API key not configured, using static fallback')
      return getStaticFallback(validIngredients)
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Create a detailed recipe using ONLY these FOOD ingredients: ${validIngredients.join(', ')}.
    
    IMPORTANT: Only use edible food ingredients. Ignore any non-food items.
    Additional preferences: ${preferences}
    Dietary restrictions: ${dietaryRestrictions.join(', ') || 'None'}
    
    Return ONLY a valid JSON object with this exact structure:
    {
      "name": "Recipe Name",
      "description": "Brief description",
      "cookingTime": 30,
      "servings": 4,
      "difficulty": "Easy",
      "ingredients": [
        {"name": "ingredient name", "amount": "1 cup", "optional": false}
      ],
      "instructions": [
        "Step 1 instruction",
        "Step 2 instruction"
      ],
      "nutrition": {
        "calories": 350,
        "protein": 20,
        "carbs": 45,
        "fat": 12,
        "fiber": 8
      },
      "tags": ["healthy", "quick", "vegetarian"],
      "category": "main-dish"
    }`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const recipeText = response.text().trim()
    
    // Parse Gemini response
    let recipe
    try {
      // Clean up the response to extract JSON
      const jsonMatch = recipeText.match(/\{[\s\S]*\}/)
      const cleanJson = jsonMatch ? jsonMatch[0] : recipeText
      recipe = JSON.parse(cleanJson)
      
      // Add metadata
      recipe.id = `gemini-${Date.now()}`
      recipe.source = 'Gemini AI Generated'
      recipe.createdAt = new Date().toISOString()
      
      return new Response(JSON.stringify(recipe), {
        headers: { 'Content-Type': 'application/json' }
      })
      
    } catch (parseError) {
      console.error('Gemini JSON parsing failed:', parseError)
      return getStaticFallback(validIngredients)
    }
    
  } catch (geminiError) {
    console.error('Gemini AI also failed:', geminiError)
    return getStaticFallback(validIngredients)
  }
}

function getStaticFallback(validIngredients) {
  const fallbackRecipe = {
    id: `fallback-${Date.now()}`,
    name: "Simple Recipe with Your Ingredients",
    description: "A basic recipe using your available ingredients",
    cookingTime: 25,
    servings: 4,
    difficulty: "Easy",
    ingredients: validIngredients.map(ing => ({
      name: ing,
      amount: "As needed",
      optional: false
    })),
    instructions: [
      "Prepare and clean all ingredients",
      "Heat oil in a pan over medium heat",
      "Add ingredients and cook according to your preference",
      "Season with salt and pepper to taste",
      "Serve hot and enjoy!"
    ],
    nutrition: {
      calories: 250,
      protein: 12,
      carbs: 25,
      fat: 8,
      fiber: 4
    },
    tags: ["simple", "quick"],
    category: "main-dish",
    source: 'Fallback Recipe',
    createdAt: new Date().toISOString(),
    note: 'AI services are currently unavailable. Here\'s a basic recipe to get you started!'
  }
  
  return new Response(JSON.stringify(fallbackRecipe), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}