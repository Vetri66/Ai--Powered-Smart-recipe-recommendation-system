"use client"

import VoiceAssistant from "@/components/ai/voice-assistant"

export default function VoicePage() {
  return (
    <main className="container mx-auto max-w-4xl p-6 space-y-6">
      <header>
        <h1 className="text-3xl font-semibold text-balance">Smart Voice Assistant</h1>
        <p className="opacity-80">
          Say “add milk” to put items on your shopping list, or “read” to hear the steps aloud.
        </p>
      </header>
      <VoiceAssistant />
    </main>
  )
}
