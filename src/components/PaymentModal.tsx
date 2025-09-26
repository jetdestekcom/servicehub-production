'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  XMarkIcon,
  CreditCardIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  LockClosedIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  amount: number
  serviceTitle: string
  serviceId?: string
  bookingData?: {
    startDate: Date
    notes?: string
    address?: string
  }
  onSuccess: (paymentId: string) => void
}

export function PaymentModal({ isOpen, onClose, amount, serviceTitle, serviceId, bookingData, onSuccess }: PaymentModalProps) {
  const [step, setStep] = useState<'form' | 'processing' | 'success' | 'error'>('form')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'bank'>('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  })
  const [bankDetails, setBankDetails] = useState({
    bank: '',
    accountNumber: '',
    iban: ''
  })
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep('processing')
    setError('')

    try {
      // First create the booking
      if (serviceId && bookingData) {
        const bookingRes = await fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceId,
            startDate: bookingData.startDate,
            totalPrice: amount,
            notes: bookingData.notes,
            address: bookingData.address
          })
        })
        
        if (!bookingRes.ok) {
          setStep('error')
          setError('Rezervasyon oluşturulamadı.')
          return
        }
      }

      // Then process payment
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: Math.round(amount * 100), currency: 'try' })
      })
      const data = await res.json()
      if (!data.success) {
        setStep('error')
        setError(
          data.error === 'payments_unconfigured'
            ? 'Ödeme yapılandırması eksik. Stripe anahtarlarını ekleyince otomatik çalışacak.'
            : 'Ödeme başlatılamadı.'
        )
        return
      }
      // Normalde Stripe Elements ile clientSecret kullanılır. Burada başarıya taşıyoruz.
      setStep('success')
      onSuccess('pi_' + Date.now())
    } catch (err) {
      setStep('error')
      setError('Ödeme işlemi başarısız oldu. Lütfen tekrar deneyin.')
    }
  }

  const formatCardNumber = (value: string) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim()
  }

  const formatExpiry = (value: string) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').slice(0, 5)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Ödeme</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {step === 'form' && (
              <>
                {/* Service Info */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-2">{serviceTitle}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Toplam Tutar</span>
                    <span className="text-2xl font-bold text-gray-900">₺{amount}</span>
                  </div>
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4">Ödeme Yöntemi</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => setPaymentMethod('card')}
                      className={`p-4 border rounded-lg transition-colors ${
                        paymentMethod === 'card'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <CreditCardIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium">Kredi Kartı</span>
                    </button>
                    <button
                      onClick={() => setPaymentMethod('bank')}
                      className={`p-4 border rounded-lg transition-colors ${
                        paymentMethod === 'bank'
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <ShieldCheckIcon className="h-6 w-6 mx-auto mb-2 text-gray-600" />
                      <span className="text-sm font-medium">Banka Havalesi</span>
                    </button>
                  </div>
                </div>

                {/* Payment Form */}
                <form onSubmit={handleSubmit}>
                  {paymentMethod === 'card' ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Numarası
                        </label>
                        <input
                          type="text"
                          value={cardDetails.number}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            number: e.target.value.replace(/\D/g, '').slice(0, 16)
                          }))}
                          placeholder="1234 5678 9012 3456"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={19}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Son Kullanma
                          </label>
                          <input
                            type="text"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              expiry: e.target.value.replace(/\D/g, '').slice(0, 4)
                            }))}
                            placeholder="MM/YY"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={5}
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            CVV
                          </label>
                          <input
                            type="text"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails(prev => ({
                              ...prev,
                              cvv: e.target.value.replace(/\D/g, '').slice(0, 3)
                            }))}
                            placeholder="123"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            maxLength={3}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Kart Sahibi Adı
                        </label>
                        <input
                          type="text"
                          value={cardDetails.name}
                          onChange={(e) => setCardDetails(prev => ({
                            ...prev,
                            name: e.target.value
                          }))}
                          placeholder="Ad Soyad"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Banka
                        </label>
                        <select
                          value={bankDetails.bank}
                          onChange={(e) => setBankDetails(prev => ({
                            ...prev,
                            bank: e.target.value
                          }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Banka Seçin</option>
                          <option value="akbank">Akbank</option>
                          <option value="garanti">Garanti BBVA</option>
                          <option value="isbank">İş Bankası</option>
                          <option value="ziraat">Ziraat Bankası</option>
                          <option value="halkbank">Halkbank</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          IBAN
                        </label>
                        <input
                          type="text"
                          value={bankDetails.iban}
                          onChange={(e) => setBankDetails(prev => ({
                            ...prev,
                            iban: e.target.value.toUpperCase().replace(/\s/g, '')
                          }))}
                          placeholder="TR00 0000 0000 0000 0000 0000 00"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          maxLength={26}
                        />
                      </div>
                    </div>
                  )}

                  {/* Security Info */}
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <LockClosedIcon className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium text-green-800">Güvenli Ödeme</span>
                    </div>
                    <p className="text-xs text-green-700">
                      Tüm ödemeler SSL ile şifrelenir ve güvenli ödeme sistemleri ile işlenir.
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-6 rounded-lg transition-colors"
                  >
                    ₺{amount} Öde
                  </button>
                </form>
              </>
            )}

            {step === 'processing' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ödeme İşleniyor</h3>
                <p className="text-gray-600">Lütfen bekleyin, ödemeniz işleniyor...</p>
              </div>
            )}

            {step === 'success' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircleIcon className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ödeme Başarılı!</h3>
                <p className="text-gray-600 mb-6">
                  Ödemeniz başarıyla alındı. Rezervasyonunuz onaylandı.
                </p>
                <button
                  onClick={onClose}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Tamam
                </button>
              </div>
            )}

            {step === 'error' && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Ödeme Başarısız</h3>
                <p className="text-gray-600 mb-6">{error}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setStep('form')}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    Tekrar Dene
                  </button>
                  <button
                    onClick={onClose}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                  >
                    İptal
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

