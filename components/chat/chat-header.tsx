"use client"

import { Button } from "@/components/ui/button"
import { useChat } from "@/components/chat/chat-context"

export function ChatHeader() {
  const { activeZone, setActiveZone } = useChat()
  const zones = ['1', '2', '3', '4', '5'] as const

  return (
    <div className="flex gap-4 mb-4">
      {zones.map((zone) => (
        <Button
          key={zone}
          onClick={() => setActiveZone(zone)}
          variant={activeZone === zone ? "default" : "outline"}
          className="flex-1"
        >
          Zone {zone}
        </Button>
      ))}
    </div>
  )
} 