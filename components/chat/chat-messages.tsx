"use client"

import { useState, useRef, useEffect, KeyboardEvent } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import Cookies from "js-cookie"
import { useChat } from "@/components/chat/chat-context"

export function ChatMessages() {
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const username = Cookies.get("username") || "Anonyme"
  const { activeZone, messages, addMessage } = useChat()

  const currentZoneMessages = messages.filter(msg => msg.zone === activeZone)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [currentZoneMessages])

  // Ajuster automatiquement la hauteur du textarea
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = 'auto'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  const sendMessage = () => {
    if (input.trim()) {
      addMessage({
        content: input.trim(),
        username: username,
        timestamp: new Date()
      })
      setInput("")
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto'
      }
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage()
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex-1 min-h-0 mb-4">
        <ScrollArea className="h-full p-4 border rounded-lg bg-background">
          {currentZoneMessages.map((message, index) => (
            <div 
              key={index} 
              className={`mb-6 flex flex-col ${message.username === username ? "items-end" : "items-start"}`}
            >
              <div className="text-sm text-muted-foreground mb-1">
                {message.username}
              </div>
              <div className="max-w-[80%]">
                <div
                  className={`rounded-lg ${
                    message.username === username 
                      ? "bg-blue-500 text-white" 
                      : "bg-gray-200 text-black"
                  }`}
                >
                  <div className="p-3 whitespace-pre-line" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>
                    {message.content}
                  </div>
                </div>
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </ScrollArea>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            adjustTextareaHeight()
          }}
          onKeyDown={handleKeyDown}
          placeholder={`Zone ${activeZone} - Tapez votre message ici... (Entrée pour envoyer, Shift+Entrée pour sauter une ligne)`}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          rows={1}
        />
        <Button type="submit" size="lg" className="px-8 h-12 self-end">
          Envoyer
        </Button>
      </form>
    </div>
  )
} 