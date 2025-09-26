'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  StarIcon,
  ChatBubbleLeftRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid'

interface ReviewModalProps {
  isOpen: boolean
  onClose: () => void
  serviceId: string
  serviceTitle: string
  providerName: string
  onReviewSubmitted: () => void
}

export function ReviewModal({ 
  isOpen, 
  onClose, 
  serviceId, 
  serviceTitle, 
  providerName,
  onReviewSubmitted 
}: ReviewModalProps) {
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (rating === 0) {
      setError('Lütfen bir puan verin')
      return
    }

    if (!comment.trim()) {
      setError('Lütfen bir yorum yazın')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serviceId,
          rating,
          comment: comment.trim()
        })
      })

      if (response.ok) {
        onReviewSubmitted()
        onClose()
        setRating(0)
        setComment('')
      } else {
        const data = await response.json()
        setError(data.error || 'Değerlendirme gönderilirken bir hata oluştu')
      }
    } catch (error) {
      console.error('Review submission error:', error)
      setError('Sunucuya bağlanırken bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!submitting) {
      onClose()
      setRating(0)
      setComment('')
      setError('')
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl shadow-xl max-w-md w-full"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Değerlendirme Yap
                </h2>
                <button
                  onClick={handleClose}
                  disabled={submitting}
                  className="text-gray-400 hover:text-gray-600 disabled:opacity-50"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-1">{serviceTitle}</h3>
                <p className="text-sm text-gray-600">Hizmet sağlayıcı: {providerName}</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Puanınız *
                  </label>
                  <div className="flex items-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        disabled={submitting}
                        className="focus:outline-none disabled:opacity-50"
                      >
                        {star <= rating ? (
                          <StarSolidIcon className="h-8 w-8 text-yellow-400" />
                        ) : (
                          <StarIcon className="h-8 w-8 text-gray-300 hover:text-yellow-400" />
                        )}
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {rating === 0 && 'Puan seçin'}
                    {rating === 1 && 'Çok kötü'}
                    {rating === 2 && 'Kötü'}
                    {rating === 3 && 'Orta'}
                    {rating === 4 && 'İyi'}
                    {rating === 5 && 'Mükemmel'}
                  </p>
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Yorumunuz *
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    disabled={submitting}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                    placeholder="Hizmet hakkında deneyimlerinizi paylaşın..."
                    required
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="flex items-center text-red-600 text-sm">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-2" />
                    {error}
                  </div>
                )}

                {/* Actions */}
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={submitting}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting || rating === 0 || !comment.trim()}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                  >
                    {submitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Gönderiliyor...
                      </>
                    ) : (
                      <>
                        <ChatBubbleLeftRightIcon className="h-4 w-4 mr-2" />
                        Değerlendirme Gönder
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}


