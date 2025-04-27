import React, { useState, useEffect } from 'react';
import { useGeolocation } from '@/lib/hooks/useGeolocation';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { getCurrentWeather, getCurrentWeatherByCoords, getWeatherIconUrl } from '@/lib/api/weatherApi';
import { generateWeatherSuggestion } from '@/lib/api/geminiApi';

interface WeatherDisplayProps {
  city?: string;
}

export default function WeatherDisplay({ city }: WeatherDisplayProps) {
  const { t, language } = useTranslation();
  const { position, getPosition, loading: locationLoading, error: locationError } = useGeolocation();
  
  const [weatherData, setWeatherData] = useState<any>(null);
  const [suggestion, setSuggestion] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Şehir veya konum değiştiğinde hava durumu bilgisini getir
  useEffect(() => {
    async function fetchWeatherData() {
      setLoading(true);
      setError(null);
      
      try {
        let data;
        
        if (city) {
          // Şehir adına göre hava durumu getir
          data = await getCurrentWeather(city, language);
        } else if (position) {
          // Koordinatlara göre hava durumu getir
          data = await getCurrentWeatherByCoords(position.lat, position.lon, language);
        } else {
          // Ne şehir ne de konum varsa, işlem yapma
          setLoading(false);
          return;
        }
        
        setWeatherData(data);
        
        // Gemini AI ile öneri oluştur
        try {
          const weatherInfo = {
            temp: data.main.temp,
            feels_like: data.main.feels_like,
            description: data.weather[0].description,
            city: data.name,
            humidity: data.main.humidity,
            wind_speed: data.wind.speed,
            condition: data.weather[0].main
          };
          
          const aiSuggestion = await generateWeatherSuggestion(weatherInfo, language);
          setSuggestion(aiSuggestion);
        } catch (suggestionError) {
          console.error('Öneri oluşturma hatası:', suggestionError);
          // Öneri oluşturulamazsa, hava durumu verisi yine de gösterilir
        }
        
      } catch (err) {
        setError(language === 'tr' ? 
          'Hava durumu bilgisi alınamadı. Lütfen tekrar deneyin.' : 
          'Could not get weather information. Please try again.');
        console.error('Hava durumu hatası:', err);
      } finally {
        setLoading(false);
      }
    }
    
    if (city || position) {
      fetchWeatherData();
    }
  }, [city, position, language]);

  // Konum butonuna tıklandığında
  const handleLocationRequest = () => {
    getPosition();
  };

  // Metni seslendirme fonksiyonu
  const speakText = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'tr' ? 'tr-TR' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Yükleme durumu
  if (loading || locationLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-300">{t('common', 'loading')}</p>
      </div>
    );
  }

  // Hata durumu
  if (error || locationError) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <div className="text-red-500 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="text-gray-700 dark:text-gray-300">{error || locationError}</p>
        <button 
          onClick={handleLocationRequest}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          {t('common', 'retry')}
        </button>
      </div>
    );
  }

  // Veri yoksa
  if (!weatherData) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <p className="text-gray-600 dark:text-gray-300">
          {language === 'tr' ? 
            'Hava durumu bilgisi görüntülemek için bir şehir arayın veya konum butonuna tıklayın.' : 
            'Search for a city or click the location button to view weather information.'}
        </p>
      </div>
    );
  }

  // Tarih formatı
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  // Saat formatı
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    return new Intl.DateTimeFormat(language === 'tr' ? 'tr-TR' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
        {/* Üst Bilgi Alanı */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-3xl font-bold">{weatherData.name}, {weatherData.sys.country}</h2>
              <p className="text-lg opacity-90">{formatDate(weatherData.dt)}</p>
              <p className="text-xl mt-2">{weatherData.weather[0].description}</p>
            </div>
            
            <div className="flex items-center">
              <img 
                src={getWeatherIconUrl(weatherData.weather[0].icon)} 
                alt={weatherData.weather[0].description}
                className="w-20 h-20"
              />
              <div className="text-center">
                <h3 className="text-4xl font-bold">{Math.round(weatherData.main.temp)}°C</h3>
                <p className="text-lg">{t('weather', 'feelsLike')}: {Math.round(weatherData.main.feels_like)}°C</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Detay Bilgileri */}
        <div className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-300">{t('weather', 'humidity')}</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{weatherData.main.humidity}%</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-300">{t('weather', 'wind')}</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{weatherData.wind.speed} km/h</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-300">{t('weather', 'sunrise')}</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{formatTime(weatherData.sys.sunrise)}</p>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-center">
              <p className="text-gray-500 dark:text-gray-300">{t('weather', 'sunset')}</p>
              <p className="text-xl font-semibold text-gray-800 dark:text-white">{formatTime(weatherData.sys.sunset)}</p>
            </div>
          </div>
          
          {/* Gemini AI Önerisi */}
          {suggestion && (
            <div className="mt-6 bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg">
              <div className="flex justify-between items-start">
                <div className="flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <div>
                    <h3 className="font-semibold text-gray-800 dark:text-white">{t('gemini', 'suggestion')}</h3>
                    <p className="text-gray-700 dark:text-gray-300">{suggestion}</p>
                  </div>
                </div>
                <button 
                  onClick={() => speakText(suggestion)}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                  aria-label={t('gemini', 'speak')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
