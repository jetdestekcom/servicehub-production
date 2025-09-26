'use client'

import { SessionProvider } from 'next-auth/react'

export function Providers({ children }: { children: React.ReactNode }) {
  // Für lokale Entwicklung: SessionProvider deaktivieren
  if (process.env.NODE_ENV === 'development') {
    return <>{children}</>
  }
  
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  )
}


