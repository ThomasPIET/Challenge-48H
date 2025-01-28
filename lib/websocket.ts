"use client"

type WebSocketMessage = {
  type: 'message' | 'connection' | 'disconnection'
  data: any
}

class WebSocketService {
  private static instance: WebSocketService
  private ws: WebSocket | null = null
  private messageCallbacks: ((message: any) => void)[] = []
  private isClient = typeof window !== 'undefined'

  private constructor() {
    if (this.isClient) {
      this.connect()
    }
  }

  static getInstance(): WebSocketService {
    if (!WebSocketService.instance) {
      WebSocketService.instance = new WebSocketService()
    }
    return WebSocketService.instance
  }

  private connect() {
    if (!this.isClient) return

    // Utiliser l'URL du WebSocket depuis les variables d'environnement ou fallback sur localhost
    const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'
    this.ws = new WebSocket(wsUrl)

    this.ws.onopen = () => {
      console.log('WebSocket Connected')
    }

    this.ws.onmessage = (event) => {
      const message: WebSocketMessage = JSON.parse(event.data)
      this.messageCallbacks.forEach(callback => callback(message))
    }

    this.ws.onclose = () => {
      console.log('WebSocket Disconnected')
      setTimeout(() => this.connect(), 1000)
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket Error:', error)
    }
  }

  subscribe(callback: (message: any) => void) {
    if (!this.isClient) return () => {}
    
    this.messageCallbacks.push(callback)
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter(cb => cb !== callback)
    }
  }

  sendMessage(message: any) {
    if (!this.isClient) return
    
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message))
    } else {
      console.error('WebSocket is not connected')
    }
  }
}

export const webSocketService = WebSocketService.getInstance() 