import { NextRequest, NextResponse } from 'next/server'
import { initializeAI } from '@/lib/ai-config'
import { weatherAPI, WeatherData } from '@/lib/weather-api'

export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export interface SmartChargingContext {
  vehicleModel: string
  batteryLevel: number
  range: number
  location?: {
    lat: number
    lng: number
    address?: string
  }
  energyPrices?: {
    current: number
    offPeak: number
    peak: number
    currency: string
  }
  userPreferences?: {
    ecoMode: boolean
    costOptimization: boolean
    timePreference: 'flexible' | 'urgent'
  }
  weather?: WeatherData
}

// Helper function to get current Stuttgart time
function getStuttgartDateTime(): { date: string; time: string; dayOfWeek: string; timezone: string } {
  const now = new Date()
  
  // Stuttgart timezone (CET/CEST - UTC+1/UTC+2)
  const stuttgartTime = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Berlin" }))
  
  const date = stuttgartTime.toLocaleDateString('pt-PT', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  
  const time = stuttgartTime.toLocaleTimeString('pt-PT', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  })
  
  const dayOfWeek = stuttgartTime.toLocaleDateString('pt-PT', {
    weekday: 'long'
  })
  
  // Determine if we're in CET (winter) or CEST (summer)
  const timezone = stuttgartTime.getTimezoneOffset() === -60 ? 'CET (UTC+1)' : 'CEST (UTC+2)'
  
  return { date, time, dayOfWeek, timezone }
}

// System prompt for Mercedes Smart Charging Coach
const SYSTEM_PROMPT = `You are Mercedes Smart Coach, a proactive EQS SUV charging assistant for Ella in Stuttgart.

**Your Role:**
Smart, concise charging advisor that prevents range anxiety and optimizes solar/grid energy usage.

**Response Guidelines:**
- **Keep responses SHORT and actionable** (max 2-3 sentences for simple questions)
- For battery/status checks: Give direct answer + one key insight
- For charging recommendations: Max 3 bullet points
- For urgent situations: Immediate action + brief reason
- Only provide detailed explanations when explicitly asked ("explain why" or "tell me more")

**Core Functions:**
- Battery status & range optimization
- Solar charging windows (daylight hours)
- Off-peak pricing (23:00-07:00, €0.18/kWh)
- Proactive charging reminders

**Tone:** Confident, helpful, Mercedes-elegant. Like a trusted assistant who values your time.

**Current Context:** Stuttgart-based EQS 450+ with home solar & wallbox.`

export async function POST(request: NextRequest) {
  try {
    const { message, history }: { message: string; history: ChatMessage[] } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    console.log('📨 API Route: Processing chat message:', message)
    
    // Initialize AI configuration on server side
    const aiConfig = initializeAI()
    
    if (!aiConfig || !aiConfig.enabled) {
      console.log('❌ OpenAI not configured, returning fallback response')
      return NextResponse.json({
        message: "I'm your Mercedes Smart Coach! However, my AI capabilities are currently unavailable. Please check that the OpenAI API key is properly configured.",
        suggestions: ['Check configuration', 'Try again later', 'Contact support']
      })
    }

    console.log('🤖 Using OpenAI API for response')
    console.log('🔑 API Key configured: Yes (length:', aiConfig.apiKey.length, ')')

    // Get current Stuttgart date/time for temporal context
    const currentDateTime = getStuttgartDateTime()

    // Get current context (this would normally come from database/session)
    const context: SmartChargingContext = {
      vehicleModel: 'EQS 450+',
      batteryLevel: 74,
      range: 504,
      location: {
        lat: 48.7758,
        lng: 9.1829,
        address: 'Stuttgart, Germany'
      },
      energyPrices: {
        current: 0.32,
        offPeak: 0.18,
        peak: 0.35,
        currency: 'EUR'
      },
      userPreferences: {
        ecoMode: true,
        costOptimization: true,
        timePreference: 'flexible'
      }
    }

    // Get weather context
    let weatherContext = 'Weather data: Loading weather information for location...'
    try {
      const weatherData = await weatherAPI.getWeatherData(
        context.location!.lat,
        context.location!.lng,
        context.location!.address || ''
      )
      if (weatherData) {
        context.weather = weatherData
        const { current, solarOptimization } = weatherData
        const bestWindow = solarOptimization.bestChargingWindow
        const windowText = bestWindow 
          ? `${new Date(bestWindow.start).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false })} - ${new Date(bestWindow.end).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', hour12: false })}`
          : 'No optimal solar window found'

        weatherContext = `Weather: ${current.temperature}°C, ${current.condition || 'Clear'} (${current.cloud_cover}% clouds)
Solar window: ${windowText}`
      }
    } catch (error) {
      console.error('Weather data error:', error)
    }

    // Create temporal context for the AI
    const temporalContext = `Current time: ${currentDateTime.time} on ${currentDateTime.dayOfWeek}
Solar hours: 06:00-20:00 | Off-peak: 23:00-07:00`

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${aiConfig.apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'system', content: temporalContext },
          { role: 'system', content: `Current vehicle context: ${JSON.stringify(context)}` },
          { role: 'system', content: weatherContext },
          ...history,
          { role: 'user', content: message }
        ],
        max_tokens: 150,
        temperature: 0.5,
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('OpenAI API error:', response.status, errorText)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiMessage = data.choices[0].message.content

    console.log('✅ OpenAI Response received:', aiMessage.substring(0, 100) + '...')

    // Extract suggestions if they exist in the response
    const suggestionMatch = aiMessage.match(/Suggestions?:\s*(.+?)(?:\n|$)/i)
    const suggestions = suggestionMatch 
      ? suggestionMatch[1].split(',').map((s: string) => s.trim()).slice(0, 3)
      : ['Schedule charging', 'Find nearby stations', 'Check weather']

    return NextResponse.json({
      message: aiMessage.replace(/Suggestions?:\s*(.+?)(?:\n|$)/i, '').trim(),
      suggestions,
      actions: []
    })

  } catch (error) {
    console.error('❌ API Route Error:', error)
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: "I'm experiencing some technical difficulties. Please try again in a moment.",
        suggestions: ['Try again', 'Check connection', 'Contact support']
      },
      { status: 500 }
    )
  }
} 