"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card"
import Cookies from "js-cookie"

interface LoginFormProps {
  onSuccess?: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const [username, setUsername] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username.trim()) {
      Cookies.set("username", username.trim(), { expires:   7 })
      onSuccess?.()
    }
  }

  return (
    <Card className="w-[500px]">
      <CardHeader className="text-2xl font-bold text-center">
      Connexion
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent>
          <div className="space-y-4">
            <Input
              required
              placeholder="Votre pseudo..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-12 text-lg"
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-48 h-12 text-lg mx-auto">
            Suivant
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
} 