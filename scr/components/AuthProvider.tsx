'use client';

import React, { useState, useEffect } from 'react';
import { onAuthStateChange, auth, getUserPreferences, type UserPreferences } from '@/lib/firebase/firebase';
import AuthForm from '@/components/AuthForm';
import UserProfile from '@/components/UserProfile';
import { useTranslation } from '@/lib/hooks/useTranslation';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuthForm, setShowAuthForm] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);

  // Kullanıcı oturum durumunu izle
  useEffect(() => {
    const unsubscribe = onAuthStateChange((authUser) => {
      setUser(authUser);
      setLoading(false);
      
      // Kullanıcı giriş yaptıysa tercihlerini yükle
      if (authUser) {
        loadUserPreferences(authUser.uid);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Kullanıcı tercihlerini yükle
  const loadUserPreferences = async (userId: string) => {
    try {
      const preferences = await getUserPreferences(userId);
      setUserPreferences(preferences);
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  // Giriş başarılı olduğunda
  const handleAuthSuccess = (userId: string) => {
    setShowAuthForm(false);
    loadUserPreferences(userId);
  };

  // Çıkış yapıldığında
  const handleLogout = () => {
    setShowProfile(false);
    setUserPreferences(null);
  };

  // Tercihler değiştiğinde
  const handlePreferencesChange = (preferences: UserPreferences) => {
    setUserPreferences(preferences);
  };

  return (
    <>
      {/* Üst Menü Butonu */}
      <div className="absolute top-4 right-4 z-10">
        {user ? (
          <button
            onClick={() => setShowProfile(true)}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            aria-label={t('ui', 'profile')}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
        ) : (
          <button
            onClick={() => setShowAuthForm(true)}
            className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {t('ui', 'login')}
          </button>
        )}
      </div>
      
      {/* Ana İçerik */}
      {children}
      
      {/* Giriş/Kayıt Formu */}
      {showAuthForm && !user && (
        <AuthForm 
          onSuccess={handleAuthSuccess} 
          onCancel={() => setShowAuthForm(false)} 
        />
      )}
      
      {/* Kullanıcı Profili */}
      {showProfile && user && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full">
            <div className="flex justify-end p-2">
              <button
                onClick={() => setShowProfile(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                aria-label="Close"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <UserProfile 
              userId={user.uid} 
              onLogout={handleLogout}
              onPreferencesChange={handlePreferencesChange}
            />
          </div>
        </div>
      )}
    </>
  );
}
