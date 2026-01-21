import { GoogleGenerativeAI } from "@google/generative-ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { message, filters } = await req.json()
    
    if (!process.env.GEMINI_API_KEY) {
      return new Response(JSON.stringify({ 
        message: "AI service is not configured. Please check the API key." 
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      })
    }
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    let filterText = ""
    if (filters) {
      if (filters.duration) filterText += `Maximum cooking time: ${filters.duration} minutes. `
      if (filters.calories) filterText += `Maximum calories: ${filters.calories} per serving. `
      if (filters.cuisine) filterText += `Cuisine preference: ${filters.cuisine}. `
      if (filters.difficulty) filterText += `Difficulty level: ${filters.difficulty}. `
      if (filters.type) filterText += `Recipe type: ${filters.type}. `
    }

    const prompt = `You are a smart recipe assistant. ${filterText}Format your response exactly like this (no markdown, no asterisks):

[Emoji] [Recipe Name]

Type: [Veg/Non-Veg/Vegan]
Cooking Time: [X minutes]
Calories: [X per serving]
Difficulty: [Easy/Medium/Hard]
Cuisine: [Italian/Asian/Indian/etc]

Ingredients:
• [ingredient 1]
• [ingredient 2]

Instructions:
1. [step 1]
2. [step 2]

Tip: [helpful cooking tip]

User question: ${message}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return new Response(JSON.stringify({ message: text }), {
      headers: { "Content-Type": "application/json" }
    })
  } catch (error) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ 
      message: "I'm having trouble right now. Here's a quick tip: Try cooking with fresh ingredients and season to taste!" 
    }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    })
  }
}

