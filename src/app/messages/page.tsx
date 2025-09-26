'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  PaperAirplaneIcon,
  PhoneIcon,
  VideoCameraIcon,
  EllipsisVerticalIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
  CheckIcon,
  ClockIcon
} from '@heroicons/react/24/outline'
import { CheckIcon as CheckSolidIcon } from '@heroicons/react/24/solid'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: string
  isRead: boolean
  type: 'text' | 'image' | 'file'
  sender: {
    id: string
    name: string
    image?: string
  }
  receiver: {
    id: string
    name: string
    image?: string
  }
}

interface Conversation {
  id: string
  participant: {
    id: string
    name: string
    image?: string
    isOnline: boolean
  }
  lastMessage?: {
    content: string
    createdAt: string
    isRead: boolean
  }
  unreadCount: number
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Handle URL parameters for direct messaging
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const providerId = urlParams.get('provider')
    const serviceId = urlParams.get('service')
    
    if (providerId && serviceId) {
      // Create a new conversation with the provider
      const newConversation: Conversation = {
        id: `conv_${providerId}_${serviceId}`,
        participant: {
          id: providerId,
          name: 'Provider', // This would be fetched from API
          image: '/api/placeholder/50/50',
          isOnline: true
        },
        unreadCount: 0
      }
      setSelectedConversation(newConversation)
      
      // Clear URL parameters
      router.replace('/messages')
    }
  }, [router])

  // Check authentication on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Try to fetch conversations - if it fails with 401, user is not authenticated
        const response = await fetch('/api/messages/conversations', {
          method: 'GET',
          credentials: 'include'
        })
        
        if (response.ok) {
          const conversations = await response.json()
          setConversations(conversations)
          setLoading(false)
          // Set a dummy user for now - in real app, get from JWT token
          setUser({ id: 'current-user' })
        } else if (response.status === 401) {
          router.push('/auth/signin')
        } else {
          console.error('Failed to fetch conversations:', response.status)
          setLoading(false)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/signin')
      }
    }

    checkAuth()
  }, [router])

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.id)
    }
  }, [selectedConversation])

  useEffect(() => {
    scrollToBottom()
  }, [messages])


  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await fetch(`/api/messages/${conversationId}`)
      if (response.ok) {
        const data = await response.json()
        setMessages(data)
      }
    } catch (error) {
      console.error('Mesajlar yüklenirken hata:', error)
    }
  }

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !selectedConversation || sending) return

    setSending(true)
    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          receiverId: selectedConversation.participant.id,
          content: newMessage.trim(),
          type: 'text'
        })
      })

      if (response.ok) {
        const message = await response.json()
        setMessages(prev => [...prev, message])
        setNewMessage('')
        // Conversation list will be updated automatically
      }
    } catch (error) {
      console.error('Mesaj gönderilirken hata:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const filteredConversations = conversations.filter(conv =>
    conv.participant.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="text-2xl font-bold text-gray-900">Mesajlar</h1>
            <button
              onClick={() => router.back()}
              className="text-gray-500 hover:text-gray-700"
            >
              ← Geri
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <div className="lg:col-span-1 bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Konuşma ara..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-80px)]">
              {filteredConversations.length === 0 ? (
                <div className="p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-600">Henüz konuşma yok</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredConversations.map((conversation) => (
                    <div
                      key={conversation.id}
                      onClick={() => setSelectedConversation(conversation)}
                      className={`p-4 hover:bg-gray-50 cursor-pointer ${
                        selectedConversation?.id === conversation.id ? 'bg-blue-50 border-r-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={conversation.participant.image || '/placeholder-avatar.png'}
                            alt={conversation.participant.name}
                            className="h-12 w-12 rounded-full object-cover"
                          />
                          {conversation.participant.isOnline && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {conversation.participant.name}
                            </p>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          {conversation.lastMessage && (
                            <p className="text-sm text-gray-500 truncate">
                              {conversation.lastMessage.content}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-sm flex flex-col">
            {selectedConversation ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <img
                        src={selectedConversation.participant.image || '/placeholder-avatar.png'}
                        alt={selectedConversation.participant.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedConversation.participant.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {selectedConversation.participant.isOnline ? 'Çevrimiçi' : 'Çevrimdışı'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <PhoneIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <VideoCameraIcon className="h-5 w-5" />
                      </button>
                      <button className="p-2 text-gray-500 hover:text-gray-700">
                        <EllipsisVerticalIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">Henüz mesaj yok</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === user?.id ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                            message.senderId === user?.id
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-900'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <div className="flex items-center justify-end mt-1">
                            <span className="text-xs opacity-70">
                              {new Date(message.createdAt).toLocaleTimeString('tr-TR', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            {message.senderId === user?.id && (
                              <div className="ml-1">
                                {message.isRead ? (
                                  <CheckSolidIcon className="h-3 w-3 text-blue-300" />
                                ) : (
                                  <CheckIcon className="h-3 w-3 text-blue-300" />
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={sendMessage} className="flex items-center space-x-2">
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <PaperClipIcon className="h-5 w-5" />
                    </button>
                    <div className="flex-1 relative">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Mesajınızı yazın..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        disabled={sending}
                      />
                    </div>
                    <button
                      type="button"
                      className="p-2 text-gray-500 hover:text-gray-700"
                    >
                      <FaceSmileIcon className="h-5 w-5" />
                    </button>
                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {sending ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <PaperAirplaneIcon className="h-5 w-5" />
                      )}
                    </button>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-gray-400 mb-4">
                    <svg className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Bir konuşma seçin
                  </h3>
                  <p className="text-gray-600">
                    Mesajlaşmaya başlamak için sol taraftan bir konuşma seçin
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

