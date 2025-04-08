import { useState } from 'react';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

interface AnalyzeButtonProps {
  appId: string;
  onAnalyze: () => Promise<void>;
}

export default function AnalyzeButton({ appId, onAnalyze }: AnalyzeButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!appId) {
      setError('请输入应用ID');
      return;
    }

    // 添加用户行为埋点
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'start_analysis', {
        'event_category': 'analysis',
        'event_label': 'start_analysis',
        'value': 1
      });
    }

    setIsLoading(true);
    setError(null);

    try {
      await onAnalyze();
    } catch (err) {
      setError('分析过程中出现错误');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleAnalyze}
        disabled={isLoading}
        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? '分析中...' : '开始分析'}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
} 