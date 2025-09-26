import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Development modunda tüm authentication'ı bypass et
  if (process.env.NODE_ENV === 'development') {
    return NextResponse.next()
  }

  // Production'da basit session kontrolü
  const sessionToken = request.cookies.get('session-token')
  
  // Güvenli path'ler
  const securePaths = ['/dashboard', '/profile', '/admin']
  const isSecure = securePaths.some(path => pathname.startsWith(path))
  
  if (isSecure && !sessionToken) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    } else {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}