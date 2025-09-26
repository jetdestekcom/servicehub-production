// Kapsamlı hizmet kategorileri - Rakiplerden daha fazla
export const SERVICE_CATEGORIES = [
  // Ev Hizmetleri
  {
    id: 'home-cleaning',
    name: 'Ev Temizliği',
    icon: '🏠',
    subcategories: [
      'Genel Temizlik',
      'Derinlemesine Temizlik',
      'Ofis Temizliği',
      'Cam Temizliği',
      'Halı Yıkama',
      'Perde Temizliği',
      'Balkon Temizliği',
      'Garaj Temizliği'
    ]
  },
  {
    id: 'home-repair',
    name: 'Ev Tamiri',
    icon: '🔧',
    subcategories: [
      'Elektrik Tamiri',
      'Su Tesisatı',
      'Doğalgaz',
      'Klima Bakımı',
      'Asansör Tamiri',
      'Kapı Pencere',
      'Duvar Tamiri',
      'Çatı Tamiri'
    ]
  },
  {
    id: 'home-improvement',
    name: 'Ev Geliştirme',
    icon: '🏗️',
    subcategories: [
      'Boyama',
      'Duvar Kağıdı',
      'Zemin Döşeme',
      'Mutfak Renovasyonu',
      'Banyo Renovasyonu',
      'Balkon Düzenleme',
      'Bahçe Düzenleme',
      'Teras Düzenleme'
    ]
  },
  {
    id: 'appliance-repair',
    name: 'Beyaz Eşya Tamiri',
    icon: '🔌',
    subcategories: [
      'Buzdolabı',
      'Çamaşır Makinesi',
      'Bulaşık Makinesi',
      'Fırın',
      'Mikrodalga',
      'Klima',
      'Su Isıtıcısı',
      'Elektrikli Süpürge'
    ]
  },
  {
    id: 'furniture-assembly',
    name: 'Mobilya Montajı',
    icon: '🪑',
    subcategories: [
      'Yatak Montajı',
      'Dolap Montajı',
      'Masa Montajı',
      'Sandalye Montajı',
      'Kitaplık Montajı',
      'TV Ünitesi',
      'Mutfak Dolabı',
      'Banyo Dolabı'
    ]
  },
  {
    id: 'moving',
    name: 'Nakliyat',
    icon: '🚚',
    subcategories: [
      'Ev Taşıma',
      'Ofis Taşıma',
      'Eşya Taşıma',
      'Depolama',
      'Ambalajlama',
      'Kurulum',
      'Temizlik',
      'Sigorta'
    ]
  },

  // Güzellik ve Bakım
  {
    id: 'beauty',
    name: 'Güzellik',
    icon: '💄',
    subcategories: [
      'Saç Kesimi',
      'Saç Boyama',
      'Makyaj',
      'Kaş Dizaynı',
      'Kirpik Uygulaması',
      'Cilt Bakımı',
      'Manikür',
      'Pedikür'
    ]
  },
  {
    id: 'wellness',
    name: 'Sağlık ve Wellness',
    icon: '💆',
    subcategories: [
      'Masaj',
      'Fizyoterapi',
      'Pilates',
      'Yoga',
      'Kişisel Antrenör',
      'Beslenme Danışmanı',
      'Psikolog',
      'Diyetisyen'
    ]
  },

  // Teknoloji
  {
    id: 'tech-support',
    name: 'Teknik Destek',
    icon: '💻',
    subcategories: [
      'Bilgisayar Tamiri',
      'Telefon Tamiri',
      'Tablet Tamiri',
      'Yazılım Kurulumu',
      'Ağ Kurulumu',
      'Güvenlik Kamerası',
      'Akıllı Ev Sistemleri',
      'Veri Kurtarma'
    ]
  },
  {
    id: 'it-services',
    name: 'IT Hizmetleri',
    icon: '🖥️',
    subcategories: [
      'Web Tasarım',
      'Yazılım Geliştirme',
      'SEO Hizmetleri',
      'Sosyal Medya Yönetimi',
      'Dijital Pazarlama',
      'E-ticaret',
      'Mobil Uygulama',
      'Sistem Yönetimi'
    ]
  },

  // Eğitim
  {
    id: 'education',
    name: 'Eğitim',
    icon: '📚',
    subcategories: [
      'Matematik',
      'Fizik',
      'Kimya',
      'Biyoloji',
      'Tarih',
      'Coğrafya',
      'Türkçe',
      'İngilizce',
      'Almanca',
      'Fransızca',
      'Müzik',
      'Resim',
      'Satranç',
      'Kodlama'
    ]
  },
  {
    id: 'professional-training',
    name: 'Mesleki Eğitim',
    icon: '🎓',
    subcategories: [
      'Excel Eğitimi',
      'PowerPoint Eğitimi',
      'Word Eğitimi',
      'Photoshop Eğitimi',
      'Muhasebe Eğitimi',
      'İnsan Kaynakları',
      'Satış Teknikleri',
      'Liderlik Eğitimi'
    ]
  },

  // Otomotiv
  {
    id: 'automotive',
    name: 'Otomotiv',
    icon: '🚗',
    subcategories: [
      'Araç Yıkama',
      'Araç Tamiri',
      'Lastik Değişimi',
      'Akü Değişimi',
      'Fren Tamiri',
      'Motor Bakımı',
      'Klima Bakımı',
      'Araç Detayı'
    ]
  },

  // Pet Hizmetleri
  {
    id: 'pet-services',
    name: 'Pet Hizmetleri',
    icon: '🐕',
    subcategories: [
      'Pet Bakımı',
      'Pet Yıkama',
      'Pet Grooming',
      'Pet Eğitimi',
      'Pet Veteriner',
      'Pet Oteli',
      'Pet Gezdirme',
      'Pet Beslenme'
    ]
  },

  // Etkinlik ve Organizasyon
  {
    id: 'events',
    name: 'Etkinlik ve Organizasyon',
    icon: '🎉',
    subcategories: [
      'Düğün Organizasyonu',
      'Doğum Günü',
      'Kurumsal Etkinlik',
      'Konferans',
      'Seminer',
      'Parti Organizasyonu',
      'Catering',
      'Fotoğrafçılık'
    ]
  },

  // Güvenlik
  {
    id: 'security',
    name: 'Güvenlik',
    icon: '🔒',
    subcategories: [
      'Güvenlik Kamerası',
      'Alarm Sistemi',
      'Güvenlik Görevlisi',
      'Kasa Açma',
      'Kilit Değişimi',
      'Güvenlik Danışmanlığı',
      'Siber Güvenlik',
      'Fiziksel Güvenlik'
    ]
  },

  // Çevre ve Bahçıvanlık
  {
    id: 'gardening',
    name: 'Bahçıvanlık',
    icon: '🌱',
    subcategories: [
      'Bahçe Bakımı',
      'Çiçek Dikimi',
      'Ağaç Budama',
      'Çim Biçme',
      'Bahçe Sulama',
      'Toprak Hazırlama',
      'Bahçe Tasarımı',
      'Peyzaj'
    ]
  },

  // Hukuki Hizmetler
  {
    id: 'legal',
    name: 'Hukuki Hizmetler',
    icon: '⚖️',
    subcategories: [
      'Hukuki Danışmanlık',
      'Sözleşme Hazırlama',
      'Dava Takibi',
      'Noter Hizmetleri',
      'Tapu İşlemleri',
      'Vergi Danışmanlığı',
      'İcra Takibi',
      'Aile Hukuku'
    ]
  },

  // Finansal Hizmetler
  {
    id: 'financial',
    name: 'Finansal Hizmetler',
    icon: '💰',
    subcategories: [
      'Muhasebe Hizmetleri',
      'Vergi Danışmanlığı',
      'Kredi Danışmanlığı',
      'Yatırım Danışmanlığı',
      'Sigorta Danışmanlığı',
      'Emeklilik Planlaması',
      'Bütçe Planlaması',
      'Finansal Analiz'
    ]
  },

  // Medya ve İletişim
  {
    id: 'media',
    name: 'Medya ve İletişim',
    icon: '📺',
    subcategories: [
      'Video Çekimi',
      'Fotoğrafçılık',
      'Grafik Tasarım',
      'İçerik Üretimi',
      'Sosyal Medya',
      'PR Hizmetleri',
      'Reklam Tasarımı',
      'Web Tasarımı'
    ]
  },

  // Spor ve Fitness
  {
    id: 'sports',
    name: 'Spor ve Fitness',
    icon: '🏃',
    subcategories: [
      'Kişisel Antrenör',
      'Fitness Eğitmeni',
      'Yoga Eğitmeni',
      'Pilates Eğitmeni',
      'Yüzme Eğitmeni',
      'Futbol Eğitmeni',
      'Basketbol Eğitmeni',
      'Tenis Eğitmeni'
    ]
  },

  // Sanat ve El Sanatları
  {
    id: 'arts-crafts',
    name: 'Sanat ve El Sanatları',
    icon: '🎨',
    subcategories: [
      'Resim Dersleri',
      'Müzik Dersleri',
      'Dans Dersleri',
      'El Sanatları',
      'Seramik',
      'Ahşap İşçiliği',
      'Dikiş',
      'Örgü'
    ]
  },

  // Diğer
  {
    id: 'other',
    name: 'Diğer',
    icon: '🔧',
    subcategories: [
      'Genel Hizmetler',
      'Özel İstekler',
      'Danışmanlık',
      'Araştırma',
      'Çeviri',
      'Yazılım',
      'Tasarım',
      'Pazarlama'
    ]
  }
]

export const getCategoryById = (id: string) => {
  return SERVICE_CATEGORIES.find(category => category.id === id)
}

export const getSubcategories = (categoryId: string) => {
  const category = getCategoryById(categoryId)
  return category?.subcategories || []
}

export const getAllSubcategories = () => {
  return SERVICE_CATEGORIES.flatMap(category => 
    category.subcategories.map(sub => ({
      id: `${category.id}-${sub.toLowerCase().replace(/\s+/g, '-')}`,
      name: sub,
      categoryId: category.id,
      categoryName: category.name,
      icon: category.icon
    }))
  )
}

