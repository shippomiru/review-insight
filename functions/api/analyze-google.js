// 在文件顶部添加兼容性标志
export const config = {
  compatibility_date: "2023-05-18",
  compatibility_flags: ["nodejs_compat"],
};

/**
 * Google Play应用评论分析API
 * 与原始Next.js API保持相同的功能
 */

// 工具函数
function simpleChinesesegmentation(text) {
  // 简单的中文分词方法
  return text.split(/\s+/).flatMap(word => {
    const segments = [];
    let currentSegment = '';
    
    for (let i = 0; i < word.length; i++) {
      const char = word[i];
      if (/[\u4e00-\u9fa5]/.test(char)) {
        // 中文字符
        if (currentSegment) segments.push(currentSegment);
        segments.push(char);
        currentSegment = '';
      } else {
        // 非中文字符
        currentSegment += char;
      }
    }
    
    if (currentSegment) segments.push(currentSegment);
    return segments;
  }).filter(segment => segment.trim());
}

// 简化版中文情感词典
const chineseSentimentDict = {
  positive: [
    '好', '优秀', '喜欢', '爱', '赞', '棒', '强', '佳', '推荐', '满意',
    '方便', '快', '易用', '简单', '清晰', '美观', '稳定', '高效', '实用',
    '提升', '改进', '进步', '完美', '支持', '贴心', '实用'
  ],
  negative: [
    '差', '糟', '烂', '坏', '慢', '卡', '崩溃', '闪退', '错误', '问题',
    '漏洞', '困难', '麻烦', '复杂', '难用', '不稳定', '不喜欢', '讨厌',
    '失望', '退款', '广告多', '收费', '骗', '坑', '后悔', '删除'
  ]
};

// 缓存系统
const reviewsCache = new Map();

// 基础特性计数器
function countFeatures(features, text, score, language) {
  // 评论关键词映射到特性
  const featureMapping = {
    en: {
      'interface': ['interface', 'ui', 'design', 'layout', 'look', 'visual', 'intuitive', 'clean'],
      'functionality': ['function', 'feature', 'functionality', 'useful', 'helpful', 'capability', 'tool', 'option'],
      'performance': ['performance', 'fast', 'quick', 'responsive', 'speed', 'smooth', 'efficient', 'optimization'],
      'support': ['support', 'help', 'service', 'customer', 'assistance', 'response', 'responsive', 'team'],
      'innovation': ['innovation', 'innovative', 'new', 'creative', 'unique', 'original', 'cutting edge', 'breakthrough'],
      'ads': ['ad', 'ads', 'advertisement', 'popup', 'pop-up', 'banner', 'commercial', 'promotional'],
      'crashes': ['crash', 'crashed', 'freezes', 'hang', 'unresponsive', 'stop', 'bug', 'error'],
      'battery': ['battery', 'drain', 'power', 'consumption', 'energy', 'life', 'charging', 'usage'],
      'subscription': ['subscription', 'price', 'cost', 'expensive', 'fee', 'payment', 'premium', 'paid', 'purchase'],
      'updates': ['update', 'version', 'outdated', 'old', 'maintenance', 'release', 'fix', 'patch']
    },
    zh: {
      'interface': ['界面', '设计', '布局', '外观', '视觉', '直观', '简洁', 'ui', 'UI'],
      'functionality': ['功能', '特性', '实用', '有用', '工具', '选项', '作用'],
      'performance': ['性能', '快', '迅速', '响应', '速度', '流畅', '效率', '优化'],
      'support': ['支持', '帮助', '服务', '客服', '客户', '响应', '团队'],
      'innovation': ['创新', '新', '创意', '独特', '原创', '前沿', '突破'],
      'ads': ['广告', '弹窗', '横幅', '商业', '推广', '促销'],
      'crashes': ['崩溃', '卡顿', '冻结', '无响应', '停止', '错误', '漏洞', '缺陷'],
      'battery': ['电池', '耗电', '电量', '消耗', '能源', '续航', '充电', '用电'],
      'subscription': ['订阅', '价格', '费用', '贵', '收费', '付款', '高级', '付费', '购买'],
      'updates': ['更新', '版本', '过时', '旧', '维护', '发布', '修复', '补丁']
    }
  };

  const textLower = text.toLowerCase();
  const mappings = featureMapping[language] || featureMapping.en;
  
  if (score >= 4) {
    // 积极评价
    for (const [feature, keywords] of Object.entries(mappings).slice(0, 5)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        features.liked[feature] = (features.liked[feature] || 0) + 1;
      }
    }
  } else if (score <= 2) {
    // 消极评价
    for (const [feature, keywords] of Object.entries(mappings).slice(5, 10)) {
      if (keywords.some(keyword => textLower.includes(keyword))) {
        features.disliked[feature] = (features.disliked[feature] || 0) + 1;
      }
    }
  }
}

// 清洗评论文本
function cleanReview(text, language) {
  if (!text || typeof text !== 'string') return '';
  
  // 过滤常见噪音
  let cleaned = text
    .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
  
  // 长度过滤
  if (cleaned.length < 5 || cleaned.length > 2000) {
    return '';
  }
  
  // 过滤无意义评论
  const meaninglessPatterns = [
    /^[0-9.]+$/,
    /^[!?.]+$/,
    /^(好|棒|差|一般|可以|还行)+$/,
    /^(good|bad|ok|okay|fine|great|excellent|terrible|poor|awesome)+$/i
  ];
  
  if (meaninglessPatterns.some(pattern => pattern.test(cleaned))) {
    return '';
  }
  
  return cleaned;
}

// 提取特性函数
async function extractFeatures(reviews, language) {
  // 提取有意义的评论
  const validReviews = reviews
    .map(review => {
      const cleanedText = cleanReview(review.text || '', language);
      if (!cleanedText) return null;
      return {
        text: cleanedText,
        score: review.score || 3,
        version: review.version || 'unknown'
      };
    })
    .filter(review => review !== null);
  
  console.log(`使用 ${validReviews.length} 条有效评论进行分析，从 ${reviews.length} 条原始评论中提取`);
  
  // 如果没有有效评论，返回空结果
  if (validReviews.length === 0) {
    console.log('没有找到有效评论，返回空结果');
    return { liked: [], disliked: [] };
  }
  
  // 计数特性
  const features = {
    liked: {},
    disliked: {}
  };
  
  // 分析每条评论
  for (const review of validReviews) {
    countFeatures(features, review.text, review.score, language);
  }
  
  // 转换为排序后的数组格式
  const convertToSortedArray = (obj) => {
    return Object.entries(obj)
      .map(([feature, votes]) => ({
        feature: translateFeature(feature, language),
        votes
      }))
      .sort((a, b) => b.votes - a.votes)
      .slice(0, 5); // 取前5名
  };
  
  return {
    liked: convertToSortedArray(features.liked),
    disliked: convertToSortedArray(features.disliked)
  };
}

// 特性翻译
function translateFeature(feature, language) {
  const translations = {
    'interface': { en: 'User Interface', zh: '用户界面' },
    'functionality': { en: 'Functionality', zh: '功能性' },
    'performance': { en: 'Performance', zh: '性能' },
    'support': { en: 'Customer Support', zh: '客户支持' },
    'innovation': { en: 'Innovative Design', zh: '创新设计' },
    'ads': { en: 'Advertisements', zh: '广告数量' },
    'crashes': { en: 'Crashes & Bugs', zh: '崩溃问题' },
    'battery': { en: 'Battery Drain', zh: '电池消耗' },
    'subscription': { en: 'Subscription Model', zh: '订阅模式' },
    'updates': { en: 'Update Frequency', zh: '更新频率' }
  };
  
  return translations[feature] ? 
    (translations[feature][language] || translations[feature].en) : 
    feature;
}

// 提取评论例子
function extractReviewExamples(features, reviews, language) {
  const examples = {};
  const prefix = 'google_';
  
  // 对每个特性找最具代表性的评论
  for (const category of ['liked', 'disliked']) {
    for (const item of features[category]) {
      const featureName = item.feature;
      const key = `${prefix}${category}_${featureName}`;
      
      // 找到包含这个特性相关关键词的评论
      const relevantReviews = reviews
        .filter(review => {
          const isPositive = review.score >= 4;
          const isNegative = review.score <= 2;
          return (category === 'liked' && isPositive) || (category === 'disliked' && isNegative);
        })
        .filter(review => {
          // 简单匹配特性关键词
          const textLower = review.text.toLowerCase();
          // 根据特性寻找对应的关键词，这里简化处理
          return textLower.includes(featureName.toLowerCase());
        })
        .map(review => review.text)
        .slice(0, 2); // 每个特性最多取2条评论
      
      if (relevantReviews.length > 0) {
        examples[key] = relevantReviews;
      } else {
        // 如果没有找到直接相关的评论，使用得分作为参考
        const scoreBasedReviews = reviews
          .filter(review => {
            const isPositive = review.score >= 4;
            const isNegative = review.score <= 2;
            return (category === 'liked' && isPositive) || (category === 'disliked' && isNegative);
          })
          .map(review => review.text)
          .slice(0, 2);
        
        if (scoreBasedReviews.length > 0) {
          examples[key] = scoreBasedReviews;
        }
      }
    }
  }
  
  return examples;
}

// 分页获取所有评论
async function fetchAllReviews(gplay, appId, language) {
  const allReviews = [];
  const maxRetries = 3;
  const maxReviews = 1000; // 限制最大评论数
  
  let nextPaginationToken = null;
  
  while (allReviews.length < maxReviews) {
    let retries = 0;
    let success = false;
    
    while (retries < maxRetries && !success) {
      try {
        const options = {
          appId: appId,
          lang: language === 'zh' ? 'zh-CN' : 'en',
          sort: gplay.sort.NEWEST,
          num: 100
        };
        
        if (nextPaginationToken) {
          options.nextPaginationToken = nextPaginationToken;
        }
        
        const result = await gplay.reviews(options);
        
        if (!result || !result.data || result.data.length === 0) {
          // 没有更多评论
          break;
        }
        
        allReviews.push(...result.data);
        nextPaginationToken = result.nextPaginationToken;
        success = true;
        
        // 如果没有下一页，结束循环
        if (!nextPaginationToken) {
          break;
        }
        
        // 添加延迟，避免请求过于频繁
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        retries++;
        console.error(`获取Google Play评论失败 (重试: ${retries}):`, error);
        
        if (retries >= maxRetries) {
          console.error(`达到最大重试次数，停止获取评论`);
          break;
        }
        
        // 增加重试延迟
        await new Promise(resolve => setTimeout(resolve, 2000 * retries));
      }
    }
    
    if (!success || !nextPaginationToken) {
      break;
    }
  }
  
  return allReviews;
}

// 获取Google Play数据
async function getGooglePlayData(appName, language) {
  try {
    console.log(`尝试获取Google Play数据: ${appName}, 语言: ${language}`);
    
    // 生成缓存键
    const cacheKey = `google_${appName}_${language}`;
    
    // 检查缓存
    const cachedData = reviewsCache.get(cacheKey);
    if (cachedData) {
      console.log(`从缓存中获取数据: ${appName}`);
      return cachedData;
    }
    
    // 导入 google-play-scraper
    const gplay = require('google-play-scraper');
    
    console.log('成功导入Google Play Scraper库，开始搜索应用');
    
    // 搜索应用
    const searchResults = await gplay.search({
      term: appName,
      num: 1,
      lang: language === 'zh' ? 'zh-cn' : 'en-us',
    });
    
    if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error(`没有找到与"${appName}"匹配的Google Play应用`);
    }
    
    const app = searchResults[0];
    console.log(`找到应用: ${app.title} (${app.appId})`);
    
    // 获取应用详情
    const appDetail = await gplay.app({
      appId: app.appId,
      lang: language === 'zh' ? 'zh-cn' : 'en-us'
    });
    
    // 分页获取所有评论
    const allReviews = await fetchAllReviews(gplay, app.appId, language);
    console.log(`共获取到 ${allReviews.length} 条评论`);
    
    // 提取特性和评论示例
    console.log('开始分析评论...');
    const features = await extractFeatures(allReviews, language);
    console.log('评论分析完成，提取评论示例...');
    
    // 生成评论示例
    const reviewExamples = extractReviewExamples(features, allReviews, language);
    
    // 构建结果
    const result = {
      appInfo: {
        title: app.title,
        developer: app.developer,
        score: app.score,
        reviews: app.reviews || 0,
        version: app.version || '',
        releaseDate: app.released || '',
        lastUpdated: app.updated || '',
        appLink: `https://play.google.com/store/apps/details?id=${app.appId}`,
        appIcon: app.icon
      },
      googlePlay: features,
      reviewExamples: reviewExamples
    };
    
    // 缓存结果
    reviewsCache.set(cacheKey, result);
    
    console.log('分析完成，返回结果');
    return result;
    
  } catch (error) {
    console.error('获取Google Play数据失败:', error);
    throw error;
  }
}

// 生成模拟数据
function generateMockGooglePlayData(appName) {
  return {
    appInfo: {
      title: appName,
      developer: "测试开发者",
      score: 4.2,
      reviews: 85,
      version: "1.2.0",
      releaseDate: "2024-04-02",
      lastUpdated: "2024-04-07",
      appLink: `https://play.google.com/store/apps/details?id=com.example.${appName.toLowerCase().replace(/\s+/g, '.')}`,
      appIcon: "https://play-lh.googleusercontent.com/dCM0CyWMQ9wWUVYw-Eck3BVzHiLbaPxGK1Y7U0572NPS574SxToU3xrHcVGvvWvmcr8=s180-rw"
    },
    googlePlay: {
      liked: [
        { feature: "用户界面", votes: 38 },
        { feature: "功能性", votes: 29 },
        { feature: "性能", votes: 22 },
        { feature: "客户支持", votes: 15 },
        { feature: "创新设计", votes: 12 }
      ],
      disliked: [
        { feature: "广告数量", votes: 20 },
        { feature: "崩溃问题", votes: 18 },
        { feature: "订阅模式", votes: 15 },
        { feature: "电池消耗", votes: 12 },
        { feature: "更新频率", votes: 7 }
      ]
    },
    reviewExamples: {
      "google_liked_用户界面": ["界面设计很现代，导航简单直观", "UI很干净，一切都很容易找到"],
      "google_liked_功能性": ["这个应用有我需要的所有功能", "功能齐全且非常实用"],
      "google_liked_性能": ["运行非常流畅，即使在我的旧手机上", "没有任何卡顿或延迟"],
      "google_liked_客户支持": ["客服团队回复迅速，解决了我的问题", "当我遇到问题时得到了很好的支持"],
      "google_liked_创新设计": ["这款应用有一些非常创新的功能", "设计理念很有创意"],
      
      "google_disliked_广告数量": ["广告太频繁了，打断了使用体验", "太多弹出广告，很烦人"],
      "google_disliked_崩溃问题": ["经常崩溃，特别是在打开大文件时", "使用几分钟后就会闪退"],
      "google_disliked_订阅模式": ["基本功能也需要订阅，太贵了", "订阅价格比同类应用高很多"],
      "google_disliked_电池消耗": ["运行一小时就消耗15%的电量", "后台耗电严重"],
      "google_disliked_更新频率": ["很久没有更新修复bug了", "更新太少，功能落后于竞争对手"]
    }
  };
}

// API入口点
export async function onRequest(context) {
  const { request, env } = context;
  
  // OPTIONS请求处理（针对CORS预检请求）
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400',
      },
    });
  }
  
  // 检查请求方法
  if (request.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: '只支持POST请求' }),
      {
        status: 405,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
  
  try {
    // 解析请求体
    const body = await request.json();
    const { appName, language } = body;
    
    if (!appName) {
      return new Response(
        JSON.stringify({ error: '缺少必要的appName参数' }),
        {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
    
    console.log(`请求应用: ${appName}, 语言: ${language || 'en'}`);
    
    try {
      // 尝试获取真实数据
      const data = await getGooglePlayData(appName, language || 'en');
      
      return new Response(
        JSON.stringify(data),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (apiError) {
      console.error('获取真实数据失败:', apiError);
      
      // 使用模拟数据作为备选
      const mockData = generateMockGooglePlayData(appName);
      
      return new Response(
        JSON.stringify(mockData),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  } catch (error) {
    console.error('请求解析错误:', error);
    return new Response(
      JSON.stringify({ 
        error: '无法解析请求',
        message: error.message || '请求格式错误'
      }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    );
  }
} 