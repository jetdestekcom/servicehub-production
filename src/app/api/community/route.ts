import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Topluluk forumları
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const type = searchParams.get('type') // 'forums', 'posts', 'replies'

    if (type === 'forums') {
      const forums = await prisma.communityForum.findMany({
        where: {
          isActive: true,
          ...(category && { category })
        },
        include: {
          _count: {
            select: { posts: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })

      return NextResponse.json({ success: true, data: forums })
    }

    if (type === 'posts') {
      const forumId = searchParams.get('forumId')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')

      const posts = await prisma.communityPost.findMany({
        where: {
          ...(forumId && { forumId }),
          ...(category && { category })
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          },
          forum: {
            select: {
              id: true,
              title: true
            }
          },
          _count: {
            select: { 
              replies: true,
              likes: true 
            }
          }
        },
        orderBy: [
          { isPinned: 'desc' },
          { createdAt: 'desc' }
        ],
        skip: (page - 1) * limit,
        take: limit
      })

      return NextResponse.json({ success: true, data: posts })
    }

    if (type === 'replies') {
      const postId = searchParams.get('postId')
      const page = parseInt(searchParams.get('page') || '1')
      const limit = parseInt(searchParams.get('limit') || '20')

      const replies = await prisma.communityReply.findMany({
        where: {
          postId: postId!
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
              image: true
            }
          }
        },
        orderBy: { createdAt: 'asc' },
        skip: (page - 1) * limit,
        take: limit
      })

      return NextResponse.json({ success: true, data: replies })
    }

    return NextResponse.json({ success: false, error: 'Geçersiz tip' }, { status: 400 })
  } catch (error) {
    console.error('Topluluk hatası:', error)
    return NextResponse.json({ error: 'Topluluk verileri yüklenemedi' }, { status: 500 })
  }
}

// Yeni forum oluştur
export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json()

    if (type === 'forum') {
      const { title, description, category } = data
      
      const forum = await prisma.communityForum.create({
        data: { title, description, category }
      })

      return NextResponse.json({ success: true, data: forum })
    }

    if (type === 'post') {
      const { title, content, category, tags, forumId, authorId } = data
      
      const post = await prisma.communityPost.create({
        data: {
          title,
          content,
          category,
          tags: tags ? tags.join(',') : null,
          forumId,
          authorId
        }
      })

      return NextResponse.json({ success: true, data: post })
    }

    if (type === 'reply') {
      const { content, postId, authorId } = data
      
      const reply = await prisma.communityReply.create({
        data: { content, postId, authorId }
      })

      return NextResponse.json({ success: true, data: reply })
    }

    return NextResponse.json({ success: false, error: 'Geçersiz tip' }, { status: 400 })
  } catch (error) {
    console.error('Topluluk oluşturma hatası:', error)
    return NextResponse.json({ error: 'Topluluk içeriği oluşturulamadı' }, { status: 500 })
  }
}

