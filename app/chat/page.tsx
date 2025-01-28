"use client"

import { useEffect, useState } from "react"
import Cookies from "js-cookie"
import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"
import { LoginForm } from "@/components/chat/login-form"
import { ChatProvider } from "@/components/chat/chat-context"

export default function ChatPage() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null)

  useEffect(() => {
    const username = Cookies.get("username")
    setIsLoggedIn(!!username)
  }, [])

  if (isLoggedIn === null) {
    return null
  }

  if (!isLoggedIn) {
    return (
      <div className="h-screen flex items-center justify-center">
        <LoginForm onSuccess={() => setIsLoggedIn(true)} />
      </div>
    )
  }

  return (
    <ChatProvider>
      <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
        <ChatHeader />
        <div className="flex-grow">
          <ChatMessages />
        </div>
      </div>
    </ChatProvider>
  )
}
