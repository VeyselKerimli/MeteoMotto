// Firebase yapılandırması
import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, User } from "firebase/auth";
import { getDatabase, ref, set, get, child } from "firebase/database";
import { getAnalytics } from "firebase/analytics";

// Firebase yapılandırma bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyCseja4uu4vVBAT_tK_DBNgRn-M72RfYr0",
  authDomain: "kitaptakipci-uygulamasi.firebaseapp.com",
  databaseURL: "https://kitaptakipci-uygulamasi-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "kitaptakipci-uygulamasi",
  storageBucket: "kitaptakipci-uygulamasi.firebasestorage.app",
  messagingSenderId: "837218385790",
  appId: "1:837218385790:web:8eb1bc1377878785a8bd2f",
  measurementId: "G-RBY2XRWZRT"
};

// Firebase uygulamasını başlat
const app = initializeApp(firebaseConfig);

// Auth ve Database servislerini al
const auth = getAuth(app);
const database = getDatabase(app);

// Analytics sadece tarayıcı ortamında başlat
let analytics: any = null;
if (typeof window !== 'undefined') {
  analytics = getAnalytics(app);
}

// Kullanıcı tercihleri için arayüz
export interface UserPreferences {
  favoriteCities?: string[];
  notificationSettings?: {
    dailySummary: boolean;
    severeWeatherAlerts: boolean;
    notificationTime?: string;
  };
  displaySettings?: {
    darkMode?: boolean;
    language?: 'tr' | 'en';
    temperatureUnit?: 'C' | 'F';
  };
}

// Kullanıcı kaydı
export async function registerUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(`Kayıt hatası: ${error.message}`);
  }
}

// Kullanıcı girişi
export async function loginUser(email: string, password: string): Promise<User> {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error: any) {
    throw new Error(`Giriş hatası: ${error.message}`);
  }
}

// Kullanıcı çıkışı
export async function logoutUser(): Promise<void> {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(`Çıkış hatası: ${error.message}`);
  }
}

// Kullanıcı tercihlerini kaydet
export async function saveUserPreferences(userId: string, preferences: UserPreferences): Promise<void> {
  try {
    await set(ref(database, `users/${userId}/preferences`), preferences);
  } catch (error: any) {
    throw new Error(`Tercih kaydetme hatası: ${error.message}`);
  }
}

// Kullanıcı tercihlerini getir
export async function getUserPreferences(userId: string): Promise<UserPreferences | null> {
  try {
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `users/${userId}/preferences`));
    
    if (snapshot.exists()) {
      return snapshot.val() as UserPreferences;
    } else {
      return null;
    }
  } catch (error: any) {
    throw new Error(`Tercih getirme hatası: ${error.message}`);
  }
}

// Favori şehir ekle
export async function addFavoriteCity(userId: string, city: string): Promise<void> {
  try {
    const preferences = await getUserPreferences(userId) || {};
    const favoriteCities = preferences.favoriteCities || [];
    
    // Şehir zaten favorilerde yoksa ekle
    if (!favoriteCities.includes(city)) {
      favoriteCities.push(city);
      await saveUserPreferences(userId, {
        ...preferences,
        favoriteCities
      });
    }
  } catch (error: any) {
    throw new Error(`Favori şehir ekleme hatası: ${error.message}`);
  }
}

// Favori şehri kaldır
export async function removeFavoriteCity(userId: string, city: string): Promise<void> {
  try {
    const preferences = await getUserPreferences(userId) || {};
    const favoriteCities = preferences.favoriteCities || [];
    
    // Şehri favorilerden kaldır
    const updatedFavorites = favoriteCities.filter(c => c !== city);
    await saveUserPreferences(userId, {
      ...preferences,
      favoriteCities: updatedFavorites
    });
  } catch (error: any) {
    throw new Error(`Favori şehir kaldırma hatası: ${error.message}`);
  }
}

// Bildirim ayarlarını güncelle
export async function updateNotificationSettings(
  userId: string, 
  settings: {
    dailySummary?: boolean;
    severeWeatherAlerts?: boolean;
    notificationTime?: string;
  }
): Promise<void> {
  try {
    const preferences = await getUserPreferences(userId) || {};
    const currentSettings = preferences.notificationSettings || {
      dailySummary: false,
      severeWeatherAlerts: false
    };
    
    await saveUserPreferences(userId, {
      ...preferences,
      notificationSettings: {
        ...currentSettings,
        ...settings
      }
    });
  } catch (error: any) {
    throw new Error(`Bildirim ayarları güncelleme hatası: ${error.message}`);
  }
}

// Görüntüleme ayarlarını güncelle
export async function updateDisplaySettings(
  userId: string,
  settings: {
    darkMode?: boolean;
    language?: 'tr' | 'en';
    temperatureUnit?: 'C' | 'F';
  }
): Promise<void> {
  try {
    const preferences = await getUserPreferences(userId) || {};
    const currentSettings = preferences.displaySettings || {};
    
    await saveUserPreferences(userId, {
      ...preferences,
      displaySettings: {
        ...currentSettings,
        ...settings
      }
    });
  } catch (error: any) {
    throw new Error(`Görüntüleme ayarları güncelleme hatası: ${error.message}`);
  }
}

// Mevcut kullanıcıyı izle
export function onAuthStateChange(callback: (user: User | null) => void): () => void {
  return onAuthStateChanged(auth, callback);
}

export { auth, database, analytics };
