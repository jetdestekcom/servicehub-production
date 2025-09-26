import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Eğitim sistemi
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'courses', 'lessons', 'enrollments'
    const category = searchParams.get('category')
    const difficulty = searchParams.get('difficulty')

    if (type === 'courses') {
      const courses = await prisma.trainingCourse.findMany({
        where: {
          isActive: true,
          ...(category && { category }),
          ...(difficulty && { difficulty })
        },
        include: {
          _count: {
            select: { 
              lessons: true,
              enrollments: true 
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ success: true, data: courses })
    }

    if (type === 'lessons') {
      const courseId = searchParams.get('courseId')
      
      const lessons = await prisma.trainingLesson.findMany({
        where: {
          courseId: courseId!,
          isActive: true
        },
        orderBy: { order: 'asc' }
      })

      return NextResponse.json({ success: true, data: lessons })
    }

    if (type === 'enrollments') {
      const userId = searchParams.get('userId')
      
      const enrollments = await prisma.userTrainingEnrollment.findMany({
        where: {
          userId: userId!
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              description: true,
              category: true,
              difficulty: true,
              duration: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ success: true, data: enrollments })
    }

    return NextResponse.json({ success: false, error: 'Geçersiz tip' }, { status: 400 })
  } catch (error) {
    console.error('Eğitim sistemi hatası:', error)
    return NextResponse.json({ error: 'Eğitim verileri yüklenemedi' }, { status: 500 })
  }
}

// Yeni kurs oluştur
export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    if (type === 'course') {
      const { title, description, category, duration, difficulty } = data
      
      const course = await prisma.trainingCourse.create({
        data: {
          title,
          description,
          category,
          duration,
          difficulty
        }
      })

      return NextResponse.json({ success: true, data: course })
    }

    if (type === 'lesson') {
      const { title, content, videoUrl, duration, order, courseId } = data
      
      const lesson = await prisma.trainingLesson.create({
        data: {
          title,
          content,
          videoUrl,
          duration,
          order,
          courseId
        }
      })

      return NextResponse.json({ success: true, data: lesson })
    }

    if (type === 'enrollment') {
      const { userId, courseId } = data
      
      const enrollment = await prisma.userTrainingEnrollment.create({
        data: {
          userId,
          courseId,
          status: 'ENROLLED'
        }
      })

      return NextResponse.json({ success: true, data: enrollment })
    }

    return NextResponse.json({ success: false, error: 'Geçersiz tip' }, { status: 400 })
  } catch (error) {
    console.error('Eğitim oluşturma hatası:', error)
    return NextResponse.json({ error: 'Eğitim içeriği oluşturulamadı' }, { status: 500 })
  }
}

