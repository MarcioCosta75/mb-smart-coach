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
“What if I forget to plug in? Or plans change last-minute and I can’t get enough charge in time?”

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
- Seamless integration into Ella’s daily rhythm

Respond as if you’re her trusted smart assistant – making her life easier without requiring her to plan perfectly.`

class SmartCoachAPI {
  private aiConfig: { provider: 'openai'; apiKey: string; enabled: boolean } | null = null
  private context: SmartChargingContext
  
  constructor() {
    // Initialize AI configuration from environment variables
    this.aiConfig = initializeAI()

    // Initialize with mock Mercedes EQS context
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
      return 'Weather data: Loading weather information for location...'
    }

    const { current, solarOptimization } = this.context.weather
    const bestWindow = solarOptimization.bestChargingWindow
    const windowText = bestWindow 
      ? `${new Date(bestWindow.start).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - ${new Date(bestWindow.end).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
      : 'No optimal solar window found'

    return `Current weather context:
- Temperature: ${current.temperature}°C
- Cloud cover: ${current.cloud_cover}%
- Solar irradiation: ${current.solar ? Math.round(current.solar * 1000) + 'W/m²' : 'No data'}
- Condition: ${current.condition || 'Clear'}
- Solar potential today: ${solarOptimization.todaySolarPotential}
- Best solar charging window: ${windowText}
- Recommended times: ${solarOptimization.recommendedChargingTimes.join(', ') || 'None available'}

Use this weather information to provide relevant charging advice, especially for solar optimization and battery care in different temperatures.`
  }

  // Main chat method with AI integration
  async sendMessage(message: string, history: ChatMessage[] = []): Promise<ApiResponse> {
    if (this.aiConfig?.enabled) {
      console.log('🤖 Using OpenAI API for response')
      return this.callOpenAI(message, history)
    } else {
      console.log('📝 Using mock response (AI not configured)')
      // Fallback to intelligent mock responses
      return this.generateMockResponse(message, history)
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
      // Fallback to mock response
      return this.generateMockResponse(message, history)
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

  // Advanced mock response system
  private generateMockResponse(message: string, history: ChatMessage[]): Promise<ApiResponse> {
    return new Promise((resolve) => {
      const lowerMessage = message.toLowerCase()
      let response: string
      let suggestions: string[]
      let actions: any[] = []

      // Context-aware responses
      if (lowerMessage.includes('charging') || lowerMessage.includes('charge')) {
        response = this.getChargingResponse(lowerMessage)
        suggestions = ['Show charging schedule', 'Find AC charging', 'Set battery limit']
        actions = [{ type: 'scheduling', data: { recommendedTime: '23:00', duration: '6h' } }]
      }
      else if (lowerMessage.includes('station') || lowerMessage.includes('location')) {
        response = this.getStationResponse()
        suggestions = ['Navigate to station', 'Check availability', 'Reserve spot']
        actions = [{ type: 'navigation', data: { stationId: 'mb_center_001', distance: '2.3km' } }]
      }
      else if (lowerMessage.includes('cost') || lowerMessage.includes('price')) {
        response = this.getCostResponse()
        suggestions = ['Schedule off-peak', 'Set price alert', 'Compare providers']
        actions = [{ type: 'scheduling', data: { offPeakStart: '23:00', savings: '€8.40' } }]
      }
      else if (lowerMessage.includes('trip') || lowerMessage.includes('route')) {
        response = this.getTripResponse(lowerMessage)
        suggestions = ['Optimize route', 'Book charging', 'Weather check']
        actions = [{ type: 'navigation', data: { chargingStops: 2, totalTime: '4h35min' } }]
      }
      else if (lowerMessage.includes('battery') || lowerMessage.includes('health')) {
        response = this.getBatteryResponse()
        suggestions = ['View battery stats', 'Set charge limit', 'Health tips']
      }
      else if (lowerMessage.includes('green') || lowerMessage.includes('solar')) {
        response = this.getGreenResponse()
        suggestions = ['Schedule solar charging', 'Find renewable stations', 'Carbon tracking']
      }
      else if (lowerMessage.includes('weather') || lowerMessage.includes('tempo') || lowerMessage.includes('clima') || lowerMessage.includes('sun') || lowerMessage.includes('rain')) {
        response = this.getWeatherResponse(lowerMessage)
        suggestions = ['Solar charging advice', 'Weather forecast', 'Optimal charging time']
      }
      else {
        response = this.getGeneralResponse(lowerMessage)
        suggestions = ['Optimize charging', 'Find stations', 'Plan trip']
      }

      // Simulate API delay
      setTimeout(() => {
        resolve({ message: response, suggestions, actions })
      }, 800 + Math.random() * 1200)
    })
  }

  private getChargingResponse(message: string): string {
    // Enhanced responses with weather integration
    if (this.context.weather) {
      const weatherAdvice = weatherAPI.getSolarChargingAdvice(this.context.weather, this.context.batteryLevel)
      const canUseSolarNow = weatherAPI.isGoodForSolarCharging(this.context.weather)
      
      if (message.includes('solar') || message.includes('green')) {
        return weatherAdvice
      }
      
      if (canUseSolarNow) {
        return `🌞 **Perfect solar conditions right now!** Current temperature: ${this.context.weather.current.temperature}°C, cloud cover: ${this.context.weather.current.cloud_cover}%.\n\n${weatherAdvice}`
      }
      
      // Weather-enhanced charging advice
      const temp = this.context.weather.current.temperature
      let tempAdvice = ''
      if (temp !== null && temp < 5) {
        tempAdvice = `\n\n❄️ **Cold weather alert** (${temp}°C): Pre-condition your battery 30 minutes before charging for optimal performance.`
      } else if (temp !== null && temp > 30) {
        tempAdvice = `\n\n🌡️ **Hot weather** (${temp}°C): Consider charging during cooler evening hours to protect battery health.`
      }
      
      return `Based on current conditions (${this.context.weather.current.temperature}°C, ${this.context.weather.current.cloud_cover}% clouds) and energy prices (€${this.context.energyPrices?.current}/kWh peak, €${this.context.energyPrices?.offPeak}/kWh off-peak), I recommend:\n\n${this.context.weather.solarOptimization.todaySolarPotential === 'high' ? '☀️ Solar charging during peak sun hours' : '🌙 Off-peak grid charging (23:00-07:00)'} for maximum savings.${tempAdvice}`
    }
    
    // Fallback responses without weather data
    const responses = [
      `Based on current energy prices (€${this.context.energyPrices?.current}/kWh peak, €${this.context.energyPrices?.offPeak}/kWh off-peak), I recommend charging tonight from 23:00-05:00. This will save you €8.40 compared to peak charging.`,
      `Your EQS is at ${this.context.batteryLevel}% charge. For optimal battery health, charge to 80% using AC charging. This provides ${Math.round(this.context.range * 1.08)} km range - perfect for 3-4 days of typical driving.`,
      `Smart charging activated! I've detected your home solar panels. Scheduling charging from 10:00-14:00 tomorrow to maximize renewable energy usage and save €6.20.`
    ]
    return responses[Math.floor(Math.random() * responses.length)]
  }

  private getStationResponse(): string {
    return `## 🔋 Charging Stations near ${this.context.location?.address}

### Mercedes-Benz Center - **2.3km**
- **2 available** fast chargers *(150kW)*
- **€0.29/kWh** • 20 min to 80%
- *Recommended for Mercedes vehicles*

### IONITY Colombo - **4.1km**  
- **4 available** ultra-fast *(350kW)*
- **€0.35/kWh** • 12 min to 80%
- *Premium network with amenities*

### Tesla Supercharger - **5.8km**
- **6 available** *(250kW)*
- **€0.33/kWh**
- *CCS adapter required*

> **Recommendation:** Mercedes-Benz Center offers the best value and optimal compatibility for your EQS.

Shall I **reserve a spot** at Mercedes-Benz Center?`
  }

  private getCostResponse(): string {
    const savings = ((this.context.energyPrices?.current || 0.32) - (this.context.energyPrices?.offPeak || 0.18)) * 58 // 58kWh battery capacity
    return `Current energy prices in ${this.context.location?.address}:
    
💰 Peak: €${this.context.energyPrices?.peak}/kWh (08:00-20:00)
💰 Standard: €${this.context.energyPrices?.current}/kWh  
💰 Off-peak: €${this.context.energyPrices?.offPeak}/kWh (23:00-07:00)

Charging tonight saves €${savings.toFixed(2)} for a full charge. Over a month, that's €${(savings * 8).toFixed(2)} savings!`
  }

  private getTripResponse(message: string): string {
    if (message.includes('munich') || message.includes('münchen')) {
      return `Route optimized for Lisbon → Munich (1,847 km):

🛣️ **Optimal Route with Charging**
📍 Stop 1: Salamanca, Spain (4h 15min) - 35min charge
📍 Stop 2: Lyon, France (8h 30min) - 25min charge  
📍 Arrive Munich: 13h 20min total

💡 Alternative: Night departure saves €15 in charging costs
🌿 Green route: +45min but 20% renewable energy`
    }
    
    return `For your upcoming trip, I've analyzed your route and found the optimal charging strategy:

🛣️ **Smart Route Planning**
📍 2 charging stops recommended
⚡ Total charging time: 45 minutes
💰 Cost optimized: €23.50 saved
🌦️ Weather contingency included

Total journey time: 4h 35min including breaks.`
  }

  private getBatteryResponse(): string {
    return `Battery Health Report for your EQS 450+:

🔋 **Current Status:** ${this.context.batteryLevel}% (${this.context.range}km range)
📊 **Health Score:** 96.2% (Excellent)
🔄 **Cycles:** 247 / ~1000 estimated lifespan
🌡️ **Temperature:** Optimal

**Recommendations:**
• Keep charge between 20-80% for daily use
• Use DC fast charging sparingly (max 2x/week)  
• Precondition cabin while plugged in`
  }

  private getGreenResponse(): string {
    if (this.context.weather) {
      const weatherAdvice = weatherAPI.getSolarChargingAdvice(this.context.weather, this.context.batteryLevel)
      const solarPotential = this.context.weather.solarOptimization.todaySolarPotential
      const bestWindow = this.context.weather.solarOptimization.bestChargingWindow
      
      let potentialText = ''
      switch (solarPotential) {
        case 'high':
          potentialText = '🌞 **Excellent** (Clear skies, optimal solar irradiation)'
          break
        case 'medium':
          potentialText = '🌤️ **Good** (Partly cloudy, moderate solar potential)'
          break
        case 'low':
          potentialText = '☁️ **Limited** (Overcast conditions)'
          break
      }

      const windowText = bestWindow 
        ? `${new Date(bestWindow.start).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })} - ${new Date(bestWindow.end).toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}`
        : 'Off-peak grid charging recommended'

      return `Green Energy Integration for your EQS:

🌱 **Solar Potential Today:** ${potentialText}
☀️ **Optimal Window:** ${windowText}
🌡️ **Current Conditions:** ${this.context.weather.current.temperature}°C, ${this.context.weather.current.cloud_cover}% cloud cover
🔌 **Green Charging Stations:** 12 within 25km

**Weather-Optimized Schedule:**
${weatherAdvice}

Charging with renewable energy reduces your carbon footprint by 85%!`
    }

    // Fallback without weather data
    return `Green Energy Integration for your EQS:

🌱 **Today's Renewable Mix:** 67% (High solar production)
☀️ **Optimal Solar Window:** 10:00-15:00
🔌 **Green Charging Stations:** 12 within 25km

**Smart Schedule:**
• Morning: Solar home charging (€0.12/kWh equivalent)
• Alternative: Renewable public stations map available

Charging with renewable energy reduces your carbon footprint by 85%!`
  }

  private getWeatherResponse(message: string): string {
    if (this.context.weather) {
      const { current, solarOptimization } = this.context.weather
      const temp = current.temperature
      const condition = current.condition
      const cloudCover = current.cloud_cover
      const solar = current.solar

      let conditionEmoji = '🌤️'
      switch (condition) {
        case 'rain': conditionEmoji = '🌧️'; break
        case 'snow': conditionEmoji = '❄️'; break
        case 'fog': conditionEmoji = '🌫️'; break
        case 'thunderstorm': conditionEmoji = '⛈️'; break
        case 'dry': conditionEmoji = cloudCover && cloudCover < 30 ? '☀️' : '🌤️'; break
      }

      const weatherAdvice = weatherAPI.getSolarChargingAdvice(this.context.weather, this.context.batteryLevel)
      
      return `${conditionEmoji} **Current Weather Conditions in ${this.context.location?.address}:**

🌡️ **Temperature:** ${temp}°C
☁️ **Cloud Cover:** ${cloudCover}%
${solar ? `☀️ **Solar Irradiation:** ${Math.round(solar * 1000)}W/m²` : ''}
🌈 **Condition:** ${condition || 'Clear'}

**Impact on EV Charging:**
${weatherAdvice}

${current.precipitation && current.precipitation > 0 ? '\n🌧️ **Precipitation Alert:** Consider covered charging locations.' : ''}
${temp && temp < 0 ? '\n❄️ **Freezing Alert:** Battery preconditioning recommended before charging.' : ''}`
    }

    // Fallback without weather data
    return `🌦️ **Weather Integration Active**

I'm currently updating weather data for your location to provide:
• ☀️ Solar charging optimization
• 🌡️ Temperature-based battery care
• 🌧️ Weather-aware charging recommendations

Try asking about solar energy or green charging once weather data loads!`
  }

  private getGeneralResponse(message: string): string {
    return `## Welcome to your Mercedes Smart Charging Coach! 🚗⚡

I'm here to **optimize your EQS charging experience**. Here's how I can help:

### 🔋 Smart Charging
- **Cost optimization** with off-peak scheduling
- **Time management** for efficient charging
- **Battery longevity** recommendations

### 🗺️ Station Finder  
- **Real-time availability** updates
- **Route optimization** with charging stops
- **Reservation assistance**

### 💰 Cost Analysis
- **Peak vs off-peak** savings calculator  
- **Price alerts** for optimal timing
- **Monthly cost** tracking

### 🌱 Green Energy
- **Renewable source** integration
- **Solar charging** optimization
- **Carbon footprint** tracking

*What would you like to **explore first**?*`
  }

  private getContextualSuggestions(content: string): string[] {
    const defaultSuggestions = [
      'Tell me more',
      'Show alternatives', 
      'Set reminder'
    ]
    
    if (content.includes('station')) {
      return ['Navigate there', 'Check availability', 'Reserve spot']
    } else if (content.includes('cost') || content.includes('save')) {
      return ['Schedule charging', 'Set price alert', 'View history']
    } else if (content.includes('battery')) {
      return ['View full report', 'Set charge limit', 'Health tips']
    } else if (content.includes('solar') || content.includes('weather') || content.includes('sun')) {
      return ['Solar charging schedule', 'Weather forecast', 'Green energy tips']
    } else if (content.includes('temperature') || content.includes('cold') || content.includes('hot')) {
      return ['Battery conditioning', 'Optimal charging', 'Weather advice']
    }
    
    return defaultSuggestions
  }

  private extractActions(content: string): any[] {
    // Extract actionable items from AI response
    const actions: any[] = []
    
    if (content.includes('navigate') || content.includes('reserve')) {
      actions.push({ type: 'navigation', data: { action: 'route_to_station' } })
    }
    
    if (content.includes('schedule') || content.includes('timer')) {
      actions.push({ type: 'scheduling', data: { action: 'set_charge_timer' } })
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