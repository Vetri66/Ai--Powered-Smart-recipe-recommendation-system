"use client"

import ShoppingListWidget from "@/components/shopping/list-widget"

export default function EnhancedShoppingPage() {
  return (
    <main className="container mx-auto max-w-3xl p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-balance">Shopping List (Enhanced)</h1>
        <p className="opacity-80">Export, print, share, and optimize your list with AI.</p>
      </header>
      <ShoppingListWidget />
    </main>
  )
}
