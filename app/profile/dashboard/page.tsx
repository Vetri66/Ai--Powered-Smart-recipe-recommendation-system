"use client"

import { QuickActions, Stats } from "@/components/profile/dashboard-widgets"

export default function ProfileDashboard() {
  return (
    <main className="container mx-auto max-w-5xl p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-balance">Your Dashboard</h1>
        <p className="opacity-80">Welcome back! Use the quick actions to get things done faster.</p>
      </header>
      <div className="grid md:grid-cols-2 gap-4">
        <QuickActions />
        <Stats />
      </div>
    </main>
  )
}
