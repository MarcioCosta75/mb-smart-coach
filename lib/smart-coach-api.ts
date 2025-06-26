// Smart Coach API Service
// Ready for OpenAI or Gemini integration

import { initializeAI } from './ai-config'
import { weatherAPI, WeatherData } from './weather-api'

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

export interface ApiResponse {
  message: string
  suggestions?: string[]
  actions?: {
    type: 'navigation' | 'scheduling' | 'reservation' | 'notification'
    data: any
  }[]
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

class SmartCoachAPI {
  private aiConfig: { provider: 'openai'; apiKey: string; enabled: boolean } | null = null
  private context: SmartChargingContext
  
  constructor() {
    // Initialize AI configuration from environment variables
    this.aiConfig = initializeAI()

    // Debug log to check API configuration
    console.log('🔧 Smart Coach API initialized')
    console.log('🤖 AI Config enabled:', this.aiConfig?.enabled || false)
    console.log('🔑 API Key available:', this.aiConfig?.apiKey ? 'Yes (length: ' + this.aiConfig.apiKey.length + ')' : 'No')

    // Initialize with Ella's Mercedes EQS context (Stuttgart, Germany)
    this.context = {
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
    
    // Initialize weather data
    this.updateWeatherData()
  }

  // Update weather data for current location
  private async updateWeatherData() {
    if (this.context.location) {
      try {
        const weatherData = await weatherAPI.getWeatherData(
          this.context.location.lat,
          this.context.location.lng,
          this.context.location.address || ''
        )
        if (weatherData) {
          this.context.weather = weatherData
          console.log('🌦️ Weather data updated successfully')
        }
      } catch (error) {
        console.error('Failed to update weather data:', error)
      }
    }
  }

  // Update vehicle and user context
  updateContext(context: Partial<SmartChargingContext>) {
    this.context = { ...this.context, ...context }
    
    // Update weather data if location changed
    if (context.location) {
      this.updateWeatherData()
    }
  }

  // Get weather context for AI prompt
  private getWeatherContext(): string {
    if (!this.context.weather) {
      return 'Weather data: Loading weather information for Stuttgart...'
    }

    const { current, solarOptimization } = this.context.weather
    const bestWindow = solarOptimization.bestChargingWindow
    const windowText = bestWindow 
      ? `${new Date(bestWindow.start).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })} - ${new Date(bestWindow.end).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`
      : 'No optimal solar window found'

    return `Current weather context for Stuttgart:
- Temperature: ${current.temperature}°C
- Cloud cover: ${current.cloud_cover}%
- Solar irradiation: ${current.solar ? Math.round(current.solar * 1000) + 'W/m²' : 'No data'}
- Condition: ${current.condition || 'Clear'}
- Solar potential today: ${solarOptimization.todaySolarPotential}
- Best solar charging window: ${windowText}
- Recommended times: ${solarOptimization.recommendedChargingTimes.join(', ') || 'None available'}

Use this weather information to provide relevant charging advice for Ella's home solar system and Mercedes wallbox.`
  }

  // Main chat method with AI integration
  async sendMessage(message: string, history: ChatMessage[] = []): Promise<ApiResponse> {
    if (this.aiConfig?.enabled) {
      console.log('🤖 Using OpenAI API for response')
      return this.callOpenAI(message, history)
    } else {
      console.log('📝 Using fallback response (AI not configured)')
      return this.generateFallbackResponse(message, history)
    }
  }

  // OpenAI integration
  private async callOpenAI(message: string, history: ChatMessage[]): Promise<ApiResponse> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.aiConfig!.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            { role: 'system', content: SYSTEM_PROMPT },
            { role: 'system', content: `Current vehicle context: ${JSON.stringify(this.context)}` },
            { role: 'system', content: this.getWeatherContext() },
            ...history,
            { role: 'user', content: message }
          ],
          max_tokens: 500,
          temperature: 0.7,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`)
      }

      const data = await response.json()
      return this.parseAIResponse(data.choices[0].message.content)
    } catch (error) {
      console.error('OpenAI API Error:', error)
      // Fallback to basic response
      return this.generateFallbackResponse(message, history)
    }
  }

  // Parse AI response and extract actions/suggestions
  private parseAIResponse(content: string): ApiResponse {
    // Extract suggestions if they exist in the response
    const suggestionMatch = content.match(/Suggestions?:\s*(.+?)(?:\n|$)/i)
    const suggestions = suggestionMatch 
      ? suggestionMatch[1].split(',').map(s => s.trim()).slice(0, 3)
      : this.getContextualSuggestions(content)

    return {
      message: content.replace(/Suggestions?:\s*(.+?)(?:\n|$)/i, '').trim(),
      suggestions,
      actions: this.extractActions(content)
    }
  }

  // Simple fallback response when AI is not available
  private generateFallbackResponse(message: string, history: ChatMessage[]): Promise<ApiResponse> {
    return new Promise((resolve) => {
      const lowerMessage = message.toLowerCase()
      let response: string
      let suggestions: string[]

      // Weather-aware responses
      if (this.context.weather && (lowerMessage.includes('charging') || lowerMessage.includes('charge'))) {
        const weatherAdvice = weatherAPI.getSolarChargingAdvice(this.context.weather, this.context.batteryLevel)
        response = `Hi Ella! ${weatherAdvice}`
        suggestions = ['Show solar schedule', 'Check energy costs', 'Set charging reminder']
      }
      else if (lowerMessage.includes('weather') || lowerMessage.includes('solar')) {
        response = this.getWeatherResponse()
        suggestions = ['Solar charging advice', 'Weather forecast', 'Optimal charging time']
      }
      else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        response = `Current Stuttgart energy prices: €${this.context.energyPrices?.current}/kWh now, €${this.context.energyPrices?.offPeak}/kWh off-peak. I recommend charging tonight to save money!`
        suggestions = ['Schedule off-peak', 'Set price alert', 'View savings']
      }
      else if (lowerMessage.includes('battery')) {
        response = `Your EQS is at ${this.context.batteryLevel}% with ${this.context.range}km range. For daily use, I recommend keeping it between 20-80% for optimal battery health.`
        suggestions = ['Battery health tips', 'Set charge limit', 'Range planning']
      }
      else {
        response = `Hi Ella! I'm your Smart Coach, ready to help optimize your EQS charging with your home solar system. I can help with solar scheduling, cost optimization, and ensuring you never run out of range. What can I help you with today?`
        suggestions = ['Solar charging', 'Energy costs', 'Battery status']
      }

      // Simulate brief processing time
      setTimeout(() => {
        resolve({ message: response, suggestions })
      }, 600 + Math.random() * 800)
    })
  }

  private getWeatherResponse(): string {
    if (this.context.weather) {
      const { current, solarOptimization } = this.context.weather
      const canUseSolarNow = weatherAPI.isGoodForSolarCharging(this.context.weather)
      
      return `Current Stuttgart weather: ${current.temperature}°C, ${current.cloud_cover}% clouds. ${canUseSolarNow ? '☀️ Great solar conditions - perfect for charging with your home panels!' : '☁️ Limited solar today - consider off-peak grid charging tonight.'}`
    }
    
    return 'Weather data is loading for Stuttgart. I\'ll have solar charging recommendations ready shortly!'
  }

  private getContextualSuggestions(content: string): string[] {
    if (content.includes('solar') || content.includes('weather')) {
      return ['Solar schedule', 'Weather forecast', 'Green energy tips']
    } else if (content.includes('cost') || content.includes('save')) {
      return ['Schedule charging', 'Price alerts', 'View savings']
    } else if (content.includes('battery')) {
      return ['Battery health', 'Charge limits', 'Range planning']
    }
    
    return ['Solar charging', 'Energy costs', 'Smart schedule']
  }

  private extractActions(content: string): any[] {
    const actions: any[] = []
    
    if (content.includes('schedule') || content.includes('timer')) {
      actions.push({ type: 'scheduling', data: { action: 'set_charge_timer' } })
    }
    
    if (content.includes('remind') || content.includes('alert')) {
      actions.push({ type: 'notification', data: { action: 'set_reminder' } })
    }
    
    return actions
  }

  // Utility methods
  getContext(): SmartChargingContext {
    return this.context
  }

  isAIConfigured(): boolean {
    return this.aiConfig !== null && this.aiConfig.enabled
  }
}

// Export singleton instance
export const smartCoachAPI = new SmartCoachAPI() 