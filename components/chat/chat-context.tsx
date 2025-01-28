"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { webSocketService } from '@/lib/websocket'

export type ChatZone = '1' | '2' | '3' | '4' | '5'

export interface Message {
  _id?: string  // ID MongoDB
  id?: number
  content: string
  username: string
  timestamp: Date
  zone: ChatZone
}

interface ChatContextType {
  activeZone: ChatZone
  setActiveZone: (zone: ChatZone) => void
  messages: Message[]
  addMessage: (message: Omit<Message, 'zone' | 'id'>) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeZone, setActiveZone] = useState<ChatZone>('1')
  const [messages, setMessages] = useState<Message[]>([])

  const fetchMessages = async (zone: ChatZone) => {
    try {
      const response = await fetch(`/api/messages?zone=${zone}`)
      const data = await response.json()
      setMessages(data)
    } catch (error) {
      console.error('Failed to fetch messages:', error)
    }
  }

  useEffect(() => {
    fetchMessages(activeZone)

    const handleWebSocketMessage = (message: any) => {
      if (message.type === 'message') {
        if (message.data.zone === activeZone) {
          setMessages(prev => {
            const messageExists = prev.some(m => 
              m._id === message.data._id || 
              (m.content === message.data.content && 
               m.username === message.data.username && 
               m.timestamp === message.data.timestamp)
            )
            if (!messageExists) {
              return [...prev, message.data]
            }
            return prev
          })
        }
      }
    }

    const unsubscribe = webSocketService.subscribe(handleWebSocketMessage)
    return () => unsubscribe()
  }, [activeZone])

  const addMessage = async (message: Omit<Message, 'zone' | 'id'>) => {
    const newMessage = { ...message, zone: activeZone }
    webSocketService.sendMessage({
      type: 'message',
      data: newMessage
    })
  }

  const contextValue = {
    activeZone,
    setActiveZone,
    messages,
    addMessage
  }

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
} 