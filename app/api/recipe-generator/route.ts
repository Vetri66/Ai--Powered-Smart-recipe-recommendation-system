import { GoogleGenerativeAI } from "@google/generative-ai"

export async function POST(req: Request) {
  try {
    const { ingredients, preferences } = await req.json()
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "")
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" })

    const prompt = `Generate a detailed recipe using these ingredients: ${ingredients.join(', ')}.
    Preferences: ${preferences || 'None'}
    
    Return a JSON object with:
    - name: recipe name
    - cookingTime: time in minutes
    - servings: number of servings
    - difficulty: Easy/Medium/Hard
    - ingredients: array of {name, amount}
    - instructions: array of steps
    - nutrition: {calories, protein, carbs, fat}
    - tags: array of relevant tags`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    // Try to parse JSON, fallback to structured response
    let recipe
    try {
      recipe = JSON.parse(text)
    } catch {
      recipe = {
        name: "AI Generated Recipe",
        cookingTime: 30,
        servings: 4,
        difficulty: "Medium",
        ingredients: ingredients.map(ing => ({ name: ing, amount: "As needed" })),
        instructions: ["Follow AI suggestions from the text response"],
        nutrition: { calories: 300, protein: 15, carbs: 30, fat: 10 },
        tags: ["ai-generated"],
        description: text
      }
    }

    return new Response(JSON.stringify(recipe), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to generate recipe" }), {
      status: 500,
      headers: { "Content-Type": "application/json" }
    })
  }
}