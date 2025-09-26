type RouteCtx = { params?: { width?: string; height?: string } }

export async function GET(
  _request: Request,
  ctx: unknown
) {
  const p = await (ctx as RouteCtx)?.params ?? {}
  const width = Math.max(1, Math.min(2000, Number(p.width) || 300))
  const height = Math.max(1, Math.min(2000, Number(p.height) || 200))

  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
    <rect width='100%' height='100%' fill='#e5e7eb'/>
    <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' fill='#6b7280' font-size='16' font-family='Arial, Helvetica, sans-serif'>${width}×${height}</text>
  </svg>`

  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=86400'
    }
  })
}


