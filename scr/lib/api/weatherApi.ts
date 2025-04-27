// OpenWeatherMap API entegrasyonu
const API_KEY = '4ad7591f6d9615b3e5a8cdf9e351e19e';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherData {
  coord: {
    lon: number;
    lat: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  base: string;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  visibility: number;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  clouds: {
    all: number;
  };
  rain?: {
    '1h'?: number;
    '3h'?: number;
  };
  snow?: {
    '1h'?: number;
    '3h'?: number;
  };
  dt: number;
  sys: {
    type: number;
    id: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  name: string;
  cod: number;
}

export interface ForecastData {
  cod: string;
  message: number;
  cnt: number;
  list: Array<{
    dt: number;
    main: {
      temp: number;
      feels_like: number;
      temp_min: number;
      temp_max: number;
      pressure: number;
      sea_level: number;
      grnd_level: number;
      humidity: number;
      temp_kf: number;
    };
    weather: Array<{
      id: number;
      main: string;
      description: string;
      icon: string;
    }>;
    clouds: {
      all: number;
    };
    wind: {
      speed: number;
      deg: number;
      gust?: number;
    };
    visibility: number;
    pop: number;
    rain?: {
      '3h': number;
    };
    snow?: {
      '3h': number;
    };
    sys: {
      pod: string;
    };
    dt_txt: string;
  }>;
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

// Şehir adına göre güncel hava durumu bilgisini getir
export async function getCurrentWeather(city: string, lang = 'tr'): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Hava durumu bilgisi alınamadı: ${response.status}`);
  }
  
  return response.json();
}

// Koordinatlara göre güncel hava durumu bilgisini getir
export async function getCurrentWeatherByCoords(lat: number, lon: number, lang = 'tr'): Promise<WeatherData> {
  const url = `${BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Hava durumu bilgisi alınamadı: ${response.status}`);
  }
  
  return response.json();
}

// 5 günlük tahmin bilgisini getir
export async function getForecast(city: string, lang = 'tr'): Promise<ForecastData> {
  const url = `${BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=${lang}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Tahmin bilgisi alınamadı: ${response.status}`);
  }
  
  return response.json();
}

// Koordinatlara göre 5 günlük tahmin bilgisini getir
export async function getForecastByCoords(lat: number, lon: number, lang = 'tr'): Promise<ForecastData> {
  const url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=${lang}`;
  
  const response = await fetch(url);
  
  if (!response.ok) {
    throw new Error(`Tahmin bilgisi alınamadı: ${response.status}`);
  }
  
  return response.json();
}

// Hava durumu ikonunu getir
export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
}

// Sıcaklık birimini dönüştür (Celsius <-> Fahrenheit)
export function convertTemperature(temp: number, to: 'C' | 'F'): number {
  if (to === 'F') {
    return (temp * 9/5) + 32;
  } else {
    return (temp - 32) * 5/9;
  }
}
