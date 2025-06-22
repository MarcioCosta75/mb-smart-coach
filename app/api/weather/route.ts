import { NextRequest, NextResponse } from 'next/server'
import { weatherAPI } from '@/lib/weather-api'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const lat = searchParams.get('lat')
    const lng = searchParams.get('lng')
    const address = searchParams.get('address') || ''

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    console.log('🌦️ Weather API: Fetching weather data')
    const weatherData = await weatherAPI.getWeatherData(
      parseFloat(lat),
      parseFloat(lng),
      address
    )

    if (!weatherData) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: 500 }
      )
    }

    return NextResponse.json(weatherData)
  } catch (error) {
    console.error('❌ Weather API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { lat, lng, address, batteryLevel } = await request.json()

    if (!lat || !lng) {
      return NextResponse.json(
        { error: 'Latitude and longitude are required' },
        { status: 400 }
      )
    }

    console.log('🌦️ Weather API: Getting solar charging advice')
    const weatherData = await weatherAPI.getWeatherData(lat, lng, address || '')

    if (!weatherData) {
      return NextResponse.json(
        { error: 'Failed to fetch weather data' },
        { status: 500 }
      )
    }

    // Get solar charging advice
    const advice = weatherAPI.getSolarChargingAdvice(weatherData, batteryLevel || 70)
    const isGoodForSolar = weatherAPI.isGoodForSolarCharging(weatherData)

    return NextResponse.json({
      weather: weatherData,
      solarAdvice: advice,
      isGoodForSolar,
      recommendations: {
        chargeNow: isGoodForSolar,
        bestWindow: weatherData.solarOptimization.bestChargingWindow,
        solarPotential: weatherData.solarOptimization.todaySolarPotential,
        recommendedTimes: weatherData.solarOptimization.recommendedChargingTimes
      }
    })
  } catch (error) {
    console.error('❌ Weather API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 