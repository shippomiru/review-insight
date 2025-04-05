import { Language } from '@/contexts/LanguageContext';
import { NextResponse } from 'next/server';
import { createRequire } from 'module';

// 创建require函数，用于加载CommonJS模块
const require = createRequire(import.meta.url);

// 基础接口定义
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
  appStore?: {
    liked: Feature[];
    disliked: Feature[];
  };
  reviewExamples: {
    [key: string]: string[];
  };
  storeType: 'apple';
  reviewsData: AppReview[];
}

// 使用真实的App Store Scraper获取应用信息和评论
const getAppStoreData = async (appName: string, language: Language, country: string = 'us') => {
  try {
    console.log(`尝试获取App Store数据: ${appName}, 语言: ${language}, 国家: ${country}`);
    
    // 尝试导入app-store-scraper库（CommonJS）
    const appStore = require('app-store-scraper');
    
    if (!appStore || !appStore.search) {
      throw new Error('App Store Scraper库导入失败');
    }
    
    console.log('成功导入App Store Scraper库，开始搜索应用');
    
    // 搜索应用
    const searchResults = await appStore.search({
      term: appName,
      num: 1,
      lang: language === 'zh' ? 'zh-cn' : 'en-us',
    });
    
    if (!searchResults || searchResults.length === 0) {
      throw new Error(`没有找到与"${appName}"匹配的App Store应用`);
    }
    
    const app = searchResults[0];
    console.log(`找到应用: ${app.title} (${app.id})`);
    
    // 获取应用评论，使用指定国家
    const reviews = await appStore.reviews({
      id: app.id,
      country: country, // 使用传入的国家参数
      sort: appStore.sort.RECENT,
      page: 1,
      num: 150, // 尝试获取更多评论
    });
    
    if (!reviews || !Array.isArray(reviews)) {
      throw new Error(`无法获取${country}地区的应用评论`);
    }
    
    console.log(`获取到 ${reviews.length} 条评论，国家: ${country}`);
    
    // 提取特性和评论示例
    const features = extractFeatures(reviews, language);
    const reviewExamples = extractReviewExamples(reviews, features, language);
    
    // 构建结果
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    return {
      appInfo: {
        appId: app.id?.toString() || '',
        title: app.title || '',
        summary: app.description || '',
        developer: app.developer || '',
        developerId: app.developerId || '',
        icon: app.icon || '',
        score: app.score || 0,
        ratings: app.ratings || 0,
        reviews: app.reviews || 0,
        currentVersion: app.version || '',
        released: app.released || '',
        updated: app.updated || '',
        appLink: app.url || '',
      },
      dateRange: {
        startDate: sixMonthsAgo.toISOString().split('T')[0],
        endDate: now.toISOString().split('T')[0],
      },
      appStore: features,
      reviewExamples,
      storeType: 'apple' as const,
      reviewsData: reviews.map(review => ({
        id: review.id?.toString() || '',
        userName: review.userName || review.author || '',
        date: review.date || '',
        score: review.score || 0,
        text: review.text || '',
        title: review.title || '',
        version: review.version || '',
      })),
    };
  } catch (error) {
    console.error('获取App Store数据失败:', error);
    throw error;
  }
};

// 提取特性
const extractFeatures = (
  reviews: any[],
  language: Language
): { liked: Feature[]; disliked: Feature[] } => {
  // 特性关键词
  const featureKeywords: Record<string, string[]> = {
    'UI/Design': ['ui', 'design', 'interface', 'beautiful', 'layout', 'look'],
    'Performance': ['fast', 'slow', 'performance', 'speed', 'responsive', 'lag'],
    'Stability': ['crash', 'bug', 'stable', 'unstable', 'freeze', 'error'],
    'Features': ['feature', 'functionality', 'option', 'capability'],
    'Usability': ['easy', 'difficult', 'intuitive', 'user-friendly', 'confusing'],
    'Battery Usage': ['battery', 'drain', 'power', 'consumption'],
    'Storage': ['storage', 'space', 'memory', 'size'],
    'Notifications': ['notification', 'alert', 'remind', 'push'],
    'Updates': ['update', 'version', 'new', 'improvement', 'upgrade'],
    'Support': ['support', 'help', 'service', 'customer'],
  };

  // 中文关键词
  const chineseFeatureKeywords: Record<string, string[]> = {
    'UI/Design': ['界面', '设计', '外观', '漂亮', '布局', '看起来'],
    'Performance': ['快', '慢', '性能', '速度', '响应', '卡顿'],
    'Stability': ['崩溃', 'bug', '稳定', '不稳定', '冻结', '错误'],
    'Features': ['功能', '特性', '选项', '能力'],
    'Usability': ['简单', '难', '直观', '友好', '易用', '困惑'],
    'Battery Usage': ['电池', '耗电', '电量', '续航'],
    'Storage': ['存储', '空间', '内存', '体积'],
    'Notifications': ['通知', '提醒', '提示', '推送'],
    'Updates': ['更新', '版本', '新', '改进', '升级'],
    'Support': ['支持', '帮助', '服务', '客服'],
  };

  // 初始化特征计数
  const features: Record<string, { positive: number; negative: number }> = {};
  Object.keys(featureKeywords).forEach((feature) => {
    features[feature] = { positive: 0, negative: 0 };
  });

  // 分析评论
  reviews.forEach((review) => {
    const text = (review.text || '').toLowerCase();
    const isPositive = (review.score || 0) >= 4; // 4-5星为正面评价

    // 根据语言选择关键词表
    const keywordsToUse = language === 'zh' ? chineseFeatureKeywords : featureKeywords;

    // 检查文本中是否包含特征关键词
    Object.entries(keywordsToUse).forEach(([feature, keywords]) => {
      if (keywords.some((keyword) => text.includes(keyword.toLowerCase()))) {
        if (isPositive) {
          features[feature].positive += 1;
        } else {
          features[feature].negative += 1;
        }
      }
    });
  });

  // 构建结果
  const liked = Object.entries(features)
    .filter(([_, counts]) => counts.positive > 0)
    .map(([feature, counts]) => ({
      feature,
      votes: counts.positive,
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  const disliked = Object.entries(features)
    .filter(([_, counts]) => counts.negative > 0)
    .map(([feature, counts]) => ({
      feature,
      votes: counts.negative,
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);

  return { liked, disliked };
};

// 提取评论示例
const extractReviewExamples = (
  reviews: any[],
  features: { liked: Feature[]; disliked: Feature[] },
  language: Language
): Record<string, string[]> => {
  const examples: Record<string, string[]> = {};

  // 为每个功能提取评论示例
  [...features.liked, ...features.disliked].forEach((feature) => {
    const featureType = features.liked.includes(feature) ? 'liked' : 'disliked';
    const key = `appstore_${featureType}_${feature.feature}`;

    // 找到包含该功能关键词的评论
    const keywordsToMatch = feature.feature.toLowerCase().split('/');
    const matchingReviews = reviews.filter((review) => {
      const text = (review.text || '').toLowerCase();
      const isPositive = (review.score || 0) >= 4;

      return (
        keywordsToMatch.some((keyword) => text.includes(keyword)) &&
        (featureType === 'liked' ? isPositive : !isPositive)
      );
    });

    // 从匹配的评论中获取最多3条
    examples[key] = matchingReviews.slice(0, 3).map((review) => review.text || '');

    // 如果没有足够的评论，添加一些通用示例
    if (examples[key].length === 0) {
      if (language === 'zh') {
        if (featureType === 'liked') {
          examples[key] = [`用户喜欢${feature.feature}功能`];
        } else {
          examples[key] = [`用户提到了${feature.feature}方面的问题`];
        }
      } else {
        if (featureType === 'liked') {
          examples[key] = [`Users like the ${feature.feature.toLowerCase()} feature`];
        } else {
          examples[key] = [`Users mentioned issues with the ${feature.feature.toLowerCase()}`];
        }
      }
    }
  });

  return examples;
};

// 生成模拟App Store数据
const generateMockAppStoreData = (appName: string, language: Language): AppReviewsAnalysis => {
  console.log(`生成模拟App Store数据: ${appName}, 语言: ${language}`);
  
  // 当前日期
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // 反馈示例
  const feedbackExamples: Record<string, string[]> = {};
  
  if (language === 'zh') {
    feedbackExamples['appstore_liked_UI/Design'] = [
      '界面设计非常简洁美观，使用起来很舒服',
      '我特别喜欢这个应用的用户界面，很现代化',
      '视觉设计做得非常棒，色彩搭配很舒适'
    ];
    feedbackExamples['appstore_disliked_Performance'] = [
      '最近更新后应用变得有点卡顿，希望能优化一下',
      '在我的设备上运行有点慢，希望能提高性能',
      '有时候打开比较慢，需要等待几秒钟'
    ];
    feedbackExamples['appstore_liked_Features'] = [
      '功能非常齐全，满足了我所有的需求',
      '最新版本增加的新功能很实用，非常喜欢',
      '各种功能的设计都很人性化，很容易上手'
    ];
    feedbackExamples['appstore_disliked_Stability'] = [
      '偶尔会闪退，希望能修复这个问题',
      '在使用某些功能时会崩溃，体验不是很好',
      '有时候会莫名其妙地关闭，需要重新打开'
    ];
  } else {
    feedbackExamples['appstore_liked_UI/Design'] = [
      'The interface design is very clean and beautiful, very comfortable to use',
      'I especially like the user interface of this app, very modern',
      'Visual design is great, color matching is very comfortable'
    ];
    feedbackExamples['appstore_disliked_Performance'] = [
      'The app has become a bit laggy after the recent update, hope it can be optimized',
      'It runs a bit slow on my device, hope to improve performance',
      'Sometimes it takes a few seconds to open'
    ];
    feedbackExamples['appstore_liked_Features'] = [
      'The features are very complete, meeting all my needs',
      'The new features added in the latest version are very useful, I really like them',
      'All the features are designed in a user-friendly way, very easy to get started'
    ];
    feedbackExamples['appstore_disliked_Stability'] = [
      'It occasionally crashes, hope this issue can be fixed',
      'It crashes when using certain features, not a good experience',
      'Sometimes it closes inexplicably and needs to be reopened'
    ];
  }
  
  return {
    appInfo: {
      appId: '123456789',
      title: appName,
      summary: language === 'zh' ? '这是一个很棒的应用' : 'This is a great app',
      developer: 'Example Developer',
      developerId: 'example.developer',
      icon: 'https://is4-ssl.mzstatic.com/image/thumb/Purple116/v4/76/4f/5e/764f5e42-d8c5-5940-d578-09c7b5a9d942/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp',
      score: 4.6,
      ratings: 15800,
      reviews: 6420,
      currentVersion: '3.2.1',
      released: '2019-08-10',
      updated: '2023-11-05',
      appLink: 'https://apps.apple.com/app',
    },
    dateRange: {
      startDate: sixMonthsAgo.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    },
    appStore: {
      liked: [
        { feature: 'UI/Design', votes: 1102 },
        { feature: 'Features', votes: 943 },
        { feature: 'Performance', votes: 821 },
        { feature: 'Usability', votes: 764 },
        { feature: 'Updates', votes: 692 }
      ],
      disliked: [
        { feature: 'Stability', votes: 412 },
        { feature: 'Battery Usage', votes: 367 },
        { feature: 'Storage', votes: 298 },
        { feature: 'Notifications', votes: 256 },
        { feature: 'Support', votes: 187 }
      ]
    },
    reviewExamples: feedbackExamples,
    storeType: 'apple',
    reviewsData: [],
  };
};

export async function POST(request: Request) {
  try {
    console.log('App Store API接收到请求，正在解析...');
    const body = await request.json();
    const { appName, language, country } = body;
    
    console.log(`请求应用: ${appName}, 语言: ${language || 'en'}, 国家: ${country || 'us'}`);
    
    if (!appName) {
      console.log('错误: 应用名称不能为空');
      return new NextResponse(
        JSON.stringify({ error: '应用名称不能为空' }),
        { status: 400 }
      );
    }
    
    try {
      // 尝试获取真实数据
      console.log('尝试获取真实App Store数据');
      const data = await getAppStoreData(appName, language || 'en', country || 'us');
      console.log('成功获取真实App Store数据');
      return NextResponse.json(data);
    } catch (error) {
      // 如果失败，返回错误信息
      console.error('获取真实App Store数据失败:', error);
      return new NextResponse(
        JSON.stringify({ error: (error as Error).message || '无法获取应用数据' }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('App Store API路由错误:', error);
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message || '发生未知错误' }),
      { status: 500 }
    );
  }
} 