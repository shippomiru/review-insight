'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SearchForm() {
  const [appName, setAppName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!appName.trim()) {
      setError('请输入应用名称');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      // 在实际应用中，这里会调用API进行分析
      // 暂时模拟一个延迟
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      // 跳转到分析结果页面
      router.push(`/results?app=${encodeURIComponent(appName)}`);
    } catch (err) {
      setError('分析过程中出现错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl rounded-lg bg-white p-8 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col space-y-4">
          <label htmlFor="appName" className="text-sm font-medium text-gray-700">
            应用名称
          </label>
          <input
            id="appName"
            type="text"
            placeholder="例如：微信、Facebook、TikTok"
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
                分析中...
              </div>
            ) : (
              '开始分析'
            )}
          </button>
        </div>
      </form>
      
      {isLoading && (
        <div className="mt-8">
          <div className="mb-2 flex justify-between">
            <span className="text-sm text-gray-600">分析进度</span>
            <span className="text-sm text-gray-600">正在从应用商店获取数据...</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-primary-500 transition-all duration-150"
              style={{ width: '30%' }}
            ></div>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            分析过程通常需要 3-5 分钟，请耐心等待...
          </p>
        </div>
      )}
    </div>
  );
} 