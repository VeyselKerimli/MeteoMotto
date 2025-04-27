// Erişilebilirlik kontrol listesi
// WCAG AA uyumluluğu için kontrol edilmesi gereken öğeler

// 1. Algılanabilirlik (Perceivable)
// - Tüm görseller için alternatif metin (alt text) sağlanmalı
// - Renk kontrastı yeterli olmalı (AA için 4.5:1)
// - İçerik farklı ekran boyutlarında okunabilir olmalı
// - İçerik ekran okuyucular tarafından okunabilir olmalı

// 2. Çalıştırılabilirlik (Operable)
// - Tüm işlevler klavye ile kullanılabilir olmalı
// - Kullanıcılar içeriği okumak için yeterli zamana sahip olmalı
// - Nöbetlere neden olabilecek içerikten kaçınılmalı
// - Kullanıcıların gezinmesine ve içeriği bulmasına yardımcı olunmalı

// 3. Anlaşılabilirlik (Understandable)
// - Metin okunabilir ve anlaşılabilir olmalı
// - İçerik tahmin edilebilir şekilde görünmeli ve çalışmalı
// - Kullanıcıların hataları önlemesine ve düzeltmesine yardımcı olunmalı

// 4. Sağlamlık (Robust)
// - İçerik, gelecekteki teknolojilerle uyumlu olacak şekilde sağlam olmalı
// - HTML/CSS/JS standartlarına uygun olmalı

// Kontrol Listesi
const accessibilityChecklist = [
  {
    category: "Algılanabilirlik",
    items: [
      { id: "1.1", description: "Tüm görseller için alt metin", status: "Kontrol edilecek" },
      { id: "1.2", description: "Yeterli renk kontrastı (4.5:1)", status: "Kontrol edilecek" },
      { id: "1.3", description: "Responsive tasarım", status: "Kontrol edilecek" },
      { id: "1.4", description: "Ekran okuyucu uyumluluğu", status: "Kontrol edilecek" }
    ]
  },
  {
    category: "Çalıştırılabilirlik",
    items: [
      { id: "2.1", description: "Klavye erişilebilirliği", status: "Kontrol edilecek" },
      { id: "2.2", description: "Yeterli zaman", status: "Kontrol edilecek" },
      { id: "2.3", description: "Nöbet tetikleyici içerik yok", status: "Kontrol edilecek" },
      { id: "2.4", description: "Gezinme yardımcıları", status: "Kontrol edilecek" }
    ]
  },
  {
    category: "Anlaşılabilirlik",
    items: [
      { id: "3.1", description: "Okunabilir metin", status: "Kontrol edilecek" },
      { id: "3.2", description: "Tahmin edilebilir işlevsellik", status: "Kontrol edilecek" },
      { id: "3.3", description: "Hata önleme ve düzeltme", status: "Kontrol edilecek" }
    ]
  },
  {
    category: "Sağlamlık",
    items: [
      { id: "4.1", description: "HTML/CSS/JS standartlarına uygunluk", status: "Kontrol edilecek" },
      { id: "4.2", description: "Farklı tarayıcılarda test", status: "Kontrol edilecek" }
    ]
  }
];

// Cihaz Test Matrisi
const deviceTestMatrix = [
  {
    category: "Mobil Cihazlar",
    devices: [
      { name: "iPhone SE", resolution: "375x667", status: "Test edilecek" },
      { name: "iPhone 12/13", resolution: "390x844", status: "Test edilecek" },
      { name: "Samsung Galaxy S21", resolution: "360x800", status: "Test edilecek" }
    ]
  },
  {
    category: "Tabletler",
    devices: [
      { name: "iPad Mini", resolution: "768x1024", status: "Test edilecek" },
      { name: "iPad Pro", resolution: "1024x1366", status: "Test edilecek" },
      { name: "Samsung Galaxy Tab", resolution: "800x1280", status: "Test edilecek" }
    ]
  },
  {
    category: "Masaüstü",
    devices: [
      { name: "Laptop (HD)", resolution: "1366x768", status: "Test edilecek" },
      { name: "Laptop (FHD)", resolution: "1920x1080", status: "Test edilecek" },
      { name: "Geniş Ekran", resolution: "2560x1440", status: "Test edilecek" }
    ]
  }
];

// Özellik Test Listesi
const featureTestList = [
  {
    category: "Temel Özellikler",
    features: [
      { name: "Şehir Arama", status: "Test edilecek" },
      { name: "Geolocation", status: "Test edilecek" },
      { name: "Hava Durumu Gösterimi", status: "Test edilecek" },
      { name: "Gemini AI Önerileri", status: "Test edilecek" }
    ]
  },
  {
    category: "Harita Özellikleri",
    features: [
      { name: "Harita Görüntüleme", status: "Test edilecek" },
      { name: "İşaretçi Modu", status: "Test edilecek" },
      { name: "Isı Haritası Modu", status: "Test edilecek" }
    ]
  },
  {
    category: "Kullanıcı Yönetimi",
    features: [
      { name: "Kayıt Olma", status: "Test edilecek" },
      { name: "Giriş Yapma", status: "Test edilecek" },
      { name: "Kullanıcı Tercihleri", status: "Test edilecek" },
      { name: "Favori Şehirler", status: "Test edilecek" }
    ]
  },
  {
    category: "Ek Özellikler",
    features: [
      { name: "Hava Durumu Uyarıları", status: "Test edilecek" },
      { name: "Günlük Özet", status: "Test edilecek" },
      { name: "Karanlık/Aydınlık Mod", status: "Test edilecek" },
      { name: "Çevrimdışı Önbellek", status: "Test edilecek" },
      { name: "Dil Değiştirme", status: "Test edilecek" }
    ]
  }
];

// Bu dosya, test sürecinde kullanılacak kontrol listelerini içerir.
// Test sonuçları bu dosyaya kaydedilecektir.
