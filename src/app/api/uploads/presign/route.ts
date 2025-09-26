import { NextResponse } from 'next/server'
import { env } from '@/lib/env'
import { rateLimit, ipKey } from '@/lib/rate-limit'

export async function POST(request: Request) {
  try {
    if (!rateLimit(ipKey(request.headers))) {
      return NextResponse.json({ success: false, error: 'rate_limited' }, { status: 429 })
    }

    if (!env.features.s3Configured) {
      return NextResponse.json({ success: false, error: 'uploads_unconfigured' }, { status: 503 })
    }

    const { filename, contentType } = await request.json()
    if (!filename || !contentType) {
      return NextResponse.json({ success: false, error: 'invalid_payload' }, { status: 400 })
    }

    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3')
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner')

    const s3 = new S3Client({ region: env.AWS_REGION })
    const key = `uploads/${Date.now()}-${filename}`
    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType
    })

    const url = await getSignedUrl(s3, command, { expiresIn: 60 })
    return NextResponse.json({ success: true, data: { url, key, bucket: env.AWS_S3_BUCKET } })
  } catch (error) {
    console.error('presign error', error)
    return NextResponse.json({ success: false, error: 'internal_error' }, { status: 500 })
  }
}




