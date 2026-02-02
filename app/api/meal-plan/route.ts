import OpenAI from 'openai'

export async function POST(req) {
  try {
    const { calories, diet, restrictions, pantry, days = 7 } = await req.json()

    // Only initialize OpenAI if API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn('OpenAI API key not found, using fallback meal plan')
      return getFallbackMealPlan(days)
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    const prompt = `Create a ${days}-day meal plan with the following constraints:
- Daily target calories: ${calories || "2000"}
- Diet preference: ${diet || "balanced"}
- Allergies/Restrictions: ${restrictions || "none"}
- Available pantry items: ${pantry || "basic ingredients"}

Return ONLY a valid JSON object with this exact structure:
{
  "days": [
    {
      "day": 1,
      "breakfast": {"title": "Scrambled Eggs", "ingredients": ["eggs", "butter"], "instructions": ["Beat eggs", "Cook in pan"], "image": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=300&h=200&fit=crop"},
      "lunch": {"title": "Chicken Salad", "ingredients": ["chicken", "lettuce"], "instructions": ["Mix ingredients"], "image": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop"},
      "dinner": {"title": "Pasta", "ingredients": ["pasta", "sauce"], "instructions": ["Boil pasta", "Add sauce"], "image": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=300&h=200&fit=crop"},
      "snacks": ["apple", "nuts"]
    }
  ],
  "shoppingList": ["eggs", "butter", "chicken", "lettuce", "pasta", "sauce", "apple", "nuts"]
}`

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a professional nutritionist and meal planner. Always respond with valid JSON only."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000
    })

    const text = completion.choices[0].message.content.trim()
    
    try {
      const json = JSON.parse(text)
      return Response.json(json)
    } catch (parseError) {
      return getFallbackMealPlan(days)
    }
  } catch (error) {
    console.error('Meal plan API error:', error)
    return getFallbackMealPlan(days)
  }
}

function getFallbackMealPlan(days) {
  const fallbackPlan = {
    days: Array.from({ length: days }, (_, i) => ({
      day: i + 1,
      breakfast: {
        title: "Healthy Breakfast",
        ingredients: ["oats", "milk", "banana"],
        instructions: ["Mix oats with milk", "Add sliced banana", "Serve warm"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MhyBCcmVha2Zhc3Q8L3RleHQ+PC9zdmc+"
      },
      lunch: {
        title: "Simple Lunch",
        ingredients: ["bread", "cheese", "tomato"],
        instructions: ["Toast bread", "Add cheese and tomato", "Serve fresh"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+llyBMdW5jaDwvdGV4dD48L3N2Zz4="
      },
      dinner: {
        title: "Easy Dinner",
        ingredients: ["rice", "chicken", "vegetables"],
        instructions: ["Cook rice", "Grill chicken", "Steam vegetables", "Serve together"],
        image: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NvSBEaW5uZXI8L3RleHQ+PC9zdmc+"
      },
      snacks: ["apple", "nuts"]
    })),
    shoppingList: ["oats", "milk", "banana", "bread", "cheese", "tomato", "rice", "chicken", "vegetables", "apple", "nuts"]
  }
  return Response.json(fallbackPlan)
}
