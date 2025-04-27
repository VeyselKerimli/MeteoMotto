'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { 
  getUserPreferences, 
  updateNotificationSettings, 
  updateDisplaySettings,
  logoutUser
} from '@/lib/firebase/firebase';
import type { UserPreferences } from '@/lib/firebase/firebase';

interface UserProfileProps {
  userId: string;
  onLogout: () => void;
  onPreferencesChange: (preferences: UserPreferences) => void;
}

export default function UserProfile({ userId, onLogout, onPreferencesChange }: UserProfileProps) {
  const { t, language, changeLanguage } = useTranslation();
  const [preferences, setPreferences] = useState<UserPreferences>({
    favoriteCities: [],
    notificationSettings: {
      dailySummary: false,
      severeWeatherAlerts: false,
      notificationTime: '08:00'
    },
    displaySettings: {
      darkMode: false,
      language: 'tr',
      temperatureUnit: 'C'
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'general' | 'notifications'>('general');

  // Kullanıcı tercihlerini yükle
  useEffect(() => {
    async function loadPreferences() {
      try {
        setLoading(true);
        const userPrefs = await getUserPreferences(userId);
        
        if (userPrefs) {
          setPreferences(userPrefs);
        }
      } catch (err: any) {
        console.error('Error loading preferences:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    loadPreferences();
  }, [userId]);

  // Bildirim ayarlarını güncelle
  const handleNotificationChange = async (settings: {
    dailySummary?: boolean;
    severeWeatherAlerts?: boolean;
    notificationTime?: string;
  }) => {
    try {
      setIsSaving(true);
      
      // Yerel state'i güncelle
      const updatedPreferences = {
        ...preferences,
        notificationSettings: {
          ...preferences.notificationSettings,
          ...settings
        }
      };
      
      setPreferences(updatedPreferences);
      
      // Firebase'e kaydet
      await updateNotificationSettings(userId, settings);
      
      // Ana bileşene bildir
      onPreferencesChange(updatedPreferences);
    } catch (err: any) {
      console.error('Error updating notification settings:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Görüntüleme ayarlarını güncelle
  const handleDisplayChange = async (settings: {
    darkMode?: boolean;
    language?: 'tr' | 'en';
    temperatureUnit?: 'C' | 'F';
  }) => {
    try {
      setIsSaving(true);
      
      // Yerel state'i güncelle
      const updatedPreferences = {
        ...preferences,
        displaySettings: {
          ...preferences.displaySettings,
          ...settings
        }
      };
      
      setPreferences(updatedPreferences);
      
      // Firebase'e kaydet
      await updateDisplaySettings(userId, settings);
      
      // Dil değiştiyse uygulamayı güncelle
      if (settings.language && settings.language !== language) {
        changeLanguage(settings.language);
      }
      
      // Ana bileşene bildir
      onPreferencesChange(updatedPreferences);
    } catch (err: any) {
      console.error('Error updating display settings:', err);
      setError(err.message);
    } finally {
      setIsSaving(false);
    }
  };

  // Çıkış yap
  const handleLogout = async () => {
    try {
      await logoutUser();
      onLogout();
    } catch (err: any) {
      console.error('Error logging out:', err);
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-2 text-gray-600 dark:text-gray-300">{t('common', 'loading')}</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold">{t('ui', 'profile')}</h2>
      </div>
      
      {error && (
        <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm">
          {error}
        </div>
      )}
      
      {/* Sekme Menüsü */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('general')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'general'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {language === 'tr' ? 'Genel Ayarlar' : 'General Settings'}
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`px-4 py-3 text-sm font-medium ${
              activeTab === 'notifications'
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
          >
            {t('ui', 'notifications')}
          </button>
        </nav>
      </div>
      
      <div className="p-6">
        {/* Genel Ayarlar */}
        {activeTab === 'general' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {t('ui', 'language')}
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDisplayChange({ language: 'tr' })}
                  className={`px-4 py-2 rounded-md ${
                    preferences.displaySettings?.language === 'tr'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  Türkçe
                </button>
                <button
                  onClick={() => handleDisplayChange({ language: 'en' })}
                  className={`px-4 py-2 rounded-md ${
                    preferences.displaySettings?.language === 'en'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {t('ui', 'units')}
              </h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => handleDisplayChange({ temperatureUnit: 'C' })}
                  className={`px-4 py-2 rounded-md ${
                    preferences.displaySettings?.temperatureUnit === 'C'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t('ui', 'metric')}
                </button>
                <button
                  onClick={() => handleDisplayChange({ temperatureUnit: 'F' })}
                  className={`px-4 py-2 rounded-md ${
                    preferences.displaySettings?.temperatureUnit === 'F'
                      ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  {t('ui', 'imperial')}
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {t('ui', 'darkMode')}
              </h3>
              <div className="flex items-center">
                <label className="inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={preferences.displaySettings?.darkMode || false}
                    onChange={(e) => handleDisplayChange({ darkMode: e.target.checked })}
                  />
                  <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                    {preferences.displaySettings?.darkMode 
                      ? (language === 'tr' ? 'Açık' : 'Enabled') 
                      : (language === 'tr' ? 'Kapalı' : 'Disabled')}
                  </span>
                </label>
              </div>
            </div>
          </div>
        )}
        
        {/* Bildirim Ayarları */}
        {activeTab === 'notifications' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                {language === 'tr' ? 'Bildirim Tercihleri' : 'Notification Preferences'}
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.notificationSettings?.dailySummary || false}
                      onChange={(e) => handleNotificationChange({ dailySummary: e.target.checked })}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {language === 'tr' ? 'Günlük Hava Durumu Özeti' : 'Daily Weather Summary'}
                    </span>
                  </label>
                </div>
                
                <div className="flex items-center">
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={preferences.notificationSettings?.severeWeatherAlerts || false}
                      onChange={(e) => handleNotificationChange({ severeWeatherAlerts: e.target.checked })}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">
                      {language === 'tr' ? 'Şiddetli Hava Olayları Uyarıları' : 'Severe Weather Alerts'}
                    </span>
                  </label>
                </div>
                
                {preferences.notificationSettings?.dailySummary && (
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      {language === 'tr' ? 'Bildirim Saati' : 'Notification Time'}
                    </label>
                    <input
                      type="time"
                      value={preferences.notificationSettings?.notificationTime || '08:00'}
                      onChange={(e) => handleNotificationChange({ notificationTime: e.target.value })}
                      className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Çıkış Yap Butonu */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            {t('ui', 'logout')}
          </button>
        </div>
      </div>
      
      {/* Kaydetme Göstergesi */}
      {isSaving && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
          {language === 'tr' ? 'Kaydediliyor...' : 'Saving...'}
        </div>
      )}
    </div>
  );
}
