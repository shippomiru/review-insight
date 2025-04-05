'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SearchFormProps {
  onSubmit: (appName: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [appName, setAppName] = useState('');
  const [error, setError] = useState('');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appName.trim()) {
      setError(t('search.error.empty'));
      return;
    }
    
    setError('');
    onSubmit(appName);
  };

  return (
    <div className="rounded-lg bg-white p-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <label htmlFor="appName" className="text-sm font-medium text-gray-700">
            {t('search.label')}
          </label>
          <input
            id="appName"
            type="text"
            placeholder={t('search.placeholder')}
            value={appName}
            onChange={(e) => setAppName(e.target.value)}
            className="rounded-md border border-gray-300 px-4 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
            disabled={isLoading}
          />
          
          {error && <p className="text-sm text-red-500">{error}</p>}
          
          <button
            type="submit"
            className="btn btn-primary py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('search.analyzing')}
              </div>
            ) : (
              t('search.button')
            )}
          </button>
        </div>
      </form>
    </div>
  );
} 