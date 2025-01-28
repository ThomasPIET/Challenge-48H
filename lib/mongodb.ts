import mongoose from 'mongoose'
import { config } from 'dotenv'

config({ path: '.env' })

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongodb URI to .env.local')
}

const MONGODB_URI = process.env.MONGODB_URI

let isConnected = false

export async function connectDB() {
  if (isConnected) {
    console.log('Using existing MongoDB connection')
    return
  }

  try {
    await mongoose.connect(MONGODB_URI)
    isConnected = true
    console.log('MongoDB connected')
  } catch (error) {
    console.error('MongoDB connection error:', error)
    throw error
  }
}

const messageSchema = new mongoose.Schema({
  content: { type: String, required: true },
  username: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  zone: { type: String, required: true }
})

export const Message = mongoose.models.Message || mongoose.model('Message', messageSchema) 