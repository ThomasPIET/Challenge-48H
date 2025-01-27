import { ChatHeader } from "@/components/chat/chat-header"
import { ChatMessages } from "@/components/chat/chat-messages"

export default function ChatPage() {
  return (
    <div className="flex flex-col h-screen max-w-6xl mx-auto p-4">
      <ChatHeader />
      <div className="flex-grow">
        <ChatMessages />
      </div>
    </div>
  )
}
