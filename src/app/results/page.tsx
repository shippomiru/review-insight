'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import FeedbackList from '@/components/FeedbackList';

// 模拟数据
const mockData = {
  appName: '微信',
  totalReviews: 12845,
  dateRange: '2023-10-01 至 2024-03-31',
  googlePlayRating: 4.5,
  appStoreRating: 4.7,
  
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

// 模拟反馈示例
const mockFeedbackExamples = {
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

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const appNameParam = searchParams.get('app');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any>(null);
  
  useEffect(() => {
    // 模拟API请求延迟
    const timer = setTimeout(() => {
      setData({
        ...mockData,
        appName: appNameParam || mockData.appName
      });
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [appNameParam]);
  
  if (loading) {
    return (
      <main>
        <Header />
        <section className="section">
          <div className="container">
            <div className="flex min-h-[50vh] items-center justify-center">
              <div className="text-center">
                <svg className="mx-auto h-12 w-12 animate-spin text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-4 text-lg text-gray-600">加载分析结果中...</p>
              </div>
            </div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }
  
  return (
    <main>
      <Header />
      
      <section className="section">
        <div className="container">
          <div className="mb-16 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {data.appName} 评价分析
            </h1>
            <div className="mt-6 flex flex-wrap justify-center gap-8">
              <div className="text-center">
                <p className="text-sm text-gray-600">分析时间范围</p>
                <p className="text-lg font-medium text-gray-900">{data.dateRange}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">分析评论总数</p>
                <p className="text-lg font-medium text-gray-900">{data.totalReviews} 条</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Google Play 评分</p>
                <p className="text-lg font-medium text-gray-900">⭐ {data.googlePlayRating}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-gray-600">App Store 评分</p>
                <p className="text-lg font-medium text-gray-900">⭐ {data.appStoreRating}</p>
              </div>
            </div>
          </div>
          
          <div className="grid gap-16 md:grid-cols-2">
            {/* Google Play 分析结果 */}
            <div>
              <div className="mb-8 flex items-center">
                <div className="h-10 w-10 rounded-full bg-green-100 p-2 text-green-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h2 className="ml-3 text-2xl font-semibold text-gray-900">Google Play 分析</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-xl font-medium text-gray-900">用户喜欢的功能</h3>
                  <FeedbackList 
                    items={data.googlePlay.liked} 
                    type="liked" 
                    platform="google"
                    feedbackExamples={mockFeedbackExamples}
                  />
                </div>
                
                <div>
                  <h3 className="mb-4 text-xl font-medium text-gray-900">用户不满意的功能</h3>
                  <FeedbackList 
                    items={data.googlePlay.disliked} 
                    type="disliked" 
                    platform="google"
                    feedbackExamples={mockFeedbackExamples}
                  />
                </div>
              </div>
            </div>
            
            {/* App Store 分析结果 */}
            <div>
              <div className="mb-8 flex items-center">
                <div className="h-10 w-10 rounded-full bg-blue-100 p-2 text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <h2 className="ml-3 text-2xl font-semibold text-gray-900">App Store 分析</h2>
              </div>
              
              <div className="space-y-8">
                <div>
                  <h3 className="mb-4 text-xl font-medium text-gray-900">用户喜欢的功能</h3>
                  <FeedbackList 
                    items={data.appStore.liked} 
                    type="liked" 
                    platform="appstore"
                    feedbackExamples={mockFeedbackExamples}
                  />
                </div>
                
                <div>
                  <h3 className="mb-4 text-xl font-medium text-gray-900">用户不满意的功能</h3>
                  <FeedbackList 
                    items={data.appStore.disliked} 
                    type="disliked" 
                    platform="appstore"
                    feedbackExamples={mockFeedbackExamples}
                  />
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <p className="mb-6 text-gray-600">
              想分析其他应用？
            </p>
            <a href="/search" className="btn btn-primary px-8 py-3">
              继续分析
            </a>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 