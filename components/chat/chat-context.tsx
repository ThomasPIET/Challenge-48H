"use client"

import { createContext, useContext, useState, ReactNode } from 'react'

export type ChatZone = '1' | '2' | '3' | '4' | '5'

export interface Message {
  content: string
  username: string
  timestamp: Date
  zone: ChatZone
}

interface ChatContextType {
  activeZone: ChatZone
  setActiveZone: (zone: ChatZone) => void
  messages: Message[]
  addMessage: (message: Omit<Message, 'zone'>) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [activeZone, setActiveZone] = useState<ChatZone>('1')
  const [messages, setMessages] = useState<Message[]>([])

  const addMessage = (message: Omit<Message, 'zone'>) => {
    setMessages(prev => [...prev, { ...message, zone: activeZone }])
  }

  return (
    <ChatContext.Provider value={{ 
      activeZone, 
      setActiveZone, 
      messages, 
      addMessage 
    }}>
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider')
  }
  return context
} 