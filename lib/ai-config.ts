// AI Configuration for Mercedes Smart Coach
// Set your AI provider and API key here when ready

export interface AIConfig {
  provider: 'openai' | 'gemini' | null
  apiKey: string | null
  enabled: boolean
}

// Configuration - Update these values when ready to integrate AI
export const aiConfig: AIConfig = {
  provider: null, // Set to 'openai' or 'gemini' when ready
  apiKey: null,   // Add your API key here: process.env.OPENAI_API_KEY or process.env.GEMINI_API_KEY
  enabled: false  // Set to true when AI is configured
}

// Environment variable names for easy reference
export const AI_ENV_VARS = {
  openai: 'OPENAI_API_KEY',
  gemini: 'GEMINI_API_KEY'
} as const

// Initialize AI configuration from environment variables
export function initializeAI(): AIConfig {
  const openaiKey = process.env.OPENAI_API_KEY
  const geminiKey = process.env.GEMINI_API_KEY
  
  if (openaiKey) {
    return {
      provider: 'openai',
      apiKey: openaiKey,
      enabled: true
    }
  }
  
  if (geminiKey) {
    return {
      provider: 'gemini', 
      apiKey: geminiKey,
      enabled: true
    }
  }
  
  return aiConfig // Fallback to manual configuration
}

// Usage instructions (console logs for development)
if (typeof window === 'undefined' && process.env.NODE_ENV === 'development') {
  console.log(`
🚗 Mercedes Smart Coach AI Integration

To enable AI-powered responses:

1. OpenAI Setup:
   - Get API key from: https://platform.openai.com/api-keys
   - Add to .env.local: OPENAI_API_KEY=your_key_here

2. Gemini Setup:
   - Get API key from: https://aistudio.google.com/app/apikey
   - Add to .env.local: GEMINI_API_KEY=your_key_here

3. Manual Setup:
   - Update lib/ai-config.ts with your preferred provider
   - Set enabled: true

Currently using: ${aiConfig.enabled ? `${aiConfig.provider} (AI)` : 'Intelligent Mock Responses'}
  `)
} 