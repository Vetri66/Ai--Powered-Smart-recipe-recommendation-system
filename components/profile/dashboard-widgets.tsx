"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <Button asChild>
          <Link href="/meal-planner">Meal Planner</Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/vision-ingredients">Vision</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/voice">Voice</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shopping/enhanced">Shopping</Link>
        </Button>
      </CardContent>
    </Card>
  )
}

export function Stats() {
  // local stats only (non-DB)
  const planned = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("lastPlan") || "[]").length : 0
  const shopping = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("shoppingItems") || "[]").length : 0
  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Stats</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="rounded-md border p-3">
          <div className="text-2xl font-semibold">{planned}</div>
          <div className="opacity-80 text-sm">Planned Days</div>
        </div>
        <div className="rounded-md border p-3">
          <div className="text-2xl font-semibold">{shopping}</div>
          <div className="opacity-80 text-sm">Shopping Items</div>
        </div>
      </CardContent>
    </Card>
  )
}
