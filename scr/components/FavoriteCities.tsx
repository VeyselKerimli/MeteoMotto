'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { addFavoriteCity, removeFavoriteCity } from '@/lib/firebase/firebase';

interface FavoriteCitiesProps {
  userId: string | null;
  favoriteCities: string[];
  onSelectCity: (city: string) => void;
  onFavoritesChange: (cities: string[]) => void;
}

export default function FavoriteCities({ 
  userId, 
  favoriteCities = [], 
  onSelectCity,
  onFavoritesChange
}: FavoriteCitiesProps) {
  const { t, language } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Favori şehir ekle
  const handleAddFavorite = async (city: string) => {
    if (!userId) {
      // Kullanıcı giriş yapmamışsa, yerel olarak ekle
      onFavoritesChange([...favoriteCities, city]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await addFavoriteCity(userId, city);
      onFavoritesChange([...favoriteCities, city]);
    } catch (err: any) {
      console.error('Error adding favorite city:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Favori şehri kaldır
  const handleRemoveFavorite = async (city: string) => {
    if (!userId) {
      // Kullanıcı giriş yapmamışsa, yerel olarak kaldır
      onFavoritesChange(favoriteCities.filter(c => c !== city));
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await removeFavoriteCity(userId, city);
      onFavoritesChange(favoriteCities.filter(c => c !== city));
    } catch (err: any) {
      console.error('Error removing favorite city:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Şehir zaten favorilerde mi kontrol et
  const isFavorite = (city: string) => {
    return favoriteCities.includes(city);
  };

  if (favoriteCities.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">{language === 'tr' ? 'Favori Şehirler' : 'Favorite Cities'}</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {language === 'tr' 
            ? 'Henüz favori şehir eklenmedi. Şehir arayın ve favori olarak ekleyin.' 
            : 'No favorite cities added yet. Search for a city and add it as a favorite.'}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-semibold mb-4">{language === 'tr' ? 'Favori Şehirler' : 'Favorite Cities'}</h2>
      
      {error && (
        <div className="mb-4 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
          {error}
        </div>
      )}
      
      <div className="flex flex-wrap gap-2">
        {favoriteCities.map((city, index) => (
          <div 
            key={`${city}-${index}`}
            className="flex items-center bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full"
          >
            <button
              onClick={() => onSelectCity(city)}
              className="mr-2 hover:underline"
            >
              {city}
            </button>
            <button
              onClick={() => handleRemoveFavorite(city)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200"
              disabled={isLoading}
              aria-label={language === 'tr' ? 'Favorilerden kaldır' : 'Remove from favorites'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
