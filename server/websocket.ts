import { config } from 'dotenv'
import { WebSocketServer } from 'ws'
import { connectDB, Message } from '../lib/mongodb'

// Charger les variables d'environnement depuis .env.local
config({ path: '.env.local' })

// Connexion à MongoDB
connectDB()

const wss = new WebSocketServer({ 
  port: 3001,
  host: '0.0.0.0' // Écouter sur toutes les interfaces
})

wss.on('connection', (ws) => {
  console.log('Client connected')

  ws.on('message', async (message) => {
    try {
      const parsedMessage = JSON.parse(message.toString())
      
      if (parsedMessage.type === 'message') {
        // Sauvegarder dans MongoDB
        const newMessage = new Message(parsedMessage.data)
        await newMessage.save()

        // Diffuser à TOUS les clients (y compris l'émetteur)
        wss.clients.forEach((client) => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({
              type: 'message',
              data: newMessage
            }))
          }
        })
      }
    } catch (error) {
      console.error('Error processing message:', error)
    }
  })

  ws.on('close', () => {
    console.log('Client disconnected')
  })
})

console.log('WebSocket server running on 0.0.0.0:3001') 