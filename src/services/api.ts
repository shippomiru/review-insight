/**
 * API服务层 - 使用google-play-scraper和app-store-scraper获取应用评论
 * 
 * 遵循以下最佳实践：
 * 1. 使用随机延迟减少被封风险
 * 2. 实现请求失败重试机制
 * 3. 避免过于频繁的请求
 * 4. 使用合法的第三方库
 */

import { Language } from '@/contexts/LanguageContext';

// 定义应用商店类型
export type StoreType = 'google' | 'apple' | 'both';

// 导出接口定义，供客户端使用
export interface AppInfo {
  appId: string;
  title: string;
  summary: string;
  developer: string;
  developerId: string;
  icon: string;
  score: number;
  ratings: number;
  reviews: number;
  currentVersion: string;
  released: string;
  updated: string;
  appLink: string;
}

export interface AppReview {
  id: string;
  userName: string;
  userImage?: string;
  date: string;
  score: number;
  text: string;
  title?: string;
  url?: string;
  version?: string;
  thumbsUp?: number;
  replyDate?: string;
  replyText?: string;
}

export interface Feature {
  feature: string;
  votes: number;
}

export interface AppReviewsAnalysis {
  appInfo: AppInfo;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  googlePlay?: {
    liked: Feature[];
    disliked: Feature[];
  };
  appStore?: {
    liked: Feature[];
    disliked: Feature[];
  };
  reviewExamples: {
    [key: string]: string[];
  };
  storeType?: StoreType; // 新增字段，标识数据来源
  reviewsData?: AppReview[]; // 新增字段，保存原始评论数据，用于统计评论数量
}

// 在AppReviewsAnalysis接口后添加新的任务相关接口
export interface TaskStatus {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  message: string;
  updatedAt: number;
  result?: AppReviewsAnalysis;
  error?: string;
}

// API错误类
class ApiError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

// 通过API路由分析Google Play应用评论
export const analyzeGooglePlayAppReviews = async (
  appName: string,
  language: Language = 'en'
): Promise<AppReviewsAnalysis> => {
  try {
    const response = await fetch('/api/analyze-google', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appName, language }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.error || '分析Google Play应用评论时出错',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing Google Play app reviews:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('连接Google Play分析服务时出错，请稍后再试');
  }
};

// 通过API路由分析App Store应用评论
export const analyzeAppStoreAppReviews = async (
  appName: string,
  language: Language = 'en',
  country: string = 'us'
): Promise<AppReviewsAnalysis> => {
  try {
    const response = await fetch('/api/analyze-apple', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appName, language, country }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.error || '分析App Store应用评论时出错',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error analyzing App Store app reviews:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('连接App Store分析服务时出错，请稍后再试');
  }
};

// 根据选择的商店类型分析应用评论
export const analyzeAppReviews = async (
  appName: string,
  storeType: StoreType = 'both',
  language: Language = 'en',
  country: string = 'us'
): Promise<AppReviewsAnalysis> => {
  try {
    if (storeType === 'google') {
      return await analyzeGooglePlayAppReviews(appName, language);
    } else if (storeType === 'apple') {
      return await analyzeAppStoreAppReviews(appName, language, country);
    } else {
      // 如果是both，则使用旧的API以保持兼容性
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ appName, language, country }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new ApiError(
          errorData.error || '分析应用评论时出错',
          response.status
        );
      }
      
      return await response.json();
    }
  } catch (error) {
    console.error('Error analyzing app reviews:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('连接服务器时出错，请稍后再试');
  }
};

// 在api.ts文件末尾，添加新的任务API方法
// 创建异步分析任务
export const createAnalysisTask = async (
  appName: string,
  storeType: StoreType = 'apple',
  language: Language = 'en',
  country: string = 'us'
): Promise<string> => {
  try {
    const response = await fetch('/api/tasks/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ appName, storeType, language, country }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.error || '创建分析任务时出错',
        response.status
      );
    }
    
    const data = await response.json();
    return data.taskId;
  } catch (error) {
    console.error('Error creating analysis task:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('创建任务时出错，请稍后再试');
  }
};

// 获取任务状态
export const getTaskStatus = async (taskId: string): Promise<TaskStatus> => {
  try {
    const response = await fetch(`/api/tasks/status?taskId=${taskId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new ApiError(
        errorData.error || '获取任务状态时出错',
        response.status
      );
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error getting task status:', error);
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('获取任务状态时出错，请稍后再试');
  }
};

// 轮询任务状态直到完成或失败
export const pollTaskStatus = async (
  taskId: string,
  onProgress?: (status: TaskStatus) => void,
  pollInterval: number = 2000
): Promise<AppReviewsAnalysis> => {
  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const status = await getTaskStatus(taskId);
        
        // 回调进度更新
        if (onProgress) {
          onProgress(status);
        }
        
        if (status.status === 'completed' && status.result) {
          resolve(status.result);
          return;
        } else if (status.status === 'failed') {
          reject(new Error(status.error || '任务处理失败'));
          return;
        }
        
        // 继续轮询
        setTimeout(checkStatus, pollInterval);
      } catch (error) {
        reject(error);
      }
    };
    
    // 开始轮询
    checkStatus();
  });
};

// 更新默认导出
export default {
  analyzeAppReviews,
  analyzeGooglePlayAppReviews,
  analyzeAppStoreAppReviews,
  createAnalysisTask,
  getTaskStatus,
  pollTaskStatus,
}; 