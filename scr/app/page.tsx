'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import WeatherDisplay from '@/components/WeatherDisplay';
import WeatherMap from '@/components/WeatherMap';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { getCurrentWeatherByCoords } from '@/lib/api/weatherApi';

export default function Home() {
  const { t, language, changeLanguage } = useTranslation();
  const { position, getPosition } = useGeolocation();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false);
  const [mapMarkers, setMapMarkers] = useState<Array<{
    position: [number, number];
    city: string;
  }>>([]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([39.92, 32.85]); // Default: Ankara

  // Sayfa yüklendiğinde sistem temasını kontrol et
  useEffect(() => {
    // Sistem teması kontrolü
    if (typeof window !== 'undefined') {
      const darkModePreference = localStorage.getItem('darkMode');
      
      if (darkModePreference) {
        setIsDarkMode(darkModePreference === 'true');
      } else {
        // Sistem temasını kontrol et
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setIsDarkMode(prefersDark);
      }
      
      // Tema değişikliklerini dinle
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        if (localStorage.getItem('darkMode') === null) {
          setIsDarkMode(e.matches);
        }
      };
      
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, []);

  // Tema değiştiğinde HTML sınıfını güncelle
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  // Konum değiştiğinde harita merkezini güncelle
  useEffect(() => {
    if (position) {
      setMapCenter([position.lat, position.lon]);
      
      // Konum bilgisini al ve haritaya ekle
      const fetchLocationData = async () => {
        try {
          const weatherData = await getCurrentWeatherByCoords(position.lat, position.lon, language);
          
          // Mevcut konumu harita işaretçilerine ekle
          setMapMarkers(prev => {
            // Aynı şehir zaten varsa ekleme
            if (prev.some(marker => marker.city === weatherData.name)) {
              return prev;
            }
            
            return [...prev, {
              position: [position.lat, position.lon],
              city: weatherData.name
            }];
          });
          
        } catch (error) {
          console.error('Konum hava durumu hatası:', error);
        }
      };
      
      fetchLocationData();
    }
  }, [position, language]);

  // Şehir seçildiğinde
  const handleCitySelect = (city: string) => {
    setSelectedCity(city);
    
    // Seçilen şehri harita işaretçilerine ekle
    // Gerçek uygulamada, şehrin koordinatlarını almak için geocoding API kullanılabilir
    // Burada basit bir simülasyon yapıyoruz
    const getRandomOffset = () => (Math.random() - 0.5) * 2;
    
    // Türkiye'nin yaklaşık merkezi
    const turkeyCenter: [number, number] = [39, 35];
    
    // Rastgele bir konum oluştur (gerçek uygulamada geocoding API kullanılmalı)
    const simulatedPosition: [number, number] = [
      turkeyCenter[0] + getRandomOffset() * 3,
      turkeyCenter[1] + getRandomOffset() * 5
    ];
    
    setMapMarkers(prev => {
      // Aynı şehir zaten varsa ekleme
      if (prev.some(marker => marker.city === city)) {
        return prev;
      }
      
      return [...prev, {
        position: simulatedPosition,
        city: city
      }];
    });
  };

  return (
    <main className="flex flex-col min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      {/* Üst Çubuk */}
      <header className="bg-white dark:bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600 dark:text-blue-400">
            MeteoMotto
          </h1>
          
          <div className="flex items-center space-x-4">
            {/* Dil Değiştirme */}
            <button 
              onClick={() => changeLanguage(language === 'tr' ? 'en' : 'tr')}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={t('ui', 'language')}
            >
              <span className="font-medium">
                {language === 'tr' ? 'EN' : 'TR'}
              </span>
            </button>
            
            {/* Tema Değiştirme */}
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label={isDarkMode ? t('ui', 'lightMode') : t('ui', 'darkMode')}
            >
              {isDarkMode ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>
      
      {/* Ana İçerik */}
      <div className="container mx-auto px-4 py-8 flex-grow">
        {/* Arama Çubuğu */}
        <div className="mb-8">
          <SearchBar 
            onSelectCity={handleCitySelect} 
            onRequestLocation={getPosition} 
          />
        </div>
        
        {/* Hava Durumu Gösterimi */}
        <div className="mb-8">
          <WeatherDisplay city={selectedCity || undefined} />
        </div>
        
        {/* Harita */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">{t('ui', 'map')}</h2>
          <WeatherMap 
            center={mapCenter}
            zoom={7}
            markers={mapMarkers}
          />
        </div>
      </div>
      
      {/* Alt Menü (Mobil) */}
      <footer className="bg-white dark:bg-gray-800 shadow-lg md:hidden">
        <div className="container mx-auto px-4">
          <div className="flex justify-around py-3">
            <button className="flex flex-col items-center text-blue-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span className="text-xs mt-1">{t('ui', 'home')}</span>
            </button>
            
            <button className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              <span className="text-xs mt-1">{t('ui', 'map')}</span>
            </button>
            
            <button className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="text-xs mt-1">{t('ui', 'settings')}</span>
            </button>
            
            <button className="flex flex-col items-center text-gray-500 dark:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span className="text-xs mt-1">{t('ui', 'profile')}</span>
            </button>
          </div>
        </div>
      </footer>
    </main>
  );
}
