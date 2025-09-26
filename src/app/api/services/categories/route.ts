import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Kategori listesi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const includeChildren = searchParams.get('includeChildren') === 'true'

    const categories = await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
        parentId: parentId || null
      },
      include: includeChildren ? {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      } : undefined,
      orderBy: { sortOrder: 'asc' }
    })

    return NextResponse.json({ success: true, data: categories })
  } catch (error) {
    console.error('Kategori listesi hatası:', error)
    return NextResponse.json({ error: 'Kategoriler yüklenemedi' }, { status: 500 })
  }
}

// Yeni kategori oluştur
export async function POST(request: NextRequest) {
  try {
    const {
      name,
      description,
      icon,
      parentId,
      sortOrder = 0
    } = await request.json()

    const category = await prisma.serviceCategory.create({
      data: {
        name,
        description,
        icon,
        parentId,
        sortOrder
      }
    })

    return NextResponse.json({ success: true, data: category })
  } catch (error) {
    console.error('Kategori oluşturma hatası:', error)
    return NextResponse.json({ error: 'Kategori oluşturulamadı' }, { status: 500 })
  }
}

