'use client';

// Çevrimdışı önbellek için yardımcı fonksiyonlar
const CACHE_PREFIX = 'meteomotto_cache_';
const CACHE_EXPIRY = 60 * 60 * 1000; // 1 saat (milisaniye cinsinden)

// Veriyi önbelleğe kaydet
export function saveToCache(key: string, data: any): void {
  if (typeof window === 'undefined') return;
  
  try {
    const cacheItem = {
      data,
      timestamp: Date.now(),
    };
    
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(cacheItem));
  } catch (error) {
    console.error('Cache save error:', error);
  }
}

// Önbellekten veri getir
export function getFromCache(key: string): any | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const cachedData = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    
    if (!cachedData) return null;
    
    const cacheItem = JSON.parse(cachedData);
    const now = Date.now();
    
    // Önbellek süresi dolmuşsa null döndür
    if (now - cacheItem.timestamp > CACHE_EXPIRY) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    
    return cacheItem.data;
  } catch (error) {
    console.error('Cache retrieval error:', error);
    return null;
  }
}

// Önbellekten veriyi sil
export function removeFromCache(key: string): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(`${CACHE_PREFIX}${key}`);
  } catch (error) {
    console.error('Cache removal error:', error);
  }
}

// Tüm önbelleği temizle
export function clearCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage);
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        localStorage.removeItem(key);
      }
    });
  } catch (error) {
    console.error('Cache clear error:', error);
  }
}

// Süresi dolmuş önbellek öğelerini temizle
export function cleanExpiredCache(): void {
  if (typeof window === 'undefined') return;
  
  try {
    const keys = Object.keys(localStorage);
    const now = Date.now();
    
    keys.forEach(key => {
      if (key.startsWith(CACHE_PREFIX)) {
        const cachedData = localStorage.getItem(key);
        
        if (cachedData) {
          const cacheItem = JSON.parse(cachedData);
          
          if (now - cacheItem.timestamp > CACHE_EXPIRY) {
            localStorage.removeItem(key);
          }
        }
      }
    });
  } catch (error) {
    console.error('Cache cleaning error:', error);
  }
}

// Çevrimdışı durumu kontrol et
export function isOffline(): boolean {
  if (typeof window === 'undefined') return false;
  
  return !navigator.onLine;
}

// Çevrimdışı durum değişikliklerini dinle
export function listenToOfflineChanges(callback: (isOffline: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};
  
  const handleOnline = () => callback(false);
  const handleOffline = () => callback(true);
  
  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);
  
  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}
