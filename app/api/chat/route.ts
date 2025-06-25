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

// System prompt for Mercedes Smart Charging Coach
const SYSTEM_PROMPT = `You are Mercedes Smart Coach, a proactive assistant designed to support EQS SUV drivers with smart charging in real-world situations.

**Persona:**
Effortless Ella – 29, self-employed architect based in Stuttgart, Germany. She works from home most days using a hybrid setup. She has a home solar panel system with a Mercedes wallbox. She dislikes planning but appreciates tech that works seamlessly. She drives a Mercedes EQS SUV.

**Context Example:**
- Day starts with "WFH – Client calls"
- Forgot to plug in the car last night
- Calendar updated at 10:45 with a last-minute meeting at HQ at 13:00
- Weather: Sunny between 11:00–13:00 → good solar potential
- Battery: 22% (not enough for roundtrip)

**User Fear / Insight:**
"What if I forget to plug in? Or plans change last-minute and I can't get enough charge in time?"

**Core Functionalities:**
- Smart charging schedule optimization using solar & grid energy
- Cost-efficient off-peak charging
- Proactive reminders and calendar awareness
- Mercedes wallbox & rooftop solar integration
- Battery longevity and health monitoring
- Real-time energy pricing in Stuttgart (EUR)
- Weather-based solar charging optimization
- Real-time meteorological data integration

**Behavioral Logic:**
- Preemptive morning check at 07:00 for unplugged vehicle
- Calendar sync and detection of last-minute meetings
- Weather-optimized solar charging suggestions
- Real-time solar irradiation and cloud cover analysis
- Alerts about risk of not reaching destination
- Contextual fallback: suggest public chargers nearby if too late
- Temperature-based battery preconditioning recommendations

**Response Style:**
- Friendly but efficient
- Give clear next steps
- Include key data (charging %, solar window, cost €/kWh, weather conditions)
- Use Mercedes tone: elegant, tech-smart, helpful
- Integrate weather context naturally into recommendations

**Always prioritize:**
- User confidence & peace of mind
- Avoiding last-minute range anxiety
- Seamless integration into Ella's daily rhythm

Respond as if you're her trusted smart assistant – making her life easier without requiring her to plan perfectly.`

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
          ? `${new Date(bestWindow.start).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - ${new Date(bestWindow.end).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
          : 'No optimal solar window found'

        weatherContext = `Current weather context:
- Temperature: ${current.temperature}°C
- Cloud cover: ${current.cloud_cover}%
- Solar irradiation: ${current.solar ? Math.round(current.solar * 1000) + 'W/m²' : 'No data'}
- Condition: ${current.condition || 'Clear'}
- Solar potential today: ${solarOptimization.todaySolarPotential}
- Best solar charging window: ${windowText}
- Recommended times: ${solarOptimization.recommendedChargingTimes.join(', ') || 'None available'}`
      }
    } catch (error) {
      console.error('Weather data error:', error)
    }

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
          { role: 'system', content: `Current vehicle context: ${JSON.stringify(context)}` },
          { role: 'system', content: weatherContext },
          ...history,
          { role: 'user', content: message }
        ],
        max_tokens: 500,
        temperature: 0.7,
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