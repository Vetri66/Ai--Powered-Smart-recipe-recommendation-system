"use client"

import { useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

export default function VoiceAssistant() {
  const [listened, setListened] = useState<string[]>([])
  const [speaking, setSpeaking] = useState(false)
  const textRef = useRef<HTMLTextAreaElement | null>(null)

  const canRecognize =
    typeof window !== "undefined" &&
    // @ts-ignore
    (window.SpeechRecognition || window.webkitSpeechRecognition)

  function addToShopping(item: string) {
    const key = "shoppingItems"
    const existing = JSON.parse(localStorage.getItem(key) || "[]")
    const merged = Array.from(new Set([...(existing || []), item]))
    localStorage.setItem(key, JSON.stringify(merged))
  }

  function readAloud(text: string) {
    if (typeof window === "undefined") return
    const utter = new SpeechSynthesisUtterance(text)
    utter.onend = () => setSpeaking(false)
    setSpeaking(true)
    window.speechSynthesis.speak(utter)
  }

  function startListening() {
    if (!canRecognize) return alert("Speech recognition not supported in this browser.")
    // @ts-ignore
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    // @ts-ignore
    const rec = new SR()
    rec.continuous = true
    rec.interimResults = false
    rec.onresult = (e: any) => {
      const last = e.results[e.results.length - 1][0].transcript as string
      const cmd = last.trim().toLowerCase()
      setListened((L) => [...L, cmd])
      if (cmd.startsWith("add")) {
        const item = cmd.replace(/^add\s+/, "")
        if (item) {
          addToShopping(item)
        }
      }
      if (cmd.startsWith("read")) {
        const text = textRef.current?.value || "No recipe steps provided."
        readAloud(text)
      }
    }
    rec.onerror = () => rec.stop()
    rec.onend = () => {}
    rec.start()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Voice Assistant</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="flex gap-2">
          <Button onClick={startListening}>Start Listening</Button>
          <Button variant="secondary" onClick={() => window.speechSynthesis.cancel()} disabled={!speaking}>
            Stop Speaking
          </Button>
        </div>
        <Textarea ref={textRef} placeholder="Paste recipe steps here, then say 'read' to hear them." />
        {!!listened.length && (
          <div className="rounded-md border p-3">
            <h3 className="font-medium">Heard Commands</h3>
            <ul className="list-disc ml-6">
              {listened.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
