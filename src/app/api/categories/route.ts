import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { SERVICE_CATEGORIES } from '@/lib/service-categories'

// Kategori listesi - Rakiplerden daha kapsamlı
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parentId = searchParams.get('parentId')
    const includeSubcategories = searchParams.get('includeSubcategories') === 'true'

    // Önce veritabanından kategorileri al
    const dbCategories = await prisma.serviceCategory.findMany({
      where: {
        isActive: true,
        parentId: parentId || null
      },
      include: includeSubcategories ? {
        children: {
          where: { isActive: true },
          orderBy: { sortOrder: 'asc' }
        }
      } : undefined,
      orderBy: { sortOrder: 'asc' }
    })

    // Eğer veritabanında kategori yoksa, varsayılan kategorileri kullan
    if (dbCategories.length === 0) {
      const categories = SERVICE_CATEGORIES.map(category => ({
        id: category.id,
        name: category.name,
        description: `${category.name} hizmetleri`,
        icon: category.icon,
        subcategories: includeSubcategories ? category.subcategories.map(sub => ({
          id: `${category.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
          name: sub,
          categoryId: category.id,
          categoryName: category.name,
          icon: category.icon
        })) : undefined,
        isActive: true,
        sortOrder: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      return NextResponse.json({ success: true, data: categories })
    }

    return NextResponse.json({ success: true, data: dbCategories })
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

