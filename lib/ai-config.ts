// AI Configuration for Mercedes Smart Coach

export interface AIConfig {
  provider: 'openai'
  apiKey: string
  enabled: boolean
}

// Initialize AI configuration from environment variables
export function initializeAI(): AIConfig | null {
  const rawKey = process.env.OPENAI_API_KEY
  
  if (rawKey) {
    // Clean the API key by removing any newlines or whitespace
    const cleanKey = rawKey.replace(/[\n\r\s]/g, '')
    
    return {
      provider: 'openai',
      apiKey: cleanKey,
      enabled: true
    }
  }
  
  return null
}