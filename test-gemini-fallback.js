// Test script to verify Gemini fallback works
const { GoogleGenerativeAI } = require('@google/generative-ai')

async function testGemini() {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'AIzaSyCBHXkns6v-78guBWxM3uwn0rIv1cjP7Po')
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' })
    
    const prompt = `Create a simple recipe using chicken and rice. Return ONLY valid JSON with name, description, cookingTime, servings, difficulty, ingredients array, instructions array, nutrition object, tags array, and category.`
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()
    
    console.log('Gemini Response:', text)
    
    // Try to parse JSON
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      const recipe = JSON.parse(jsonMatch[0])
      console.log('✅ Gemini fallback working! Recipe:', recipe.name)
    } else {
      console.log('❌ No JSON found in response')
    }
    
  } catch (error) {
    console.error('❌ Gemini test failed:', error.message)
  }
}

testGemini()