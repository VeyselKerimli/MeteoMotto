import React, { useState, useRef, useEffect } from 'react';
import { useSearch } from '@/lib/hooks/useSearch';
import { useTranslation } from '@/lib/hooks/useTranslation';

interface SearchBarProps {
  onSelectCity: (city: string) => void;
  onRequestLocation: () => void;
}

export default function SearchBar({ onSelectCity, onRequestLocation }: SearchBarProps) {
  const { t, language } = useTranslation();
  const { loading, results, searchCity, clearSearch } = useSearch();
  const [query, setQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  // Arama sonuçlarını güncelle
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length >= 2) {
        searchCity(query);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query, searchCity]);

  // Dropdown dışına tıklandığında kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Şehir seçildiğinde
  const handleSelectCity = (city: string) => {
    onSelectCity(city);
    setQuery(city);
    setIsDropdownOpen(false);
    clearSearch();
  };

  return (
    <div className="w-full max-w-md mx-auto relative" ref={searchRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          placeholder={t('common', 'search')}
          className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
        
        {query && (
          <button
            onClick={() => {
              setQuery('');
              clearSearch();
            }}
            className="absolute right-12 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            aria-label="Clear search"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        <button
          onClick={onRequestLocation}
          className="absolute right-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          aria-label={t('common', 'currentLocation')}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </button>
      </div>
      
      {/* Arama sonuçları dropdown */}
      {isDropdownOpen && query.length >= 2 && (
        <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg dark:bg-gray-800 max-h-60 overflow-y-auto">
          {loading ? (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
              {t('common', 'loading')}
            </div>
          ) : results.length > 0 ? (
            <ul>
              {results.map((city, index) => (
                <li 
                  key={index}
                  onClick={() => handleSelectCity(city)}
                  className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer text-gray-800 dark:text-gray-200"
                >
                  {city}
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-2 text-gray-500 dark:text-gray-400">
              {language === 'tr' ? 'Sonuç bulunamadı' : 'No results found'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
