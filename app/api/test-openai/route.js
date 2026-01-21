import OpenAI from 'openai'

export async function GET() {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ 
        status: 'error',
        message: 'OpenAI API key not found in environment variables' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    })

    // Simple test call
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: "Say 'OpenAI connection successful!'"
        }
      ],
      max_tokens: 10
    })

    return new Response(JSON.stringify({ 
      status: 'success',
      message: 'OpenAI API is working correctly',
      response: completion.choices[0].message.content
    }), {
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    return new Response(JSON.stringify({ 
      status: 'error',
      message: 'OpenAI API test failed',
      error: error.message
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}