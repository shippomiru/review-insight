'use client';

import { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

interface FeedbackItem {
  feature: string;
  votes: number;
}

interface FeedbackListProps {
  items: FeedbackItem[];
  type: 'liked' | 'disliked';
  platform: 'google' | 'appstore';
  feedbackExamples: Record<string, string[]>;
}

export default function FeedbackList({ items, type, platform, feedbackExamples }: FeedbackListProps) {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const { t } = useLanguage();
  
  const toggleItem = (feature: string) => {
    if (expandedItem === feature) {
      setExpandedItem(null);
    } else {
      setExpandedItem(feature);
    }
  };
  
  const getExampleKey = () => {
    return `${platform}_${type}_${expandedItem}`;
  };
  
  const getRandomExamples = () => {
    const key = getExampleKey();
    
    // 如果没有对应的示例，返回默认消息
    if (!feedbackExamples[key]) {
      if (type === 'liked') {
        return [
          t('feedback.liked.default1'),
          t('feedback.liked.default2'),
          t('feedback.liked.default3')
        ];
      } else {
        return [
          t('feedback.disliked.default1'),
          t('feedback.disliked.default2'),
          t('feedback.disliked.default3')
        ];
      }
    }
    
    return feedbackExamples[key];
  };
  
  return (
    <ul className="space-y-4">
      {items.map((item) => (
        <li key={item.feature} className="overflow-hidden rounded-lg border border-gray-200">
          <button
            onClick={() => toggleItem(item.feature)}
            className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-gray-50"
          >
            <span className="font-medium text-gray-900">
              {item.feature}
            </span>
            <div className="flex items-center">
              <span className="mr-2 rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                {item.votes} {t('result.votes')}
              </span>
              <svg
                className={`h-5 w-5 text-gray-500 transition-transform ${
                  expandedItem === item.feature ? 'rotate-180' : ''
                }`}
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </button>
          
          {expandedItem === item.feature && (
            <div className="bg-gray-50 px-4 py-3">
              <p className="mb-2 text-sm font-medium text-gray-700">{t('result.feedback_examples')}</p>
              <ul className="space-y-2">
                {getRandomExamples().map((example, index) => (
                  <li key={index} className="rounded-md bg-white p-3 text-sm text-gray-600 shadow-sm">
                    {example}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
} 