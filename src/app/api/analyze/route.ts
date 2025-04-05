import { Language } from '@/contexts/LanguageContext';
import { NextResponse } from 'next/server';

// 由于还没有toggle-mode路由，先定义一个默认值
const useRealApi = true; // 始终尝试使用真实API

// 动态导入 app-store-scraper
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

// 导入我们的Google Play模拟数据
import googlePlayMock from '@/mocks/google-play-mock';

// 类型定义
interface HttpsResponse {
  statusCode: number;
  on(event: string, callback: (chunk?: any) => void): void;
}

interface HttpsRequest {
  on(event: string, callback: (error?: Error) => void): void;
  destroy(): void;
  end(): void;
}

// 在Node.js中测试连接到Google Play
async function testGooglePlayConnection(): Promise<boolean> {
  try {
    console.log('测试连接到Google Play...');
    // 简单的HTTPS请求来测试连接
    const https = require('https');
    
    return new Promise((resolve, reject) => {
      const req: HttpsRequest = https.request({
        method: 'GET',
        hostname: 'play.google.com',
        path: '/store',
        timeout: 5000
      }, (res: HttpsResponse) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          console.log('连接到Google Play成功');
          resolve(true);
        } else {
          console.log(`连接到Google Play失败，状态码: ${res.statusCode}`);
          reject(new Error(`连接失败，状态码: ${res.statusCode}`));
        }
        
        res.on('data', () => {});
        res.on('end', () => {});
      });
      
      req.on('error', (error?: Error) => {
        console.log('连接到Google Play错误:', error?.message || 'Unknown error');
        reject(error || new Error('Unknown error'));
      });
      
      req.on('timeout', () => {
        req.destroy();
        console.log('连接到Google Play超时');
        reject(new Error('连接超时'));
      });
      
      req.end();
    });
  } catch (error) {
    console.error('测试Google Play连接时出错:', error);
    return false;
  }
}

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
}

// 为第三方库定义类型
interface AppStoreReview {
  id: string;
  userName: string;
  title: string;
  text: string;
  score: number;
  version: string;
  date: string;
  updated: string;
}

interface GooglePlayReview {
  id: string;
  userName: string;
  userImage: string;
  date: string;
  score: number;
  text: string;
  thumbsUp: number;
  replyDate: string | null;
  replyText: string | null;
  version: string;
  appVersion: string;
}

interface GooglePlayApp {
  appId: string;
  title: string;
  summary?: string;
  description: string;
  developer: string;
  developerId?: string;
  icon: string;
  score: number;
  ratings?: number;
  reviews?: number;
  version: string;
  released?: string;
  updated?: string;
}

interface AppStoreApp {
  id: number;
  appId?: string;
  title: string;
  description: string;
  developer: string;
  developerId?: string;
  icon: string;
  score: number;
  ratings?: number;
  reviews?: number;
  version: string;
  released?: string;
  updated?: string;
}

interface ReviewsResult {
  data: GooglePlayReview[];
  nextPaginationToken?: string;
}

// 为我们的mock库定义类型
interface MockGooglePlayResult {
  appId: string;
  title: string;
  summary: string;
  developer: string;
  developerId: string;
  icon: string;
  score: number;
  price: number;
  free: boolean;
}

// 尝试获取真实数据
const fetchRealData = async (appName: string, language: Language, country: string = 'us'): Promise<AppReviewsAnalysis> => {
  console.log(`获取App Store真实数据: ${appName}, 语言: ${language}, 国家: ${country}`);
  
  // 获取App Store数据
  const appStore = require('app-store-scraper');
  console.log('成功加载App Store API');
  
  // 搜索应用
  console.log(`开始搜索应用: ${appName}`);
  const appStoreResults: AppStoreApp[] = await appStore.search({
    term: appName,
    num: 5,
    lang: language
  });
  
  console.log(`搜索结果: App Store找到 ${appStoreResults.length} 个结果`);
  
  if (appStoreResults.length === 0) {
    throw new Error('未找到匹配的应用');
  }
  
  // 获取第一个匹配的应用详情
  const appId = appStoreResults[0].id;
  const appStoreApp = await appStore.app({ id: appId, lang: language });
  console.log('获取到App Store应用详情:', appStoreApp.title);
  
  // 获取指定国家的评论
  let appStoreReviews: AppStoreReview[] = [];
  
  // 根据用户选择的国家获取评论
  try {
    console.log(`开始获取${country}地区的App Store评论...`);
    
    // 获取多页评论
    const maxPages = 5; // 最多获取5页评论
    for (let page = 1; page <= maxPages; page++) {
      try {
        const reviewsResult = await appStore.reviews({
          id: appStoreApp.id,
          country: country,
          sort: appStore.sort.RECENT,
          page: page
        });
        
        if (reviewsResult && reviewsResult.length > 0) {
          console.log(`获取到${country}地区第${page}页的${reviewsResult.length}条评论`);
          appStoreReviews = appStoreReviews.concat(reviewsResult);
          
          // 如果收集了足够多的评论，就停止
          if (appStoreReviews.length >= 150) {
            console.log(`已获取足够的评论(${appStoreReviews.length}条)，停止获取更多页面`);
            break;
          }
        } else {
          console.log(`${country}地区没有更多评论，跳过剩余页面`);
          break; // 如果当前页没有评论，跳出分页循环
        }
      } catch (pageError) {
        console.error(`获取${country}地区第${page}页评论失败:`, pageError);
        break; // 如果获取某页失败，停止获取更多页面
      }
    }
  } catch (countryError) {
    console.error(`获取${country}地区评论失败:`, countryError);
    throw new Error(`无法获取${country}地区的评论数据`);
  }
  
  console.log(`总共获取到 ${appStoreReviews.length} 条App Store评论`);
  
  if (appStoreReviews.length === 0) {
    throw new Error(`未能获取到${country}地区的任何评论数据`);
  }
  
  // 分析评论，提取特性
  const appStoreFeatures = analyzeReviews(appStoreReviews);
  
  // 当前日期
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // 构建响应
  const appInfo: AppInfo = {
    appId: appStoreApp.appId || appStoreApp.id.toString(),
    title: appStoreApp.title,
    summary: appStoreApp.description.substring(0, 100) + '...',
    developer: appStoreApp.developer,
    developerId: appStoreApp.developerId || 'unknown',
    icon: appStoreApp.icon,
    score: appStoreApp.score,
    ratings: appStoreApp.ratings || 0,
    reviews: appStoreApp.reviews || 0,
    currentVersion: appStoreApp.version,
    released: appStoreApp.released || 'Unknown',
    updated: appStoreApp.updated || 'Unknown',
    appLink: `https://apps.apple.com/app/id${appStoreApp.id}`
  };
  
  // 提取评论例子
  const reviewExamples = extractAppStoreReviewExamples(appStoreReviews);
  
  const result: AppReviewsAnalysis = {
    appInfo,
    dateRange: {
      startDate: sixMonthsAgo.toISOString().split('T')[0],
      endDate: now.toISOString().split('T')[0],
    },
    appStore: appStoreFeatures.liked.length > 0 ? {
      liked: appStoreFeatures.liked,
      disliked: appStoreFeatures.disliked
    } : undefined,
    reviewExamples
  };
  
  return result;
};

// 分析评论，提取特性
function analyzeReviews(reviews: AppStoreReview[]): { liked: Feature[], disliked: Feature[] } {
  // 关键词分类
  const keywords = {
    liked: {
      '界面': 0, '设计': 0, 'UI': 0, '美观': 0, '颜值': 0,
      '功能': 0, '特性': 0, '好用': 0, '实用': 0, '强大': 0,
      '简单': 0, '方便': 0, '易用': 0, '直观': 0, '流畅': 0,
      '速度': 0, '快': 0, '效率': 0, '优化': 0, '稳定': 0
    } as Record<string, number>,
    disliked: {
      '崩溃': 0, '闪退': 0, '卡': 0, '死机': 0, '不稳定': 0,
      '卡顿': 0, '慢': 0, '迟钝': 0, '延迟': 0, '卡住': 0,
      '耗电': 0, '耗流量': 0, '占内存': 0, '发热': 0, '内存': 0,
      '难用': 0, '复杂': 0, '麻烦': 0, '不直观': 0, '差': 0,
      '广告': 0, '推送': 0, '隐私': 0, '权限': 0, '收费': 0
    } as Record<string, number>
  };
  
  // 对每条评论进行关键词匹配
  reviews.forEach(review => {
    const text = review.text.toLowerCase();
    const isPositive = review.score >= 4;
    const isNegative = review.score <= 2;
    
    if (isPositive) {
      // 对正面评论匹配喜欢的关键词
      for (const keyword in keywords.liked) {
        if (text.includes(keyword.toLowerCase())) {
          keywords.liked[keyword]++;
        }
      }
    } else if (isNegative) {
      // 对负面评论匹配不喜欢的关键词
      for (const keyword in keywords.disliked) {
        if (text.includes(keyword.toLowerCase())) {
          keywords.disliked[keyword]++;
        }
      }
    }
  });
  
  // 根据关键词出现频率将关键词合并为特性
  const featureMap: {
    liked: Record<string, string[]>,
    disliked: Record<string, string[]>
  } = {
    liked: {
      'UI/设计': ['界面', '设计', 'UI', '美观', '颜值'],
      '功能': ['功能', '特性', '好用', '实用', '强大'],
      '易用性': ['简单', '方便', '易用', '直观', '流畅'],
      '性能': ['速度', '快', '效率', '优化', '稳定']
    },
    disliked: {
      '稳定性': ['崩溃', '闪退', '卡', '死机', '不稳定'],
      '性能': ['卡顿', '慢', '迟钝', '延迟', '卡住'],
      '资源消耗': ['耗电', '耗流量', '占内存', '发热', '内存'],
      '用户体验': ['难用', '复杂', '麻烦', '不直观', '差'],
      '其他问题': ['广告', '推送', '隐私', '权限', '收费']
    }
  };
  
  // 计算每个特性类别的得票数
  const features = {
    liked: [] as Feature[],
    disliked: [] as Feature[]
  };
  
  for (const feature in featureMap.liked) {
    const votes = featureMap.liked[feature].reduce((total: number, keyword: string) => {
      return total + (keywords.liked[keyword] || 0);
    }, 0);
    
    if (votes > 0) {
      features.liked.push({ feature, votes });
    }
  }
  
  for (const feature in featureMap.disliked) {
    const votes = featureMap.disliked[feature].reduce((total: number, keyword: string) => {
      return total + (keywords.disliked[keyword] || 0);
    }, 0);
    
    if (votes > 0) {
      features.disliked.push({ feature, votes });
    }
  }
  
  // 如果没有找到足够的特性，添加一些基于评分分布的特性
  if (features.liked.length === 0) {
    const positiveCount = reviews.filter(review => review.score >= 4).length;
    if (positiveCount > 0) {
      features.liked.push({ feature: '整体满意度', votes: positiveCount });
    }
  }
  
  if (features.disliked.length === 0) {
    const negativeCount = reviews.filter(review => review.score <= 2).length;
    if (negativeCount > 0) {
      features.disliked.push({ feature: '整体不满意度', votes: negativeCount });
    }
  }
  
  // 按投票数排序
  features.liked.sort((a, b) => b.votes - a.votes);
  features.disliked.sort((a, b) => b.votes - a.votes);
  
  return {
    liked: features.liked,
    disliked: features.disliked
  };
}

// 从App Store评论中提取例子
function extractAppStoreReviewExamples(appStoreReviews: AppStoreReview[]): Record<string, string[]> {
  const examples: Record<string, string[]> = {};
  
  // 从App Store评论中提取
  if (appStoreReviews && appStoreReviews.length > 0) {
    // 筛选评分4-5星的积极评论
    const positiveReviews = appStoreReviews.filter(review => review.score >= 4);
    if (positiveReviews.length > 0) {
      // UI/设计方面的积极评论
      examples['appstore_liked_UI/Design'] = positiveReviews
        .filter(review => review.text.includes('界面') || review.text.includes('设计') || 
                review.text.includes('UI') || review.text.includes('design') ||
                review.text.includes('颜值') || review.text.includes('外观'))
        .slice(0, 5)
        .map(review => review.text);
      
      // 功能方面的积极评论
      examples['appstore_liked_Features'] = positiveReviews
        .filter(review => review.text.includes('功能') || review.text.includes('特性') || 
                review.text.includes('feature') || review.text.includes('function'))
        .slice(0, 5)
        .map(review => review.text);
      
      // 用户体验方面的积极评论
      examples['appstore_liked_UserExperience'] = positiveReviews
        .filter(review => review.text.includes('体验') || review.text.includes('使用') || 
                review.text.includes('方便') || review.text.includes('简单') ||
                review.text.includes('experience') || review.text.includes('easy'))
        .slice(0, 5)
        .map(review => review.text);
    }
    
    // 筛选评分1-2星的消极评论
    const negativeReviews = appStoreReviews.filter(review => review.score <= 2);
    if (negativeReviews.length > 0) {
      // 稳定性方面的消极评论
      examples['appstore_disliked_Stability'] = negativeReviews
        .filter(review => review.text.includes('崩溃') || review.text.includes('闪退') || 
                review.text.includes('crash') || review.text.includes('bug') ||
                review.text.includes('卡') || review.text.includes('死'))
        .slice(0, 5)
        .map(review => review.text);
      
      // 性能方面的消极评论
      examples['appstore_disliked_Performance'] = negativeReviews
        .filter(review => review.text.includes('慢') || review.text.includes('卡顿') || 
                review.text.includes('耗电') || review.text.includes('卡') ||
                review.text.includes('slow') || review.text.includes('lag'))
        .slice(0, 5)
        .map(review => review.text);
      
      // 用户体验方面的消极评论
      examples['appstore_disliked_UserExperience'] = negativeReviews
        .filter(review => review.text.includes('难用') || review.text.includes('体验') || 
                review.text.includes('麻烦') || review.text.includes('复杂') ||
                review.text.includes('usability') || review.text.includes('complicated'))
        .slice(0, 5)
        .map(review => review.text);
    }
  }
  
  // 移除没有找到评论的类别
  for (const key in examples) {
    if (examples[key].length === 0) {
      delete examples[key];
    }
  }
  
  return examples;
}

export async function POST(request: Request) {
  try {
    console.log('API接收到请求，正在解析...');
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
      const data = await fetchRealData(appName, language || 'en', country || 'us');
      console.log('真实数据获取完成');
      return NextResponse.json(data);
    } catch (error) {
      console.error('获取真实数据失败:', error);
      // 返回错误信息，不使用模拟数据
      return new NextResponse(
        JSON.stringify({ error: (error as Error).message || '无法获取应用数据' }),
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('API路由错误:', error);
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message || '发生未知错误' }),
      { status: 500 }
    );
  }
} 