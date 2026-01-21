import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"

export async function POST(req: NextRequest) {
  try {
    const { items = [], diet = "balanced", budget = "medium" } = await req.json()
    const prompt = `
You are a smart shopping list optimizer.
Given items: ${JSON.stringify(items)}
Diet: ${diet}, Budget: ${budget}

Return JSON:
{
  "grouped": { "produce": [], "protein": [], "grains": [], "dairy": [], "pantry": [], "spices": [], "other": [] },
  "deduped": [],
  "substitutions": [{ "from": "", "to": "", "note": "" }],
  "savingsTips": ["", ""]
}
Only valid JSON, no commentary.
`
    const { text } = await generateText({ model: "openai/gpt-5-mini", prompt })
    let data
    try {
      data = JSON.parse(text)
    } catch {
      const match = text.match(/\{[\s\S]*\}$/)
      data = match ? JSON.parse(match[0]) : { error: "Unable to parse optimization." }
    }
    return NextResponse.json(data)
  } catch (e: any) {
    console.error("[v0] optimize-list error:", e?.message)
    return NextResponse.json({ error: "Optimization failed" }, { status: 500 })
  }
}
