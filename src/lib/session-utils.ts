// Session utilities for development mode
import { useSession } from 'next-auth/react'

export function useMockSession() {
  // Für lokale Entwicklung: Mock-Session verwenden
  if (process.env.NODE_ENV === 'development') {
    return {
      data: null,
      status: 'unauthenticated' as const,
      update: async () => null,
    }
  }
  
  // Für Production: echte Session verwenden
  return useSession()
}

// Hook für alle Components, die useSession verwenden
export function useSessionSafe() {
  try {
    return useMockSession()
  } catch (error) {
    // Fallback für Development
    if (process.env.NODE_ENV === 'development') {
      return {
        data: null,
        status: 'unauthenticated' as const,
        update: async () => null,
      }
    }
    throw error
  }
}
