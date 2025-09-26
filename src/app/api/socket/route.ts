import { NextRequest } from 'next/server'
import { Server as NetServer } from 'http'
import { Server as SocketIOServer } from 'socket.io'
import { Socket as NetSocket } from 'net'

interface SocketServer extends NetServer {
  io?: SocketIOServer | undefined
}

// interface SocketWithIO extends NetSocket {
//   server: SocketServer
// }

export async function GET(req: NextRequest) {
  if (req.method !== 'GET') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Security: Don't expose server information
  return new Response('Service unavailable', { status: 503 })
}

