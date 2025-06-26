// Bright Sky Weather API Service
// Integrated for Mercedes Smart Charging Coach

export interface WeatherData {
  current: {
    timestamp: string
    temperature: number
    cloud_cover: number
    solar: number | null // Solar irradiation in kWh/m²
    sunshine: number | null // Sunshine duration in minutes
    condition: 'dry' | 'fog' | 'rain' | 'sleet' | 'snow' | 'hail' | 'thunderstorm' | null
    icon: string | null
    visibility: number | null
    precipitation: number | null
    wind_speed: number | null
  }
  forecast: WeatherHourly[]
  location: {
    lat: number
    lng: number
    address: string
  }
  solarOptimization: {
    bestChargingWindow: {
      start: string
      end: string
      avgSolar: number
      avgSunshine: number
    } | null
    todaySolarPotential: 'high' | 'medium' | 'low'
    recommendedChargingTimes: string[]
  }
}

export interface WeatherHourly {
  timestamp: string
  temperature: number
  cloud_cover: number
  solar: number | null
  sunshine: number | null
  condition: string | null
  precipitation: number | null
  precipitation_probability: number | null
}

class WeatherAPI {
  private readonly baseUrl = 'https://api.brightsky.dev'

  // Get current weather and forecast for location
  async getWeatherData(lat: number, lng: number, address: string = ''): Promise<WeatherData | null> {
    try {
      console.log(`🌦️ Fetching weather data for ${lat}, ${lng}`)
      
      // Get current weather
      const currentResponse = await fetch(
        `${this.baseUrl}/current_weather?lat=${lat}&lon=${lng}&units=dwd`
      )
      
      if (!currentResponse.ok) {
        throw new Error(`Current weather API error: ${currentResponse.status}`)
      }
      
      const currentData = await currentResponse.json()
      
      // Get 24-hour forecast for solar optimization
      const tomorrow = new Date()
      tomorrow.setDate(tomorrow.getDate() + 1)
      const tomorrowISO = tomorrow.toISOString().split('T')[0]
      
      const forecastResponse = await fetch(
        `${this.baseUrl}/weather?lat=${lat}&lon=${lng}&date=${new Date().toISOString().split('T')[0]}&last_date=${tomorrowISO}&units=dwd`
      )
      
      if (!forecastResponse.ok) {
        throw new Error(`Forecast API error: ${forecastResponse.status}`)
      }
      
      const forecastData = await forecastResponse.json()
      
      // Process and optimize for solar charging
      return this.processWeatherData(currentData, forecastData, lat, lng, address)
      
    } catch (error) {
      console.error('Weather API Error:', error)
      return null
    }
  }

  private processWeatherData(currentData: any, forecastData: any, lat: number, lng: number, address: string): WeatherData {
    const current = currentData.weather
    const forecast = forecastData.weather.slice(0, 24) // Next 24 hours
    
    // Calculate solar optimization
    const solarOptimization = this.calculateSolarOptimization(forecast)
    
    return {
      current: {
        timestamp: current.timestamp,
        temperature: current.temperature,
        cloud_cover: current.cloud_cover || 0,
        solar: current.solar_60 || null,
        sunshine: current.sunshine_60 || null,
        condition: current.condition,
        icon: current.icon,
        visibility: current.visibility,
        precipitation: current.precipitation_60 || null,
        wind_speed: current.wind_speed
      },
      forecast: forecast.map((hour: any) => ({
        timestamp: hour.timestamp,
        temperature: hour.temperature,
        cloud_cover: hour.cloud_cover || 0,
        solar: hour.solar || null,
        sunshine: hour.sunshine || null,
        condition: hour.condition,
        precipitation: hour.precipitation || null,
        precipitation_probability: hour.precipitation_probability || null
      })),
      location: {
        lat,
        lng,
        address
      },
      solarOptimization
    }
  }

  private calculateSolarOptimization(forecast: any[]): WeatherData['solarOptimization'] {
    const now = new Date()
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    tomorrow.setHours(23, 59, 59)
    
    // Filter daylight hours (6 AM to 8 PM) for today and tomorrow
    const daylightHours = forecast.filter(hour => {
      const hourDate = new Date(hour.timestamp)
      const hourOfDay = hourDate.getHours()
      return hourOfDay >= 6 && hourOfDay <= 20 && hourDate <= tomorrow
    })
    
    if (daylightHours.length === 0) {
      return {
        bestChargingWindow: null,
        todaySolarPotential: 'low',
        recommendedChargingTimes: []
      }
    }

    // Find best consecutive 4-hour window for solar charging
    let bestWindow = null
    let bestAvgSolar = 0
    
    for (let i = 0; i <= daylightHours.length - 4; i++) {
      const window = daylightHours.slice(i, i + 4)
      const avgSolar = window.reduce((sum, hour) => sum + (hour.solar || 0), 0) / 4
      const avgSunshine = window.reduce((sum, hour) => sum + (hour.sunshine || 0), 0) / 4
      const avgCloudCover = window.reduce((sum, hour) => sum + (hour.cloud_cover || 100), 0) / 4
      
      // Score based on solar irradiation, sunshine, and low cloud cover
      const score = avgSolar * 1.5 + (avgSunshine / 60) * 0.5 - (avgCloudCover / 100) * 0.3
      
      if (score > bestAvgSolar) {
        bestAvgSolar = score
        bestWindow = {
          start: window[0].timestamp,
          end: window[3].timestamp,
          avgSolar,
          avgSunshine
        }
      }
    }

    // Calculate today's overall solar potential
    const todaySolarHours = daylightHours.filter(hour => {
      const hourDate = new Date(hour.timestamp)
      return hourDate.toDateString() === now.toDateString()
    })
    
    const avgTodaySolar = todaySolarHours.reduce((sum, hour) => sum + (hour.solar || 0), 0) / Math.max(todaySolarHours.length, 1)
    const avgTodayCloudCover = todaySolarHours.reduce((sum, hour) => sum + (hour.cloud_cover || 100), 0) / Math.max(todaySolarHours.length, 1)
    
    let todaySolarPotential: 'high' | 'medium' | 'low' = 'low'
    if (avgTodaySolar > 0.3 && avgTodayCloudCover < 50) {
      todaySolarPotential = 'high'
    } else if (avgTodaySolar > 0.15 && avgTodayCloudCover < 75) {
      todaySolarPotential = 'medium'
    }

    // Generate recommended charging times (high solar potential hours)
    const recommendedTimes = daylightHours
      .filter(hour => (hour.solar || 0) > 0.2 && (hour.cloud_cover || 100) < 60)
      .slice(0, 6)
      .map(hour => new Date(hour.timestamp).toLocaleTimeString('pt-PT', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: false 
      }))

    return {
      bestChargingWindow: bestWindow,
      todaySolarPotential,
      recommendedChargingTimes: recommendedTimes
    }
  }

  // Get solar-optimized charging recommendation
  getSolarChargingAdvice(weatherData: WeatherData, currentBattery: number): string {
    const { solarOptimization, current } = weatherData
    
    if (!solarOptimization.bestChargingWindow) {
      return "⛅ Solar conditions are not optimal today. I recommend charging during off-peak hours (23:00-07:00) for better rates."
    }

    const windowStart = new Date(solarOptimization.bestChargingWindow.start)
    const windowEnd = new Date(solarOptimization.bestChargingWindow.end)
    
    const startTime = windowStart.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })
    const endTime = windowEnd.toLocaleTimeString('pt-PT', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    })

    let advice = `☀️ **Optimal Solar Charging Window**: ${startTime} - ${endTime}\n\n`
    
    switch (solarOptimization.todaySolarPotential) {
      case 'high':
        advice += `🌞 **Excellent solar conditions!** Clear skies with ${Math.round((solarOptimization.bestChargingWindow.avgSolar || 0) * 1000)}W/m² solar irradiation.\n`
        advice += `💡 You could save up to 70% on charging costs using solar energy during this window.`
        break
      case 'medium':
        advice += `🌤️ **Good solar potential** with some clouds. Solar irradiation: ${Math.round((solarOptimization.bestChargingWindow.avgSolar || 0) * 1000)}W/m².\n`
        advice += `💡 Consider hybrid charging: solar during peak hours, grid during off-peak.`
        break
      case 'low':
        advice += `☁️ **Limited solar potential** due to cloud cover. Solar irradiation: ${Math.round((solarOptimization.bestChargingWindow.avgSolar || 0) * 1000)}W/m².\n`
        advice += `💡 Fallback to off-peak grid charging recommended.`
        break
    }

    // Add current conditions
    if (current.condition === 'rain') {
      advice += `\n\n🌧️ Currently raining - indoor charging recommended.`
    } else if (current.temperature && current.temperature < 5) {
      advice += `\n\n❄️ Cold weather detected (${current.temperature}°C) - battery preconditioning advised.`
    }

    return advice
  }

  // Check if current conditions are good for immediate solar charging
  isGoodForSolarCharging(weatherData: WeatherData): boolean {
    const { current } = weatherData
    const now = new Date()
    const hour = now.getHours()
    
    // Must be daylight hours
    if (hour < 8 || hour > 18) return false
    
    // Check solar conditions
    const hasSolarIrradiation = (current.solar || 0) > 0.15
    const lowCloudCover = (current.cloud_cover || 100) < 70
    const noRain = current.condition !== 'rain' && current.condition !== 'snow'
    
    return hasSolarIrradiation && lowCloudCover && noRain
  }
}

// Export singleton instance
export const weatherAPI = new WeatherAPI() 