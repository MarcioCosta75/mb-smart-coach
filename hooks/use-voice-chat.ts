import { useState, useRef, useCallback } from 'react'

export interface VoiceState {
  isRecording: boolean
  isProcessing: boolean
  isPlaying: boolean
  error: string | null
  isVoiceMode: boolean
}

export function useVoiceChat() {
  const [voiceState, setVoiceState] = useState<VoiceState>({
    isRecording: false,
    isProcessing: false,
    isPlaying: false,
    error: null,
    isVoiceMode: false
  })

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const currentAudioRef = useRef<HTMLAudioElement | null>(null)

  // Toggle voice mode
  const toggleVoiceMode = useCallback(() => {
    setVoiceState(prev => ({ 
      ...prev, 
      isVoiceMode: !prev.isVoiceMode,
      error: null 
    }))
    console.log('🎤 Voice mode toggled:', !voiceState.isVoiceMode ? 'ON' : 'OFF')
  }, [voiceState.isVoiceMode])

  // Convert text to speech and play automatically
  const speakText = useCallback(async (text: string): Promise<void> => {
    try {
      // Evitar múltiplas conversões simultâneas
      if (voiceState.isProcessing || voiceState.isPlaying) {
        console.log('⏸️ Skipping TTS - already processing or playing audio')
        return
      }

      console.log('🗣️ Converting text to speech:', text.substring(0, 50) + '...')
      setVoiceState(prev => ({ ...prev, isProcessing: true }))

      const ttsResponse = await fetch('/api/voice', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'speak',
          text: text
        })
      })

      if (!ttsResponse.ok) {
        throw new Error('Text-to-speech failed')
      }

      const { audioData } = await ttsResponse.json()
      
      // Play the audio
      await playAudio(audioData)
      
      setVoiceState(prev => ({ ...prev, isProcessing: false }))
      
    } catch (error) {
      console.error('TTS Error:', error)
      setVoiceState(prev => ({ 
        ...prev, 
        error: `Text-to-speech failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isProcessing: false 
      }))
    }
  }, [voiceState.isProcessing, voiceState.isPlaying])

  // Start recording audio
  const startRecording = useCallback(async () => {
    try {
      // Ativar modo de voz quando começar a gravar
      setVoiceState(prev => ({ ...prev, isVoiceMode: true }))

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          channelCount: 1,
          sampleRate: 16000,
          echoCancellation: true,
          noiseSuppression: true
        } 
      })

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setVoiceState(prev => ({ ...prev, isRecording: true, error: null }))

      console.log('🎤 Recording started - Voice mode activated')

    } catch (error) {
      console.error('Failed to start recording:', error)
      setVoiceState(prev => ({ 
        ...prev, 
        error: 'Microphone access denied. Please allow microphone access.',
        isRecording: false 
      }))
    }
  }, [])

  // Stop recording and process voice message
  const stopRecording = useCallback(async (onTranscript: (transcript: string) => Promise<string>) => {
    return new Promise<void>((resolve) => {
      if (!mediaRecorderRef.current) {
        resolve()
        return
      }

      mediaRecorderRef.current.onstop = async () => {
        try {
          setVoiceState(prev => ({ ...prev, isRecording: false, isProcessing: true }))

          // Create audio blob from recorded chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
          
          // Convert to base64
          const reader = new FileReader()
          reader.onload = async () => {
            try {
              const base64Audio = (reader.result as string).split(',')[1]

              // Step 1: Transcribe audio to text
              console.log('🔄 Transcribing audio...')
              const transcribeResponse = await fetch('/api/voice', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  action: 'transcribe',
                  audioData: base64Audio
                })
              })

              if (!transcribeResponse.ok) {
                throw new Error('Transcription failed')
              }

              const { transcript } = await transcribeResponse.json()
              console.log('📝 Transcript:', transcript)

              if (!transcript || transcript.trim() === '') {
                throw new Error('No speech detected')
              }

              // Step 2: Get response from Smart Coach
              console.log('🤖 Getting AI response...')
              const responseText = await onTranscript(transcript)

              // Step 3: Convert response to speech
              console.log('🗣️ Converting to speech...')
              const ttsResponse = await fetch('/api/voice', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  action: 'speak',
                  text: responseText
                })
              })

              if (!ttsResponse.ok) {
                throw new Error('Text-to-speech failed')
              }

              const { audioData } = await ttsResponse.json()

              // Step 4: Play the audio response
              await playAudio(audioData)

              setVoiceState(prev => ({ ...prev, isProcessing: false }))

                         } catch (error) {
               console.error('Voice processing error:', error)
               setVoiceState(prev => ({ 
                 ...prev, 
                 error: `Voice processing failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
                 isProcessing: false 
               }))
            }
          }
          reader.readAsDataURL(audioBlob)

        } catch (error) {
          console.error('Error processing voice:', error)
          setVoiceState(prev => ({ 
            ...prev, 
            error: 'Failed to process voice message',
            isProcessing: false 
          }))
        }

        // Clean up
        mediaRecorderRef.current?.stream.getTracks().forEach(track => track.stop())
        mediaRecorderRef.current = null
        resolve()
      }

      mediaRecorderRef.current.stop()
    })
  }, [])

  // Play audio from base64 data
  const playAudio = useCallback(async (base64AudioData: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        setVoiceState(prev => ({ ...prev, isPlaying: true }))

        // Stop any currently playing audio
        if (currentAudioRef.current) {
          currentAudioRef.current.pause()
          currentAudioRef.current = null
        }

        // Create audio element
        const audio = new Audio(`data:audio/mp3;base64,${base64AudioData}`)
        currentAudioRef.current = audio

        audio.onended = () => {
          setVoiceState(prev => ({ ...prev, isPlaying: false }))
          currentAudioRef.current = null
          resolve()
        }

        audio.onerror = (error) => {
          console.error('Audio playback error:', error)
          setVoiceState(prev => ({ 
            ...prev, 
            isPlaying: false, 
            error: 'Failed to play audio response' 
          }))
          currentAudioRef.current = null
          reject(error)
        }

        audio.play()

      } catch (error) {
        console.error('Error playing audio:', error)
        setVoiceState(prev => ({ 
          ...prev, 
          isPlaying: false, 
          error: 'Failed to play audio response' 
        }))
        reject(error)
      }
    })
  }, [])

  // Stop any ongoing operations
  const stopAll = useCallback(() => {
    // Stop recording
    if (mediaRecorderRef.current && voiceState.isRecording) {
      mediaRecorderRef.current.stop()
    }

    // Stop audio playback
    if (currentAudioRef.current) {
      currentAudioRef.current.pause()
      currentAudioRef.current = null
    }

    setVoiceState({
      isRecording: false,
      isProcessing: false,
      isPlaying: false,
      error: null,
      isVoiceMode: false
    })
  }, [voiceState.isRecording])

  // Clear error
  const clearError = useCallback(() => {
    setVoiceState(prev => ({ ...prev, error: null }))
  }, [])

  return {
    voiceState,
    startRecording,
    stopRecording,
    playAudio,
    stopAll,
    clearError,
    toggleVoiceMode,
    speakText
  }
} 