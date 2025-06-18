import { NextRequest, NextResponse } from 'next/server'
import { smartCoachAPI, ChatMessage } from '@/lib/smart-coach-api'

export async function POST(request: NextRequest) {
  try {
    const { message, history }: { message: string; history: ChatMessage[] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log('📨 API Route: Processing chat message')
    const response = await smartCoachAPI.sendMessage(message, history || [])

    return NextResponse.json(response)
  } catch (error) {
    console.error('❌ API Route Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 