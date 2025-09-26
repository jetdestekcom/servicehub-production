import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Finansman seçenekleri - Angi, HomeAdvisor özellikleri
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const minAmount = searchParams.get('minAmount')
    const maxAmount = searchParams.get('maxAmount')

    const where: any = { isActive: true }
    
    if (type) where.type = type
    if (minAmount) where.minAmount = { gte: parseFloat(minAmount) }
    if (maxAmount) where.maxAmount = { lte: parseFloat(maxAmount) }

    const options = await prisma.financingOption.findMany({
      where,
      orderBy: { interestRate: 'asc' }
    })

    return NextResponse.json({ success: true, data: options })
  } catch (error) {
    console.error('Finansman seçenekleri hatası:', error)
    return NextResponse.json({ error: 'Finansman seçenekleri yüklenemedi' }, { status: 500 })
  }
}

// Yeni finansman seçeneği oluştur
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      type,
      minAmount,
      maxAmount,
      interestRate,
      term
    } = await request.json()

    const option = await prisma.financingOption.create({
      data: {
        name,
        description,
        type,
        minAmount,
        maxAmount,
        interestRate,
        term
      }
    })

    return NextResponse.json({ success: true, data: option })
  } catch (error) {
    console.error('Finansman seçeneği oluşturma hatası:', error)
    return NextResponse.json({ error: 'Finansman seçeneği oluşturulamadı' }, { status: 500 })
  }
}

