import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { audioData, action, text } = body
    const apiKey = process.env.OPENAI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      )
    }

    if (action === 'transcribe') {
      // Use Whisper API for speech-to-text
      const formData = new FormData()
      
      // Convert base64 audio to blob
      const audioBlob = new Blob([
        Uint8Array.from(atob(audioData), c => c.charCodeAt(0))
      ], { type: 'audio/webm' })
      
      formData.append('file', audioBlob, 'audio.webm')
      formData.append('model', 'whisper-1')
      formData.append('response_format', 'json')

      const transcriptionResponse = await fetch(
        'https://api.openai.com/v1/audio/transcriptions',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
          body: formData,
        }
      )

      if (!transcriptionResponse.ok) {
        throw new Error(`Transcription failed: ${transcriptionResponse.status}`)
      }

      const transcription = await transcriptionResponse.json()
      return NextResponse.json({ transcript: transcription.text })
    }

    if (action === 'speak') {
      // Use TTS API for text-to-speech
      if (!text) {
        return NextResponse.json(
          { error: 'Text is required for TTS' },
          { status: 400 }
        )
      }
      
      const ttsResponse = await fetch(
        'https://api.openai.com/v1/audio/speech',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'tts-1',
            voice: 'nova', // Female voice suitable for assistant
            input: text,
            response_format: 'mp3'
          }),
        }
      )

      if (!ttsResponse.ok) {
        throw new Error(`TTS failed: ${ttsResponse.status}`)
      }

      const audioBuffer = await ttsResponse.arrayBuffer()
      const base64Audio = Buffer.from(audioBuffer).toString('base64')
      
      return NextResponse.json({ audioData: base64Audio })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Voice API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 