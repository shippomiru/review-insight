'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export interface CountryOption {
  code: string;
  name: string;
}

export interface SearchFormProps {
  onSubmit: (appName: string, country: string) => void;
  isLoading: boolean;
}

export default function SearchForm({ onSubmit, isLoading }: SearchFormProps) {
  const [appName, setAppName] = useState('');
  const [country, setCountry] = useState('cn');
  const { t, language } = useLanguage();
  
  // 国家/地区选项
  const countryOptions: CountryOption[] = language === 'zh' 
    ? [
        // 亚洲地区
        { code: 'cn', name: '中国大陆' },
        { code: 'hk', name: '中国香港' },
        { code: 'tw', name: '中国台湾' },
        { code: 'jp', name: '日本' },
        { code: 'kr', name: '韩国' },
        { code: 'sg', name: '新加坡' },
        // 北美洲
        { code: 'us', name: '美国' },
        { code: 'ca', name: '加拿大' },
        // 欧洲
        { code: 'gb', name: '英国' },
        { code: 'de', name: '德国' },
        { code: 'fr', name: '法国' },
        { code: 'it', name: '意大利' },
        { code: 'es', name: '西班牙' },
        { code: 'nl', name: '荷兰' },
        { code: 'se', name: '瑞典' },
        { code: 'ch', name: '瑞士' },
        // 大洋洲
        { code: 'au', name: '澳大利亚' },
        { code: 'nz', name: '新西兰' },
      ]
    : [
        // Asia
        { code: 'cn', name: 'China Mainland' },
        { code: 'hk', name: 'Hong Kong, China' },
        { code: 'tw', name: 'Taiwan, China' },
        { code: 'jp', name: 'Japan' },
        { code: 'kr', name: 'South Korea' },
        { code: 'sg', name: 'Singapore' },
        // North America
        { code: 'us', name: 'United States' },
        { code: 'ca', name: 'Canada' },
        // Europe
        { code: 'gb', name: 'United Kingdom' },
        { code: 'de', name: 'Germany' },
        { code: 'fr', name: 'France' },
        { code: 'it', name: 'Italy' },
        { code: 'es', name: 'Spain' },
        { code: 'nl', name: 'Netherlands' },
        { code: 'se', name: 'Sweden' },
        { code: 'ch', name: 'Switzerland' },
        // Oceania
        { code: 'au', name: 'Australia' },
        { code: 'nz', name: 'New Zealand' },
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('表单提交:', appName, country);
    if (appName.trim()) {
      onSubmit(appName, country);
    }
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit}>
        <label htmlFor="app-name" className="mb-2 block text-sm font-medium text-gray-700">
          {t('search.label')}
        </label>
        
        <div className="flex flex-col space-y-4 md:flex-row md:space-x-4 md:space-y-0">
          <div className="flex-grow">
            <input
              id="app-name"
              type="text"
              className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              placeholder={t('search.placeholder')}
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              disabled={isLoading}
            />
          </div>
          
          <div className="min-w-fit md:w-48">
            <select
              id="country"
              className="block w-full rounded-md border border-gray-300 px-4 py-3 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              disabled={isLoading}
            >
              {countryOptions.map((option) => (
                <option key={option.code} value={option.code}>
                  {option.name}
                </option>
              ))}
            </select>
          </div>
          
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