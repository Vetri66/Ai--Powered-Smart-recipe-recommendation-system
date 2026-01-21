"use client"

import { useState } from "react"
import { Camera, Upload, ShoppingCart } from "lucide-react"
import Tesseract from "tesseract.js"

export default function ImageIngredients() {
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState("")
  const [ingredients, setIngredients] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const handleOCR = async () => {
    if (!file) return
    setLoading(true)
    try {
      const workerResult = await Tesseract.recognize(await file.arrayBuffer(), "eng", {
        logger: (m) => {
          // optional debug
          // console.log("[v0] OCR:", m)
        },
      })
      const fullText = workerResult.data.text || ""
      setText(fullText)
      const lines = fullText
        .split(/\n+/)
        .map((l) => l.trim())
        .filter(Boolean)

      // naive ingredient parsing: keep words that look like foods or quantities
      const parsed = Array.from(
        new Set(
          lines
            .flatMap((l) => l.split(/,|;|•|-/g))
            .map((s) => s.trim().toLowerCase())
            .filter((s) => s.length > 1 && /\b(\d+|\d+\/\d+|cup|tbsp|tsp|g|kg|ml|l|oz)\b|\b[a-z]{3,}\b/i.test(s)),
        ),
      )
      setIngredients(parsed)
    } finally {
      setLoading(false)
    }
  }

  const addToShopping = () => {
    try {
      const key = "shoppingItems"
      const existing = JSON.parse(localStorage.getItem(key) || "[]")
      const merged = Array.from(new Set([...(existing || []), ...ingredients]))
      localStorage.setItem(key, JSON.stringify(merged))
      alert("Ingredients added to shopping list.")
    } catch {}
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Camera className="h-6 w-6 text-blue-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800">Ingredient Recognition</h2>
      </div>
      
      <div className="space-y-4">
        <div className="grid md:grid-cols-3 gap-3">
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <button 
            onClick={handleOCR} 
            disabled={!file || loading}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <Upload className="h-4 w-4" />
            {loading ? "Reading..." : "Extract Ingredients"}
          </button>
          <button 
            onClick={addToShopping} 
            disabled={!ingredients.length}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Shopping
          </button>
        </div>
        
        {ingredients.length > 0 && (
          <div className="rounded-lg border border-gray-200 p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Detected Ingredients</h3>
            <ul className="list-disc ml-6 space-y-1">
              {ingredients.map((ingredient, index) => (
                <li key={index} className="text-gray-700">{ingredient}</li>
              ))}
            </ul>
          </div>
        )}
        
        {text && (
          <details className="rounded-lg border border-gray-200 p-4">
            <summary className="cursor-pointer font-medium text-gray-800">Raw OCR Text</summary>
            <pre className="text-sm text-gray-600 whitespace-pre-wrap mt-2">{text}</pre>
          </details>
        )}
      </div>
    </div>
  )
}
