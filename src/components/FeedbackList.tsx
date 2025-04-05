'use client';

import { useState } from 'react';

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
        return ['用户对这个功能表示满意', '这项功能获得了积极评价', '用户认为这个功能很实用'];
      } else {
        return ['用户对这个功能表示不满', '这项功能收到了一些改进建议', '用户希望这个功能能够优化'];
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
                {item.votes} 票
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
              <p className="mb-2 text-sm font-medium text-gray-700">用户反馈示例：</p>
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