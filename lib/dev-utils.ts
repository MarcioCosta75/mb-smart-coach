// Utility functions for development environment

export function suppressDevWarnings() {
  if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
    // Suprimir aviso específico do React DevTools
    const originalWarn = console.warn
    console.warn = (...args) => {
      const message = args[0]
      if (typeof message === 'string') {
        // Lista de avisos que queremos suprimir
        const suppressedWarnings = [
          'Download the React DevTools',
          'Skipping auto-scroll behavior due to',
          'Image with src',
          'has either width or height modified'
        ]
        
        const shouldSuppress = suppressedWarnings.some(warning => 
          message.includes(warning)
        )
        
        if (shouldSuppress) {
          return
        }
      }
      originalWarn.apply(console, args)
    }
  }
}

// Função para otimizar componentes de imagem
export function getImageProps(name: string) {
  const isHighPriority = ['mercedes-star', 'car-image', 'messages'].includes(name)
  
  return {
    priority: isHighPriority,
    unoptimized: true,
    style: {
      width: 'auto',
      height: 'auto',
      objectFit: 'contain' as const
    }
  }
} 