import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  error: string | null;
  position: {
    lat: number;
    lon: number;
  } | null;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    error: null,
    position: null,
  });

  const getPosition = () => {
    if (!navigator.geolocation) {
      setState({
        loading: false,
        error: 'Tarayıcınız konum özelliğini desteklemiyor.',
        position: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          loading: false,
          error: null,
          position: {
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          },
        });
      },
      (error) => {
        let errorMessage = 'Konum bilgisi alınamadı.';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Konum izni reddedildi.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Konum bilgisi kullanılamıyor.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Konum isteği zaman aşımına uğradı.';
            break;
        }
        
        setState({
          loading: false,
          error: errorMessage,
          position: null,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  return { ...state, getPosition };
}
