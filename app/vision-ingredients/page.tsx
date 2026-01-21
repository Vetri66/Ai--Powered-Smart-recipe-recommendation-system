"use client"

import ImageIngredients from "@/components/ai/image-ingredients"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function VisionIngredientsPage() {
  return (
    <main className="container mx-auto max-w-4xl p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-balance">Ingredient Recognition</h1>
        <p className="opacity-80">
          Upload a photo (label or recipe) to extract ingredients and send them to your shopping list.
        </p>
      </header>

      <ImageIngredients />

      <Card>
        <CardHeader>
          <CardTitle>Tips</CardTitle>
        </CardHeader>
        <CardContent className="text-sm opacity-80">
          • Use well-lit photos. • Crop to the ingredient area for best results.
        </CardContent>
      </Card>
    </main>
  )
}
