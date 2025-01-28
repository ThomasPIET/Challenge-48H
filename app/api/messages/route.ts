import { Message, connectDB } from '@/lib/mongodb'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const zone = searchParams.get('zone')

  try {
    // S'assurer que la connexion à MongoDB est établie
    await connectDB()
    
    const messages = await Message.find({ zone })
      .sort({ timestamp: 1 })
      .lean()

    return NextResponse.json(messages)
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    )
  }
}