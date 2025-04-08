import { useState } from 'react';

declare global {
  interface Window {
    gtag: (command: string, ...args: any[]) => void;
  }
}

interface UserFeedbackProps {
  feedback: string;
}

export default function UserFeedback({ feedback }: UserFeedbackProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggle = () => {
    setIsExpanded(!isExpanded);
    
    // 添加用户行为埋点
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'toggle_feedback', {
        'event_category': 'feedback',
        'event_label': isExpanded ? 'collapse' : 'expand',
        'value': 1
      });
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">用户反馈</h3>
        <button
          onClick={handleToggle}
          className="text-primary-600 hover:text-primary-700"
        >
          {isExpanded ? '收起' : '展开'}
        </button>
      </div>
      {isExpanded && (
        <div className="mt-4">
          <p className="text-gray-700">{feedback}</p>
        </div>
      )}
    </div>
  );
} 