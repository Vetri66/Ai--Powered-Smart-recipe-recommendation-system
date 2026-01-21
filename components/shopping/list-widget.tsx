"use client"

import { useEffect, useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function ShoppingListWidget() {
  const key = "shoppingItems"
  const [items, setItems] = useState<string[]>([])
  const [input, setInput] = useState("")
  const [querying, setQuerying] = useState(false)

  useEffect(() => {
    try {
      const existing = JSON.parse(localStorage.getItem(key) || "[]")
      setItems(existing || [])
    } catch {}
  }, [])

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(items))
  }, [items])

  const deduped = useMemo(() => Array.from(new Set(items.map((s) => s.trim()).filter(Boolean))), [items])

  function addItem() {
    if (!input.trim()) return
    setItems((lst) => [...lst, input.trim()])
    setInput("")
  }

  function removeItem(i: number) {
    setItems((lst) => lst.filter((_, idx) => idx !== i))
  }

  function exportCSV() {
    const csv = "Item\n" + deduped.map((r) => `"${r.replace(/"/g, '""')}"`).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", "shopping-list.csv")
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  async function optimizeWithAI() {
    setQuerying(true)
    try {
      const body = {
        calories: "",
        diet: "",
        restrictions: "",
        pantry: deduped.join(", "),
        days: 1,
      }
      const res = await fetch("/api/meal-plan", { method: "POST", body: JSON.stringify(body) })
      const json = await res.json()
      const list = json?.shoppingList as string[] | undefined
      if (list?.length) {
        const merged = Array.from(new Set([...deduped, ...list]))
        setItems(merged)
      } else {
        alert("AI couldn't optimize the list this time.")
      }
    } finally {
      setQuerying(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Shopping List</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-2">
          <Input
            placeholder="Add item..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
            aria-label="New shopping item"
          />
          <Button onClick={addItem}>Add</Button>
        </div>

        <ul className="grid gap-2">
          {deduped.map((it, i) => (
            <li key={it} className="flex items-center justify-between rounded-md border p-2">
              <span>{it}</span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => navigator?.share?.({ title: "Shopping Item", text: it })}>
                  Share
                </Button>
                <Button variant="outline" onClick={() => removeItem(i)}>
                  Remove
                </Button>
              </div>
            </li>
          ))}
          {!deduped.length && (
            <p className="opacity-80">Your list is empty. Try the Vision or Voice tools to add items faster.</p>
          )}
        </ul>

        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={exportCSV}>
            Export CSV
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Print
          </Button>
          <Button onClick={optimizeWithAI} disabled={querying}>
            {querying ? "Optimizing..." : "Optimize with AI"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
