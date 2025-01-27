"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"

export function ChatHeader() {
  const [selectedChat, setSelectedChat] = useState("Zone 1")
  const zones = ["Zone 1", "Zone 2", "Zone 3", "Zone 4", "Zone 5"]

  return (
    <div className="flex gap-4 mb-4 p-2 overflow-x-auto w-full">
      {zones.map((zone) => (
        <Card
          key={zone}
          className={`p-4 cursor-pointer flex-1 text-center ${
            selectedChat === zone ? "bg-primary text-primary-foreground" : "hover:bg-accent"
          }`}
          onClick={() => setSelectedChat(zone)}
        >
          {zone}
        </Card>
      ))}
    </div>
  )
} 