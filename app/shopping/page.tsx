"use client"

import { useEffect, useMemo, useState } from "react"
import { motion } from "framer-motion"
import { ShoppingCart, Plus, Trash2, Check, Download, Share2, Wand2 } from "lucide-react"
import { useRecipe } from "../../src/context/RecipeContext"
import Link from "next/link"
import { useRouter } from "next/navigation"

type Item = { name: string; amount?: string; category?: string }

const categories = ["produce", "dairy", "meat", "bakery", "pantry", "frozen", "other"]

const Shopping = () => {
  const { shoppingList = [], removeFromShoppingList = () => {}, addToShoppingList = () => {}, clearShoppingList = () => {} } = useRecipe()
  const [checked, setChecked] = useState<Set<string>>(new Set())
  const [showAdd, setShowAdd] = useState(false)
  const [newItem, setNewItem] = useState<Item>({ name: "", amount: "", category: "pantry" })
  const router = useRouter()

  useEffect(() => {
    try {
      const saved = localStorage.getItem("smartrecipe:checked")
      if (saved) setChecked(new Set(JSON.parse(saved)))
    } catch {}
  }, [])
  useEffect(() => {
    try {
      localStorage.setItem("smartrecipe:checked", JSON.stringify(Array.from(checked)))
    } catch {}
  }, [checked])

  const totalItems = shoppingList?.length || 0
  const purchasedCount = useMemo(() => Array.from(checked).length, [checked])

  const toggle = (name: string) => {
    setChecked((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  const onAdd = () => {
    const name = newItem.name.trim()
    if (!name) return
    addToShoppingList({ name, amount: newItem.amount?.trim(), category: newItem.category || "other" })
    setNewItem({ name: "", amount: "", category: "pantry" })
    setShowAdd(false)
  }

  const exportCSV = () => {
    const rows = [["Name", "Amount", "Category", "Purchased"]]
    shoppingList.forEach((i) =>
      rows.push([i.name, i.amount || "", i.category || "", checked.has(i.name) ? "Yes" : "No"]),
    )
    const csv = rows.map((r) => r.map((c) => `"${(c || "").toString().replace(/"/g, '""')}"`).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "shopping-list.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  const shareList = async () => {
    const lines = shoppingList.map((i) => `- ${i.name}${i.amount ? ` (${i.amount})` : ""}`).join("\n")
    const text = `Shopping List (${totalItems} items):\n${lines}`
    if (navigator.share) {
      try {
        await navigator.share({ title: "Shopping List", text })
      } catch {}
    } else {
      await navigator.clipboard.writeText(text)
      alert("Shopping list copied to clipboard.")
    }
  }

  const optimizeWithAI = () => {
    const lines = shoppingList.map((i) => `${i.name}${i.amount ? ` (${i.amount})` : ""}`).join(", ")
    const q =
      "Optimize my shopping list for cost, availability, and simple substitutions. List: " + (lines || "no items")
    router.push(`/assistant?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="relative">
            <div className="absolute -top-4 -left-4 text-4xl animate-bounce">🛒</div>
            <div className="absolute -top-2 -right-6 text-3xl animate-pulse">✨</div>
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-4 bg-gradient-to-br from-green-100 to-blue-100 dark:from-green-900 dark:to-blue-900 rounded-full shadow-lg animate-pulse">
                <ShoppingCart className="h-10 w-10 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                🛍️ Smart Shopping List
              </h1>
            </div>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mt-6 font-medium">
            📝 Track purchases, export lists, and optimize with AI! 🤖
          </p>
          
          <div className="flex justify-center gap-4 mt-6">
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-full border border-green-200 dark:border-green-700">
              <span className="text-sm font-semibold text-green-700 dark:text-green-300">📊 {totalItems} Items</span>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">✅ {purchasedCount} Purchased</span>
            </div>
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm px-4 py-2 rounded-full border border-purple-200 dark:border-purple-700">
              <span className="text-sm font-semibold text-purple-700 dark:text-purple-300">📈 {totalItems > 0 ? Math.round((purchasedCount / totalItems) * 100) : 0}% Complete</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAdd((s) => !s)}
            className="flex flex-col items-center p-4 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 hover:from-green-200 hover:to-green-300 text-green-700 dark:text-green-300 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border border-green-200 dark:border-green-700"
          >
            <Plus className="h-6 w-6 mb-2" />
            <span className="text-sm font-semibold">➕ Add Item</span>
          </motion.button>
          <button
            onClick={exportCSV}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
          >
            <Download className="h-4 w-4" /> Export CSV
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
          >
            🖨️ Print
          </button>
          <button
            onClick={shareList}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
          >
            <Share2 className="h-4 w-4" /> Share
          </button>
          <button
            onClick={optimizeWithAI}
            className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700"
          >
            <Wand2 className="h-4 w-4" /> Optimize with AI
          </button>
          {totalItems > 0 && (
            <button
              onClick={clearShoppingList}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-red-200 text-red-700 hover:bg-red-50 ml-auto"
            >
              <Trash2 className="h-4 w-4" /> Clear All
            </button>
          )}
        </div>

        {/* Add Item */}
        {showAdd && (
          <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              value={newItem.name}
              onChange={(e) => setNewItem((s) => ({ ...s, name: e.target.value }))}
              placeholder="Item name"
              className="rounded-lg border px-3 py-2"
            />
            <input
              value={newItem.amount}
              onChange={(e) => setNewItem((s) => ({ ...s, amount: e.target.value }))}
              placeholder="Amount (e.g., 2 packs)"
              className="rounded-lg border px-3 py-2"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((s) => ({ ...s, category: e.target.value }))}
              className="rounded-lg border px-3 py-2"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <button
                onClick={onAdd}
                className="flex-1 rounded-lg bg-green-600 text-white px-3 py-2 hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => setShowAdd(false)}
                className="flex-1 rounded-lg border px-3 py-2 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* List */}
        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm shadow-2xl overflow-hidden">
          {totalItems === 0 ? (
            <div className="p-10 text-center text-gray-600 dark:text-gray-300">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Your shopping list is empty</h3>
              <p className="mt-1">Add recipes to your planner or add items manually to build your list.</p>
              <div className="mt-4 flex justify-center gap-3">
                <Link href="/planner" className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700">
                  Go to Planner
                </Link>
                <button
                  onClick={() => setShowAdd(true)}
                  className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-50"
                >
                  Add Item
                </button>
              </div>
            </div>
          ) : (
            <ul className="divide-y">
              {shoppingList.map((item) => {
                const isChecked = checked.has(item.name)
                return (
                  <li key={item.name} className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                      <button
                        aria-label={isChecked ? "Unmark purchased" : "Mark purchased"}
                        onClick={() => toggle(item.name)}
                        className={`h-6 w-6 rounded border flex items-center justify-center ${
                          isChecked ? "bg-green-600 border-green-600" : "border-gray-300"
                        }`}
                      >
                        {isChecked ? <Check className="h-4 w-4 text-white" /> : null}
                      </button>
                      <div className="flex flex-col">
                        <span className={`font-medium ${isChecked ? "line-through text-gray-400" : "text-gray-800"}`}>
                          {item.name}
                          {item.amount ? <span className="text-gray-500"> • {item.amount}</span> : null}
                        </span>
                        <span className="text-xs text-gray-500">{item.category || "other"}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromShoppingList(item.name)}
                      className="p-2 rounded-md hover:bg-red-50"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5 text-red-600" />
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default Shopping
