'use client';

import { useState, useEffect } from 'react';
import SearchForm from '@/components/SearchForm';
import FeedbackList from '@/components/FeedbackList';
import { useLanguage } from '@/contexts/LanguageContext';

// 模拟数据
const mockDataZh = {
  appName: '微信',
  dateRange: {
    startDate: '2023-10-01',
    endDate: '2024-03-31'
  },
  googlePlayRating: 4.5,
  appStoreRating: 4.7,
  googlePlayReviews: 7534,
  appStoreReviews: 5311,
  
  googlePlay: {
    liked: [
      { feature: '群聊功能', votes: 1245 },
      { feature: '视频通话质量', votes: 987 },
      { feature: '朋友圈', votes: 856 },
      { feature: '支付功能', votes: 732 },
      { feature: '小程序生态', votes: 645 }
    ],
    disliked: [
      { feature: '耗电量大', votes: 456 },
      { feature: '启动速度慢', votes: 389 },
      { feature: '占用存储空间大', votes: 324 },
      { feature: '新版界面变化', votes: 278 },
      { feature: '图片压缩质量', votes: 201 }
    ]
  },
  
  appStore: {
    liked: [
      { feature: '界面设计', votes: 1102 },
      { feature: '流畅度', votes: 943 },
      { feature: '支付功能', votes: 821 },
      { feature: '朋友圈', votes: 764 },
      { feature: '视频通话质量', votes: 692 }
    ],
    disliked: [
      { feature: '通知推送延迟', votes: 412 },
      { feature: '占用内存大', votes: 367 },
      { feature: '打开速度', votes: 298 },
      { feature: '备份恢复功能', votes: 256 },
      { feature: '电池消耗', votes: 187 }
    ]
  }
};

const mockDataEn = {
  appName: 'WeChat',
  dateRange: {
    startDate: '2023-10-01',
    endDate: '2024-03-31'
  },
  googlePlayRating: 4.5,
  appStoreRating: 4.7,
  googlePlayReviews: 7534,
  appStoreReviews: 5311,
  
  googlePlay: {
    liked: [
      { feature: 'Group Chat Function', votes: 1245 },
      { feature: 'Video Call Quality', votes: 987 },
      { feature: 'Moments', votes: 856 },
      { feature: 'Payment Features', votes: 732 },
      { feature: 'Mini Programs Ecosystem', votes: 645 }
    ],
    disliked: [
      { feature: 'Battery Consumption', votes: 456 },
      { feature: 'Slow Startup Speed', votes: 389 },
      { feature: 'Large Storage Usage', votes: 324 },
      { feature: 'New Interface Changes', votes: 278 },
      { feature: 'Image Compression Quality', votes: 201 }
    ]
  },
  
  appStore: {
    liked: [
      { feature: 'UI Design', votes: 1102 },
      { feature: 'Smoothness', votes: 943 },
      { feature: 'Payment Features', votes: 821 },
      { feature: 'Moments', votes: 764 },
      { feature: 'Video Call Quality', votes: 692 }
    ],
    disliked: [
      { feature: 'Notification Delay', votes: 412 },
      { feature: 'Memory Usage', votes: 367 },
      { feature: 'Loading Speed', votes: 298 },
      { feature: 'Backup & Restore', votes: 256 },
      { feature: 'Battery Drain', votes: 187 }
    ]
  }
};

// 模拟反馈示例 - 中文
const mockFeedbackExamplesZh = {
  'google_liked_群聊功能': [
    '群组功能非常实用，让我可以轻松与朋友和同事保持联系',
    '群聊界面清晰，消息通知及时，是我日常沟通的首选工具',
    '群管理功能完善，可以设置各种权限，非常适合工作使用'
  ],
  'google_disliked_耗电量大': [
    '应用消耗电量过大，即使后台运行也会明显减少电池续航时间',
    '使用一段时间后手机发热明显，耗电速度惊人',
    '相比其他类似应用，这款软件的电池优化做得不够好'
  ],
  // 其他示例略
};

// 模拟反馈示例 - 英文
const mockFeedbackExamplesEn = {
  'google_liked_Group Chat Function': [
    'The group function is very practical, allowing me to easily stay in touch with friends and colleagues',
    'Group chat interface is clear, notifications are timely, it\'s my preferred tool for daily communication',
    'Group management features are comprehensive, you can set various permissions, perfect for work use'
  ],
  'google_disliked_Battery Consumption': [
    'The app consumes too much power, even running in the background significantly reduces battery life',
    'After using it for a while, the phone gets noticeably hot and battery drains incredibly fast',
    'Compared to other similar apps, the battery optimization of this software is not good enough'
  ],
  // Other examples omitted
};

export default function AppAnalyzer() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');
  const { t, language } = useLanguage();
  const [feedbackExamples, setFeedbackExamples] = useState<Record<string, string[]>>(mockFeedbackExamplesZh);

  // 语言变化时更新数据
  useEffect(() => {
    if (data) {
      const newData = language === 'zh' ? mockDataZh : mockDataEn;
      setData({
        ...newData,
        appName: data.appName // 保留用户输入的应用名
      });
      
      // 更新反馈示例
      setFeedbackExamples(language === 'zh' ? mockFeedbackExamplesZh : mockFeedbackExamplesEn);
    }
  }, [language, data]);

  const formatDateRange = (dateRange: {startDate: string, endDate: string}) => {
    return t('date.format', { startDate: dateRange.startDate, endDate: dateRange.endDate });
  };

  const handleAnalyze = async (appName: string) => {
    if (!appName.trim()) {
      setError(t('search.error.empty'));
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // 模拟API请求延迟
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // 根据当前语言选择数据
      const mockData = language === 'zh' ? mockDataZh : mockDataEn;
      
      setData({
        ...mockData,
        appName
      });
    } catch (err) {
      setError(t('search.error.general'));
    } finally {
      setLoading(false);
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
          <div className="mb-12 text-center">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              {t('result.title', { appName: data.appName })}
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              {t('result.date_range')}: {formatDateRange(data.dateRange)}
            </p>
          </div>
          
          <div className="grid gap-12 md:grid-cols-2">
            {/* Google Play 分析结果 */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-green-100 p-1.5 text-green-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <h3 className="ml-2 text-xl font-semibold text-gray-900">{t('result.google_play')}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {t('result.reviews_count')}: {data.googlePlayReviews} 
                    {language === 'zh' ? t('result.reviews_unit') : ` ${t('result.reviews_unit')}`}
                  </div>
                  <div className="text-sm font-medium text-gray-900">⭐ {data.googlePlayRating}</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 text-lg font-medium text-gray-900">{t('result.likes')}</h4>
                  <FeedbackList 
                    items={data.googlePlay.liked} 
                    type="liked" 
                    platform="google"
                    feedbackExamples={feedbackExamples}
                  />
                </div>
                
                <div>
                  <h4 className="mb-3 text-lg font-medium text-gray-900">{t('result.dislikes')}</h4>
                  <FeedbackList 
                    items={data.googlePlay.disliked} 
                    type="disliked" 
                    platform="google"
                    feedbackExamples={feedbackExamples}
                  />
                </div>
              </div>
            </div>
            
            {/* App Store 分析结果 */}
            <div>
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-blue-100 p-1.5 text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                  <h3 className="ml-2 text-xl font-semibold text-gray-900">{t('result.app_store')}</h3>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {t('result.reviews_count')}: {data.appStoreReviews} 
                    {language === 'zh' ? t('result.reviews_unit') : ` ${t('result.reviews_unit')}`}
                  </div>
                  <div className="text-sm font-medium text-gray-900">⭐ {data.appStoreRating}</div>
                </div>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h4 className="mb-3 text-lg font-medium text-gray-900">{t('result.likes')}</h4>
                  <FeedbackList 
                    items={data.appStore.liked} 
                    type="liked" 
                    platform="appstore"
                    feedbackExamples={feedbackExamples}
                  />
                </div>
                
                <div>
                  <h4 className="mb-3 text-lg font-medium text-gray-900">{t('result.dislikes')}</h4>
                  <FeedbackList 
                    items={data.appStore.disliked} 
                    type="disliked" 
                    platform="appstore"
                    feedbackExamples={feedbackExamples}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 