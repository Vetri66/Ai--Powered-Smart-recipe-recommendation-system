"use client"

import type React from "react"

import { useState, useEffect } from "react"
import useSWR from "swr"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const fetcher = (url: string, body: any) =>
  fetch(url, { method: "POST", body: JSON.stringify(body) }).then((r) => r.json())

export default function MealPlannerPage() {
  const [form, setForm] = useState({
    calories: "",
    diet: "",
    restrictions: "",
    pantry: "",
    days: 7,
  })
  const [payload, setPayload] = useState<any | null>(null)

  const { data, isValidating, mutate } = useSWR(payload ? ["/api/meal-plan", payload] : null, ([url, body]) =>
    fetcher(url, body),
  )

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPayload(form)
    mutate()
  }

  const plan = data?.days
  const shopping = data?.shoppingList

  useEffect(() => {
    try {
      if (Array.isArray(plan)) {
        localStorage.setItem("lastPlan", JSON.stringify(plan))
      }
    } catch {}
  }, [plan])

  function addPlanToShopping(list: string[]) {
    try {
      const key = "shoppingItems"
      const existing = JSON.parse(localStorage.getItem(key) || "[]")
      const merged = Array.from(new Set([...(existing || []), ...(list || [])]))
      localStorage.setItem(key, JSON.stringify(merged))
      alert("Added all plan items to your shopping list.")
    } catch (e) {
      console.log("[v0] addPlanToShopping error:", (e as Error)?.message)
    }
  }

  return (
    <main className="container mx-auto max-w-5xl p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-balance flex items-center gap-2">
          <span className="text-4xl">🍽️</span>
          AI Meal Planner
        </h1>
        <Button variant="default" onClick={() => window.print()}>
          Print
        </Button>
      </header>

      <Card>
        <CardHeader>
          <CardTitle>Preferences</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <form className="grid md:grid-cols-2 gap-4" onSubmit={onSubmit}>
            <div className="grid gap-2">
              <Label htmlFor="calories">Daily calories</Label>
              <Input
                id="calories"
                inputMode="numeric"
                placeholder="e.g. 2000"
                value={form.calories}
                onChange={(e) => setForm((f) => ({ ...f, calories: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="diet">Diet</Label>
              <Input
                id="diet"
                placeholder="e.g. vegetarian, keto, halal"
                value={form.diet}
                onChange={(e) => setForm((f) => ({ ...f, diet: e.target.value }))}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="restrictions">Restrictions</Label>
              <Input
                id="restrictions"
                placeholder="e.g. nuts, shellfish"
                value={form.restrictions}
                onChange={(e) => setForm((f) => ({ ...f, restrictions: e.target.value }))}
              />
            </div>
            <div className="grid gap-2 md:col-span-2">
              <Label htmlFor="pantry">Pantry items</Label>
              <Textarea
                id="pantry"
                placeholder="Comma-separated: rice, eggs, onions"
                value={form.pantry}
                onChange={(e) => setForm((f) => ({ ...f, pantry: e.target.value }))}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="days">Days</Label>
              <Input
                id="days"
                inputMode="numeric"
                value={form.days}
                onChange={(e) => setForm((f) => ({ ...f, days: Number(e.target.value || 7) }))}
              />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isValidating}>
                {isValidating ? "Generating..." : "Generate Plan"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {!!plan && (
        <section className="grid md:grid-cols-2 gap-4">
          {plan.map((d: any) => (
            <Card key={d.day}>
              <CardHeader>
                <CardTitle>Day {d.day}</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {["breakfast", "lunch", "dinner"].map((meal) => {
                  const m: any = d[meal]
                  const mealEmojis = { breakfast: '🍳', lunch: '🥗', dinner: '🍽️' }
                  const mealImages = {
                    breakfast: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+MhyBCcmVha2Zhc3Q8L3RleHQ+PC9zdmc+',
                    lunch: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+llyBMdW5jaDwvdGV4dD48L3N2Zz4=',
                    dinner: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzEwYjk4MSIvPjx0ZXh0IHg9IjE1MCIgeT0iMTAwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+8J+NvSBEaW5uZXI8L3RleHQ+PC9zdmc+'
                  }
                  const fallbackImage = mealImages[meal]
                  
                  return (
                    <div key={meal} className="rounded-xl border-2 border-green-200 dark:border-green-700 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                          <img
                            src={fallbackImage}
                            alt={m?.title || meal}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-lg text-gray-800 dark:text-white flex items-center gap-2">
                            <span className="text-2xl">{mealEmojis[meal]}</span>
                            {meal[0].toUpperCase() + meal.slice(1)}
                          </h3>
                          <p className="font-medium text-green-600 dark:text-green-400">{m?.title}</p>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                          <span>🥘</span> Ingredients:
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 p-2 rounded-lg">
                          {(m?.ingredients || []).join(", ") || "No ingredients listed"}
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                          <span>👨🍳</span> Instructions:
                        </h4>
                        <ol className="list-decimal ml-4 text-sm space-y-1">
                          {(m?.instructions || []).map((step: string, i: number) => (
                            <li key={i} className="text-gray-600 dark:text-gray-400">{step}</li>
                          ))}
                        </ol>
                      </div>
                    </div>
                  )
                })}
                {!!d.snacks?.length && <p className="text-sm opacity-80">Snacks: {d.snacks.join(", ")}</p>}
              </CardContent>
            </Card>
          ))}
        </section>
      )}

      {!!shopping?.length && (
        <Card>
          <CardHeader>
            <CardTitle>Shopping List (from plan)</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <ul className="list-disc ml-6">
              {shopping.map((item: string, i: number) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <div className="flex gap-2">
              <Button variant="secondary" onClick={() => exportCSV("meal-plan-shopping.csv", shopping)}>
                Export CSV
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  navigator?.share?.({
                    title: "Meal Plan Shopping List",
                    text: shopping.join(", "),
                  })
                }
              >
                Share
              </Button>
              <Button variant="default" onClick={() => addPlanToShopping(shopping)}>
                Add all to Shopping
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}

function exportCSV(filename: string, rows: string[]) {
  const csv = "Item\n" + rows.map((r) => `"${r.replace(/"/g, '""')}"`).join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", filename)
  link.style.visibility = "hidden"
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
