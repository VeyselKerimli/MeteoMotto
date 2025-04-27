'use client';

import React, { useState } from 'react';
import { useTranslation } from '@/lib/hooks/useTranslation';
import { registerUser, loginUser } from '@/lib/firebase/firebase';

interface AuthFormProps {
  onSuccess: (userId: string) => void;
  onCancel: () => void;
}

export default function AuthForm({ onSuccess, onCancel }: AuthFormProps) {
  const { t, language } = useTranslation();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    // Form doğrulama
    if (!email || !password) {
      setError(language === 'tr' ? 'E-posta ve şifre gereklidir.' : 'Email and password are required.');
      return;
    }
    
    if (!isLogin && password !== confirmPassword) {
      setError(language === 'tr' ? 'Şifreler eşleşmiyor.' : 'Passwords do not match.');
      return;
    }
    
    setLoading(true);
    
    try {
      let user;
      
      if (isLogin) {
        // Giriş işlemi
        user = await loginUser(email, password);
      } else {
        // Kayıt işlemi
        user = await registerUser(email, password);
      }
      
      // Başarılı giriş/kayıt
      onSuccess(user.uid);
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(err.message || (language === 'tr' ? 'Bir hata oluştu.' : 'An error occurred.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
          {isLogin ? t('ui', 'login') : t('ui', 'register')}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'tr' ? 'E-posta' : 'Email'}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              {language === 'tr' ? 'Şifre' : 'Password'}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          
          {!isLogin && (
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {language === 'tr' ? 'Şifreyi Onayla' : 'Confirm Password'}
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                required
              />
            </div>
          )}
          
          <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mt-6">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              {language === 'tr' ? 'İptal' : 'Cancel'}
            </button>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 bg-transparent rounded-md hover:bg-blue-50 dark:hover:bg-blue-900/30 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {isLogin 
                  ? (language === 'tr' ? 'Hesap Oluştur' : 'Create Account') 
                  : (language === 'tr' ? 'Giriş Yap' : 'Login')}
              </button>
              
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  loading ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {loading 
                  ? (language === 'tr' ? 'İşleniyor...' : 'Processing...') 
                  : (isLogin 
                      ? (language === 'tr' ? 'Giriş Yap' : 'Login') 
                      : (language === 'tr' ? 'Kayıt Ol' : 'Register'))}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
