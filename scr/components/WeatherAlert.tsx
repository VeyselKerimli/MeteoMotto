'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface WeatherAlertProps {
  city: string;
  weatherData: any;
}

export default function WeatherAlert({ city, weatherData }: WeatherAlertProps) {
  const { t, language } = useTranslation();
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<'severe' | 'normal'>('normal');
  const [alertMessage, setAlertMessage] = useState('');

  // Hava durumu verilerine göre uyarı oluştur
  useEffect(() => {
    if (!weatherData) return;

    // Uyarı kriterleri
    const temp = weatherData.main?.temp;
    const windSpeed = weatherData.wind?.speed;
    const weatherCondition = weatherData.weather?.[0]?.main;
    const humidity = weatherData.main?.humidity;

    let shouldShowAlert = false;
    let alertType: 'severe' | 'normal' = 'normal';
    let message = '';

    // Şiddetli hava koşulları kontrolü
    if (
      weatherCondition === 'Thunderstorm' || 
      weatherCondition === 'Tornado' ||
      (weatherCondition === 'Rain' && windSpeed > 10) ||
      (weatherCondition === 'Snow' && windSpeed > 8)
    ) {
      shouldShowAlert = true;
      alertType = 'severe';
      
      if (language === 'tr') {
        message = `${city} için şiddetli hava koşulları uyarısı: ${weatherData.weather[0].description}. Lütfen dikkatli olun.`;
      } else {
        message = `Severe weather alert for ${city}: ${weatherData.weather[0].description}. Please be careful.`;
      }
    } 
    // Aşırı sıcaklık kontrolü
    else if (temp > 35) {
      shouldShowAlert = true;
      alertType = 'severe';
      
      if (language === 'tr') {
        message = `${city} için aşırı sıcaklık uyarısı: ${Math.round(temp)}°C. Bol su için ve doğrudan güneş ışığından kaçının.`;
      } else {
        message = `Extreme heat alert for ${city}: ${Math.round(temp)}°C. Stay hydrated and avoid direct sunlight.`;
      }
    }
    // Aşırı soğuk kontrolü
    else if (temp < -10) {
      shouldShowAlert = true;
      alertType = 'severe';
      
      if (language === 'tr') {
        message = `${city} için aşırı soğuk uyarısı: ${Math.round(temp)}°C. Sıcak kalın ve uzun süre dışarıda kalmaktan kaçının.`;
      } else {
        message = `Extreme cold alert for ${city}: ${Math.round(temp)}°C. Stay warm and avoid prolonged outdoor exposure.`;
      }
    }
    // Yüksek nem kontrolü
    else if (humidity > 85 && temp > 25) {
      shouldShowAlert = true;
      alertType = 'normal';
      
      if (language === 'tr') {
        message = `${city} için yüksek nem uyarısı: %${humidity}. Hissedilen sıcaklık daha yüksek olabilir.`;
      } else {
        message = `High humidity alert for ${city}: ${humidity}%. The perceived temperature may be higher.`;
      }
    }
    // Güçlü rüzgar kontrolü
    else if (windSpeed > 15) {
      shouldShowAlert = true;
      alertType = 'normal';
      
      if (language === 'tr') {
        message = `${city} için güçlü rüzgar uyarısı: ${windSpeed} km/s. Dışarıdayken dikkatli olun.`;
      } else {
        message = `Strong wind alert for ${city}: ${windSpeed} km/h. Be careful when outdoors.`;
      }
    }

    setShowAlert(shouldShowAlert);
    setAlertType(alertType);
    setAlertMessage(message);
  }, [weatherData, city, language]);

  // Uyarıyı kapat
  const dismissAlert = () => {
    setShowAlert(false);
  };

  if (!showAlert) {
    return null;
  }

  return (
    <div className={`mb-6 p-4 rounded-lg shadow-md flex items-start justify-between ${
      alertType === 'severe' 
        ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' 
        : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
    }`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {alertType === 'severe' ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </div>
        <div>
          <h3 className="font-semibold">
            {alertType === 'severe' 
              ? (language === 'tr' ? 'Önemli Hava Durumu Uyarısı' : 'Severe Weather Alert')
              : (language === 'tr' ? 'Hava Durumu Bildirimi' : 'Weather Notification')}
          </h3>
          <p className="mt-1">{alertMessage}</p>
        </div>
      </div>
      <button 
        onClick={dismissAlert}
        className="flex-shrink-0 ml-4"
        aria-label={language === 'tr' ? 'Uyarıyı kapat' : 'Dismiss alert'}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}
