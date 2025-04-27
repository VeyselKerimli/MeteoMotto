'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface DailySummaryProps {
  city: string;
  weatherData: any;
  forecastData?: any;
}

export default function DailySummary({ city, weatherData, forecastData }: DailySummaryProps) {
  const { t, language } = useTranslation();
  const [summary, setSummary] = useState<string>('');

  // Hava durumu verilerine göre günlük özet oluştur
  useEffect(() => {
    if (!weatherData) return;

    let summaryText = '';
    const currentTemp = Math.round(weatherData.main?.temp);
    const feelsLike = Math.round(weatherData.main?.feels_like);
    const description = weatherData.weather?.[0]?.description;
    const windSpeed = weatherData.wind?.speed;
    const humidity = weatherData.main?.humidity;
    
    // Bugünün özeti
    if (language === 'tr') {
      summaryText = `Bugün ${city}'de hava ${description}, sıcaklık ${currentTemp}°C (hissedilen ${feelsLike}°C). `;
      summaryText += `Nem oranı %${humidity} ve rüzgar hızı ${windSpeed} km/s. `;
    } else {
      summaryText = `Today in ${city}, the weather is ${description}, temperature ${currentTemp}°C (feels like ${feelsLike}°C). `;
      summaryText += `Humidity is ${humidity}% and wind speed is ${windSpeed} km/h. `;
    }
    
    // Tahmin verisi varsa, yarın için tahmin ekle
    if (forecastData && forecastData.list && forecastData.list.length > 0) {
      // Yarının tahmini için yaklaşık 24 saat sonrasını al (8 veri noktası, her biri 3 saatlik)
      const tomorrowForecast = forecastData.list[7];
      
      if (tomorrowForecast) {
        const tomorrowTemp = Math.round(tomorrowForecast.main.temp);
        const tomorrowDesc = tomorrowForecast.weather[0].description;
        
        if (language === 'tr') {
          summaryText += `Yarın için tahmin: ${tomorrowDesc}, sıcaklık ${tomorrowTemp}°C.`;
        } else {
          summaryText += `Tomorrow's forecast: ${tomorrowDesc}, temperature ${tomorrowTemp}°C.`;
        }
      }
    }
    
    setSummary(summaryText);
  }, [weatherData, forecastData, city, language]);

  if (!summary) return null;

  return (
    <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg text-blue-800 dark:text-blue-300 mb-2">
        {language === 'tr' ? 'Günlük Özet' : 'Daily Summary'}
      </h3>
      <p className="text-blue-700 dark:text-blue-200">{summary}</p>
    </div>
  );
}
