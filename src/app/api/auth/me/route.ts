import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'jetdestek-jwt-secret-key-2024-development-only-32-chars-minimum'

// JWT token'dan user ID'yi çıkar
function getUserIdFromToken(token: string): string | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any
    return decoded.userId || null
  } catch (error) {
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    // JWT token kontrolü
    const sessionToken = request.cookies.get('auth_token')
    
    if (!sessionToken) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const userId = getUserIdFromToken(sessionToken.value)
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Token'dan user bilgilerini çıkar
    const decoded = jwt.verify(sessionToken.value, JWT_SECRET) as any
    
    return NextResponse.json({
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    })

  } catch (error) {
    console.error('Auth check error:', error)
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
}
