'use client';

import { useState, useEffect } from 'react';
import SearchForm from '@/components/SearchForm';
import FeedbackList from '@/components/FeedbackList';
import { useLanguage } from '@/contexts/LanguageContext';
import { analyzeAppReviews, AppReviewsAnalysis } from '@/services/api';

export default function AppAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<AppReviewsAnalysis | null>(null);
  const [error, setError] = useState('');
  const [country, setCountry] = useState('cn');
  const [reviewCount, setReviewCount] = useState<number>(0);
  const { t, language } = useLanguage();

  const formatDateRange = () => {
    // 创建近半年的日期范围
    const endDate = new Date();
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 6);
    
    const formatDate = (date: Date) => {
      return date.toISOString().split('T')[0];
    };
    
    return `${formatDate(startDate)} - ${formatDate(endDate)}`;
  };

  const handleAnalyze = async (appName: string, selectedCountry: string) => {
    if (!appName.trim()) {
      setError(t('search.error.empty'));
      return;
    }
    
    console.log('开始分析:', appName, selectedCountry);
    setLoading(true);
    setError('');
    setData(null);
    setCountry(selectedCountry);
    setReviewCount(0);
    
    try {
      // 调用真实API，传递国家代码
      console.log('调用API:', appName, language, selectedCountry);
      const analysisData = await analyzeAppReviews(appName, 'apple', language, selectedCountry);
      console.log('API返回数据:', analysisData ? 'success' : 'null');
      setData(analysisData);
      
      // 计算实际获取的评论数量
      let actualReviewCount = 0;
      if (analysisData.reviewsData && Array.isArray(analysisData.reviewsData)) {
        actualReviewCount = analysisData.reviewsData.length;
        console.log('获取到评论数量:', actualReviewCount);
      }
      setReviewCount(actualReviewCount);
    } catch (err) {
      console.error('分析应用时出错:', err);
      if (err instanceof Error) {
        setError(err.message || t('search.error.general'));
      } else {
        setError(t('search.error.general'));
      }
    } finally {
      setLoading(false);
      console.log('分析完成');
    }
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-xl">
        <SearchForm onSubmit={handleAnalyze} isLoading={loading} />
      </div>
      
      {error && (
        <div className="mt-8 rounded-md bg-red-50 p-4">
          <p className="text-center text-sm text-red-600">{error}</p>
        </div>
      )}
      
      {loading && (
        <div className="mt-8">
          <div className="mx-auto max-w-xl">
            <div className="mb-2 flex justify-between">
              <span className="text-sm text-gray-600">{t('search.progress')}</span>
              <span className="text-sm text-gray-600">{t('search.getting_data')}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary-500 transition-all duration-150"
                style={{ width: '30%' }}
              ></div>
            </div>
            <p className="mt-4 text-center text-sm text-gray-600">
              {t('search.wait_message')}
            </p>
          </div>
        </div>
      )}
      
      {data && !loading && (
        <div className="mt-12">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('result.title', { appName: data.appInfo.title })}
            </h2>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('result.date_range')}</p>
                <p className="text-base font-medium">{formatDateRange()}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('result.reviews_count')}</p>
                <p className="text-base font-medium">
                  {reviewCount.toLocaleString()} 
                  {language === 'zh' ? t('result.reviews_unit') : ` ${t('result.reviews_unit')}`}
                </p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('result.app_rating')}</p>
                <p className="text-base font-medium">⭐ {data.appInfo.score.toFixed(1)}</p>
              </div>
              
              <div className="text-center">
                <p className="text-sm text-gray-600">{t('result.country')}</p>
                <p className="text-base font-medium">{getCountryName(country, language)}</p>
              </div>
            </div>
          </div>
          
          {data.appStore && (
            <div>
              <div className="mb-6 flex items-center">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                    </svg>
                  </div>
                  <h3 className="ml-2 text-xl font-semibold text-gray-900">{t('result.app_store_analysis')}</h3>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h4 className="mb-4 text-center text-lg font-medium text-gray-900">{t('result.likes')}</h4>
                  <FeedbackList 
                    items={data.appStore.liked}
                    type="liked"
                    platform="appstore"
                    feedbackExamples={data.reviewExamples}
                  />
                </div>
                
                <div className="rounded-lg border border-gray-200 p-6 shadow-sm">
                  <h4 className="mb-4 text-center text-lg font-medium text-gray-900">{t('result.dislikes')}</h4>
                  <FeedbackList 
                    items={data.appStore.disliked}
                    type="disliked"
                    platform="appstore"
                    feedbackExamples={data.reviewExamples}
                  />
                </div>
              </div>
            </div>
          )}
          
          {!data.appStore && (
            <div className="my-12 text-center">
              <div className="rounded-md bg-yellow-50 p-4">
                <p className="text-center text-sm text-yellow-800">
                  {t('result.no_appstore_data')}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// 根据国家代码获取国家名称
function getCountryName(code: string, language: string): string {
  const countryMap: Record<string, Record<string, string>> = {
    zh: {
      'cn': '中国大陆',
      'hk': '中国香港',
      'tw': '中国台湾',
      'us': '美国',
      'jp': '日本',
      'kr': '韩国',
      'sg': '新加坡',
      'ca': '加拿大',
      'gb': '英国',
      'de': '德国',
      'fr': '法国',
      'it': '意大利',
      'es': '西班牙',
      'nl': '荷兰',
      'se': '瑞典',
      'ch': '瑞士',
      'au': '澳大利亚',
      'nz': '新西兰'
    },
    en: {
      'cn': 'China Mainland',
      'hk': 'Hong Kong, China',
      'tw': 'Taiwan, China',
      'us': 'United States',
      'jp': 'Japan',
      'kr': 'South Korea',
      'sg': 'Singapore',
      'ca': 'Canada',
      'gb': 'United Kingdom',
      'de': 'Germany',
      'fr': 'France',
      'it': 'Italy',
      'es': 'Spain',
      'nl': 'Netherlands',
      'se': 'Sweden',
      'ch': 'Switzerland',
      'au': 'Australia',
      'nz': 'New Zealand'
    }
  };
  
  return countryMap[language]?.[code] || code.toUpperCase();
} 