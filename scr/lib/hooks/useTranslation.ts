import { useState, useEffect } from 'react';

// Dil çevirisi için arayüz
export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}

// Desteklenen diller
export type Language = 'tr' | 'en';

// Varsayılan çeviriler
const defaultTranslations: Translations = {
  common: {
    appName: {
      tr: 'MeteoMotto',
      en: 'MeteoMotto'
    },
    search: {
      tr: 'Şehir ara...',
      en: 'Search city...'
    },
    currentLocation: {
      tr: 'Mevcut Konum',
      en: 'Current Location'
    },
    loading: {
      tr: 'Yükleniyor...',
      en: 'Loading...'
    },
    error: {
      tr: 'Hata oluştu',
      en: 'An error occurred'
    },
    retry: {
      tr: 'Tekrar Dene',
      en: 'Retry'
    }
  },
  weather: {
    temperature: {
      tr: 'Sıcaklık',
      en: 'Temperature'
    },
    feelsLike: {
      tr: 'Hissedilen',
      en: 'Feels Like'
    },
    humidity: {
      tr: 'Nem',
      en: 'Humidity'
    },
    wind: {
      tr: 'Rüzgar',
      en: 'Wind'
    },
    pressure: {
      tr: 'Basınç',
      en: 'Pressure'
    },
    sunrise: {
      tr: 'Gün Doğumu',
      en: 'Sunrise'
    },
    sunset: {
      tr: 'Gün Batımı',
      en: 'Sunset'
    },
    forecast: {
      tr: 'Tahmin',
      en: 'Forecast'
    },
    today: {
      tr: 'Bugün',
      en: 'Today'
    },
    tomorrow: {
      tr: 'Yarın',
      en: 'Tomorrow'
    }
  },
  ui: {
    home: {
      tr: 'Ana Sayfa',
      en: 'Home'
    },
    map: {
      tr: 'Harita',
      en: 'Map'
    },
    settings: {
      tr: 'Ayarlar',
      en: 'Settings'
    },
    profile: {
      tr: 'Profil',
      en: 'Profile'
    },
    darkMode: {
      tr: 'Karanlık Mod',
      en: 'Dark Mode'
    },
    lightMode: {
      tr: 'Aydınlık Mod',
      en: 'Light Mode'
    },
    language: {
      tr: 'Dil',
      en: 'Language'
    },
    units: {
      tr: 'Birimler',
      en: 'Units'
    },
    metric: {
      tr: 'Metrik (°C)',
      en: 'Metric (°C)'
    },
    imperial: {
      tr: 'İmparatorluk (°F)',
      en: 'Imperial (°F)'
    },
    notifications: {
      tr: 'Bildirimler',
      en: 'Notifications'
    },
    login: {
      tr: 'Giriş Yap',
      en: 'Login'
    },
    register: {
      tr: 'Kayıt Ol',
      en: 'Register'
    },
    logout: {
      tr: 'Çıkış Yap',
      en: 'Logout'
    }
  },
  gemini: {
    suggestion: {
      tr: 'Öneri',
      en: 'Suggestion'
    },
    speak: {
      tr: 'Seslendir',
      en: 'Speak'
    }
  }
};

// Dil hook'u
export function useTranslation() {
  // Tarayıcı dilini al veya varsayılan olarak Türkçe kullan
  const getBrowserLanguage = (): Language => {
    if (typeof window === 'undefined') return 'tr';
    
    const storedLanguage = localStorage.getItem('language') as Language;
    if (storedLanguage && ['tr', 'en'].includes(storedLanguage)) {
      return storedLanguage;
    }
    
    const browserLang = navigator.language.split('-')[0];
    return browserLang === 'en' ? 'en' : 'tr';
  };

  const [language, setLanguage] = useState<Language>('tr');
  const [translations, setTranslations] = useState<Translations>(defaultTranslations);

  // Sayfa yüklendiğinde dil ayarını yap
  useEffect(() => {
    setLanguage(getBrowserLanguage());
  }, []);

  // Dil değiştiğinde localStorage'a kaydet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', language);
    }
  }, [language]);

  // Çeviri fonksiyonu
  const t = (section: string, key: string): string => {
    if (translations[section] && translations[section][key] && translations[section][key][language]) {
      return translations[section][key][language];
    }
    return key;
  };

  // Dil değiştirme fonksiyonu
  const changeLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return { t, language, changeLanguage };
}
