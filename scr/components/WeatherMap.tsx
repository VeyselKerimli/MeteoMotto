import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { Icon, LatLngExpression } from 'leaflet';
import { getCurrentWeather } from '@/lib/api/weatherApi';

// Leaflet icon sorunu için çözüm
// https://github.com/Leaflet/Leaflet/issues/4968
const DefaultIcon = new Icon({
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Harita görünümünü güncelleyen bileşen
function ChangeView({ center, zoom }: { center: LatLngExpression, zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, map, zoom]);
  return null;
}

interface WeatherMapProps {
  center?: [number, number];
  zoom?: number;
  markers?: Array<{
    position: [number, number];
    city: string;
  }>;
}

export default function WeatherMap({ 
  center = [39.92, 32.85], // Varsayılan olarak Ankara
  zoom = 6,
  markers = []
}: WeatherMapProps) {
  const { t, language } = useTranslation();
  const [weatherMarkers, setWeatherMarkers] = useState<Array<{
    position: [number, number];
    city: string;
    temp?: number;
    description?: string;
    icon?: string;
  }>>(markers);
  const [loading, setLoading] = useState(false);
  const [mapMode, setMapMode] = useState<'markers' | 'heatmap'>('markers');

  // Marker'lar değiştiğinde hava durumu bilgilerini getir
  useEffect(() => {
    async function fetchWeatherForMarkers() {
      if (markers.length === 0) return;
      
      setLoading(true);
      
      try {
        const updatedMarkers = await Promise.all(
          markers.map(async (marker) => {
            try {
              const weatherData = await getCurrentWeather(marker.city, language);
              return {
                ...marker,
                temp: weatherData.main.temp,
                description: weatherData.weather[0].description,
                icon: weatherData.weather[0].icon
              };
            } catch (error) {
              console.error(`Error fetching weather for ${marker.city}:`, error);
              return marker;
            }
          })
        );
        
        setWeatherMarkers(updatedMarkers);
      } catch (error) {
        console.error('Error fetching weather data for markers:', error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchWeatherForMarkers();
  }, [markers, language]);

  // Leaflet CSS'i Next.js ile çalışması için düzeltme
  useEffect(() => {
    // Leaflet ikonları için gerekli CSS düzeltmeleri
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
    link.crossOrigin = '';
    
    document.head.appendChild(link);
    
    return () => {
      document.head.removeChild(link);
    };
  }, []);

  // Sıcaklık rengini belirle
  const getTemperatureColor = (temp?: number) => {
    if (!temp) return '#6B7280'; // Gri (veri yok)
    
    if (temp < 0) return '#93C5FD'; // Açık mavi (çok soğuk)
    if (temp < 10) return '#3B82F6'; // Mavi (soğuk)
    if (temp < 20) return '#10B981'; // Yeşil (ılık)
    if (temp < 30) return '#F59E0B'; // Turuncu (sıcak)
    return '#EF4444'; // Kırmızı (çok sıcak)
  };

  return (
    <div className="w-full h-[500px] relative rounded-lg overflow-hidden shadow-lg">
      {/* Harita Modu Seçimi */}
      <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-md shadow-md">
        <div className="flex p-1">
          <button
            onClick={() => setMapMode('markers')}
            className={`px-3 py-1 text-sm rounded-l-md ${
              mapMode === 'markers' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {language === 'tr' ? 'İşaretler' : 'Markers'}
          </button>
          <button
            onClick={() => setMapMode('heatmap')}
            className={`px-3 py-1 text-sm rounded-r-md ${
              mapMode === 'heatmap' 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
            }`}
          >
            {language === 'tr' ? 'Isı Haritası' : 'Heatmap'}
          </button>
        </div>
      </div>
      
      {/* Yükleniyor Göstergesi */}
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 z-[1000]">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-lg">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{t('common', 'loading')}</p>
          </div>
        </div>
      )}
      
      {/* Harita */}
      <MapContainer 
        center={center} 
        zoom={zoom} 
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeView center={center} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mapMode === 'markers' && weatherMarkers.map((marker, index) => (
          <Marker 
            key={`${marker.city}-${index}`}
            position={marker.position}
            icon={DefaultIcon}
          >
            <Popup>
              <div className="text-center">
                <h3 className="font-bold text-lg">{marker.city}</h3>
                {marker.temp !== undefined ? (
                  <>
                    <p className="text-2xl font-semibold" style={{ color: getTemperatureColor(marker.temp) }}>
                      {Math.round(marker.temp)}°C
                    </p>
                    {marker.description && (
                      <p className="text-gray-600">{marker.description}</p>
                    )}
                  </>
                ) : (
                  <p className="text-gray-500">{language === 'tr' ? 'Veri yok' : 'No data'}</p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Isı haritası modu için ek bileşenler eklenebilir */}
        {/* Gerçek bir ısı haritası için ek kütüphaneler gerekebilir */}
        {mapMode === 'heatmap' && (
          <div className="leaflet-heatmap-container">
            {/* Isı haritası bileşenleri */}
          </div>
        )}
      </MapContainer>
      
      {/* Harita Açıklaması */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white dark:bg-gray-800 p-2 rounded-md shadow-md">
        <h4 className="text-sm font-semibold mb-1">{language === 'tr' ? 'Sıcaklık' : 'Temperature'}</h4>
        <div className="flex items-center space-x-2">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#93C5FD]"></div>
            <span className="text-xs ml-1">&lt; 0°C</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#3B82F6]"></div>
            <span className="text-xs ml-1">0-10°C</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
            <span className="text-xs ml-1">10-20°C</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#F59E0B]"></div>
            <span className="text-xs ml-1">20-30°C</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
            <span className="text-xs ml-1">&gt; 30°C</span>
          </div>
        </div>
      </div>
    </div>
  );
}
