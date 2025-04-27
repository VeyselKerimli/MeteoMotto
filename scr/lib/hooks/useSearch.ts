import { useState, useCallback } from 'react';

interface SearchState {
  loading: boolean;
  error: string | null;
  results: string[];
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({
    loading: false,
    error: null,
    results: [],
  });

  // Şehir arama fonksiyonu
  const searchCity = useCallback(async (query: string) => {
    if (!query || query.trim().length < 2) {
      setState({
        loading: false,
        error: null,
        results: [],
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // OpenWeatherMap API'nin şehir arama özelliği doğrudan bulunmadığı için
      // Burada basit bir şehir listesi kullanıyoruz
      // Gerçek uygulamada daha kapsamlı bir API kullanılabilir
      
      // Simüle edilmiş şehir arama sonuçları
      const commonCities = [
        'İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep',
        'Şanlıurfa', 'Mersin', 'Diyarbakır', 'Hatay', 'Manisa', 'Kocaeli', 'Samsun',
        'London', 'New York', 'Paris', 'Tokyo', 'Berlin', 'Rome', 'Madrid', 'Moscow',
        'Beijing', 'Sydney', 'Cairo', 'Rio de Janeiro', 'Toronto', 'Dubai', 'Singapore'
      ];
      
      // Arama sorgusuna göre şehirleri filtrele
      const filteredCities = commonCities.filter(city => 
        city.toLowerCase().includes(query.toLowerCase())
      );
      
      // Kısa bir gecikme ekleyerek gerçek bir API çağrısını simüle et
      await new Promise(resolve => setTimeout(resolve, 300));
      
      setState({
        loading: false,
        error: null,
        results: filteredCities,
      });
    } catch (error) {
      setState({
        loading: false,
        error: 'Şehir araması sırasında bir hata oluştu.',
        results: [],
      });
    }
  }, []);

  const clearSearch = useCallback(() => {
    setState({
      loading: false,
      error: null,
      results: [],
    });
  }, []);

  return { 
    ...state, 
    searchCity,
    clearSearch
  };
}
