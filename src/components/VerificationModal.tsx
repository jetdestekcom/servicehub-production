'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon,
  DocumentTextIcon,
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  BriefcaseIcon
} from '@heroicons/react/24/outline'

interface VerificationModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const verificationTypes = [
  {
    id: 'IDENTITY',
    name: 'Kimlik Doğrulama',
    description: 'Kimlik belgesi ile doğrulama',
    icon: DocumentTextIcon,
    fields: [
      { name: 'fullName', label: 'Ad Soyad', type: 'text', required: true },
      { name: 'idNumber', label: 'TC Kimlik No', type: 'text', required: true },
      { name: 'birthDate', label: 'Doğum Tarihi', type: 'date', required: true },
      { name: 'idDocument', label: 'Kimlik Belgesi', type: 'file', required: true }
    ]
  },
  {
    id: 'PHONE',
    name: 'Telefon Doğrulama',
    description: 'Telefon numarası ile doğrulama',
    icon: PhoneIcon,
    fields: [
      { name: 'phoneNumber', label: 'Telefon Numarası', type: 'tel', required: true }
    ]
  },
  {
    id: 'EMAIL',
    name: 'E-posta Doğrulama',
    description: 'E-posta adresi ile doğrulama',
    icon: EnvelopeIcon,
    fields: [
      { name: 'email', label: 'E-posta Adresi', type: 'email', required: true }
    ]
  },
  {
    id: 'ADDRESS',
    name: 'Adres Doğrulama',
    description: 'Adres bilgisi ile doğrulama',
    icon: MapPinIcon,
    fields: [
      { name: 'address', label: 'Adres', type: 'text', required: true },
      { name: 'city', label: 'Şehir', type: 'text', required: true },
      { name: 'district', label: 'İlçe', type: 'text', required: true },
      { name: 'postalCode', label: 'Posta Kodu', type: 'text', required: false }
    ]
  },
  {
    id: 'PROFESSIONAL',
    name: 'Mesleki Doğrulama',
    description: 'Mesleki belgeler ile doğrulama',
    icon: BriefcaseIcon,
    fields: [
      { name: 'profession', label: 'Meslek', type: 'text', required: true },
      { name: 'licenseNumber', label: 'Lisans No', type: 'text', required: false },
      { name: 'certificate', label: 'Sertifika', type: 'file', required: false },
      { name: 'experience', label: 'Deneyim (Yıl)', type: 'number', required: true }
    ]
  }
]

export default function VerificationModal({ isOpen, onClose, onSuccess }: VerificationModalProps) {
  const [selectedType, setSelectedType] = useState('')
  const [formData, setFormData] = useState<Record<string, string | number | File>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const selectedVerificationType = verificationTypes.find(type => type.id === selectedType)

  const handleInputChange = (fieldName: string, value: string | number | File) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: selectedType,
          data: formData
        })
      })

      const result = await response.json()

      if (result.success) {
        onSuccess()
        onClose()
        setFormData({})
        setSelectedType('')
      } else {
        setError(result.error || 'Doğrulama başlatılamadı')
      }
    } catch {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setFormData({})
    setSelectedType('')
    setError('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Kimlik Doğrulama</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {!selectedType ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Hesabınızı doğrulamak için aşağıdaki seçeneklerden birini seçin:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {verificationTypes.map((type) => {
                  const Icon = type.icon
                  return (
                    <button
                      key={type.id}
                      onClick={() => setSelectedType(type.id)}
                      className="p-4 border rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left"
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="h-6 w-6 text-blue-600 mt-1" />
                        <div>
                          <h3 className="font-medium text-gray-900">{type.name}</h3>
                          <p className="text-sm text-gray-600">{type.description}</p>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <button
                  type="button"
                  onClick={() => setSelectedType('')}
                  className="text-blue-600 hover:text-blue-800"
                >
                  ← Geri
                </button>
                <h3 className="text-lg font-medium">{selectedVerificationType?.name}</h3>
              </div>

              {selectedVerificationType?.fields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name}>
                    {field.label}
                    {field.required && <span className="text-red-500 ml-1">*</span>}
                  </Label>
                  
                  {field.type === 'file' ? (
                    <Input
                      id={field.name}
                      type="file"
                      onChange={(e) => handleInputChange(field.name, e.target.files?.[0])}
                      required={field.required}
                      className="w-full"
                    />
                  ) : field.type === 'textarea' ? (
                    <Textarea
                      id={field.name}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full"
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={formData[field.name] || ''}
                      onChange={(e) => handleInputChange(field.name, e.target.value)}
                      required={field.required}
                      className="w-full"
                    />
                  )}
                </div>
              ))}

              {error && (
                <div className="flex items-center space-x-2 text-red-600 bg-red-50 p-3 rounded-lg">
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                >
                  İptal
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? 'Gönderiliyor...' : 'Doğrulama Başlat'}
                </Button>
              </div>
            </form>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
