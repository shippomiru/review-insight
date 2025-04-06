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

// 导入兼容的情感分析库
const Sentiment = require('sentiment');
const sentiment = new Sentiment();

// 请求频率限制类，遵循反爬最佳实践
class RateLimiter {
  private timestamps: number[] = [];
  private maxRequests: number;
  private timeWindow: number; // 毫秒
  
  constructor(maxRequests: number = 5, timeWindow: number = 60000) {
    this.maxRequests = maxRequests; // 默认每分钟最多5个请求
    this.timeWindow = timeWindow;   // 时间窗口（毫秒）
  }
  
  async waitIfNeeded(): Promise<void> {
    const now = Date.now();
    
    // 移除时间窗口外的时间戳
    this.timestamps = this.timestamps.filter(
      time => now - time < this.timeWindow
    );
    
    if (this.timestamps.length >= this.maxRequests) {
      // 计算需要等待的时间
      const oldestTimestamp = this.timestamps[0];
      const waitTime = this.timeWindow - (now - oldestTimestamp) + 100; // 额外等待100ms作为缓冲
      
      console.log(`请求频率过高，等待 ${waitTime}ms 后继续`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
    
    // 添加当前时间戳
    this.timestamps.push(Date.now());
  }
}

// 缓存管理，减少重复请求
class ReviewsCache {
  private cache = new Map<string, { data: any, timestamp: number }>();
  private TTL: number; // 缓存有效期（毫秒）
  
  constructor(ttlMinutes: number = 60) {
    this.TTL = ttlMinutes * 60 * 1000;
  }
  
  get(key: string): any | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }
    
    // 检查是否过期
    if (Date.now() - entry.timestamp > this.TTL) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }
  
  set(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    });
    
    // 记录缓存状态
    console.log(`缓存已更新，当前缓存条目数: ${this.cache.size}`);
  }
  
  // 清理过期缓存
  cleanup(): void {
    const now = Date.now();
    let expired = 0;
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > this.TTL) {
        this.cache.delete(key);
        expired++;
      }
    });
    
    if (expired > 0) {
      console.log(`已清理 ${expired} 条过期缓存，剩余 ${this.cache.size} 条`);
    }
  }
}

// 初始化全局工具
const rateLimiter = new RateLimiter(5, 60000); // 每分钟最多5个请求
const reviewsCache = new ReviewsCache(60); // 缓存1小时

// 获取随机用户代理，模拟不同浏览器环境
function getRandomUserAgent(): string {
  const userAgents = [
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 Edg/120.0.0.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
  ];
  
  return userAgents[Math.floor(Math.random() * userAgents.length)];
}

// 请求重试包装器，具有指数退避重试策略
async function fetchWithRetry<T>(
  fn: () => Promise<T>, 
  maxRetries: number = 3
): Promise<T> {
  let retries = 0;
  let lastError: any;
  
  while (retries <= maxRetries) {
    try {
      if (retries > 0) {
        console.log(`尝试第 ${retries} 次重试...`);
      }
      
      return await fn();
    } catch (error) {
      lastError = error;
      retries++;
      
      if (retries > maxRetries) {
        console.error(`已达到最大重试次数 (${maxRetries})，放弃请求`);
        break;
      }
      
      // 指数退避策略：2^重试次数 * 1000ms + 随机量
      const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
      console.log(`请求失败，等待 ${Math.round(delay)}ms 后重试: ${(error as Error).message}`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError;
}

// NLP处理相关常量与函数

// 中文脏词库 - 简化版
const chineseBadWords = ['垃圾', '傻逼', '废物', '狗屎', '滚蛋', '操你', '去死', '混蛋'];

// 中文情感词典
const chineseSentimentDict = {
  positive: [
    '喜欢', '满意', '好用', '方便', '实用', '强大', '优秀', '棒', '赞', '给力', 
    '完美', '精致', '易用', '流畅', '稳定', '高效', '快速', '出色', '推荐', '不错'
  ],
  negative: [
    '不喜欢', '不满意', '难用', '不方便', '垃圾', '卡顿', '崩溃', '闪退', '慢', '差', 
    '坑', '问题', '糟糕', '弱智', '无语', '恶心', '失望', '后悔', '不值', '坑爹'
  ]
};

// 特性关键词 - 扩展版本
const featureKeywords = {
  // 通讯和社交功能
  '聊天功能': ['chat', 'message', 'conversation', 'talk', 'communication', 'messaging', 'reply', 'respond', 'dialogue'],
  '群组功能': ['group', 'team', 'channel', 'community', 'collection', 'together', 'multiple', 'mass'],
  '语音通话': ['voice', 'call', 'audio call', 'phone', 'calling', 'dial', 'speaker'],
  '视频通话': ['video', 'video call', 'facetime', 'camera', 'face to face', 'meeting'],
  '朋友圈': ['moments', 'timeline', 'feed', 'post', 'share', 'status', 'update'],
  '分享功能': ['share', 'send', 'forward', 'distribute', 'spread'],
  
  // 实用工具
  '支付功能': ['pay', 'payment', 'wallet', 'transaction', 'purchase', 'buy', 'transfer', 'money'],
  '扫码功能': ['scan', 'qr', 'code', 'barcode', 'scanner'],
  '地图导航': ['map', 'location', 'navigation', 'direction', 'route', 'find', 'place'],
  '日程管理': ['calendar', 'schedule', 'appointment', 'reminder', 'event', 'plan', 'date'],
  '备忘录': ['note', 'memo', 'record', 'save', 'jot', 'write down'],
  
  // 媒体功能
  '照片分享': ['photo', 'image', 'picture', 'gallery', 'album', 'camera'],
  '视频编辑': ['video edit', 'clip', 'trim', 'cut', 'join', 'movie', 'filter'],
  '音乐播放': ['music', 'song', 'audio', 'play', 'listen', 'sound', 'track'],
  '文件传输': ['file', 'document', 'transfer', 'send file', 'attachment', 'upload', 'download'],
  
  // 隐私和安全
  '隐私设置': ['privacy', 'secure', 'hidden', 'protection', 'safe', 'confidential', 'secret'],
  '数据加密': ['encrypt', 'security', 'lock', 'protect', 'cipher', 'code', 'safe'],
  '账号安全': ['account', 'security', 'verification', 'authenticate', 'password', 'login', 'identity'],
  
  // 可访问性和使用体验
  '界面定制': ['customize', 'theme', 'appearance', 'layout', 'display', 'setting', 'preference'],
  '多语言支持': ['language', 'translate', 'localization', 'multilingual', 'international', 'region'],
  '离线功能': ['offline', 'no internet', 'without connection', 'local', 'no data', 'no wifi'],
  '电池优化': ['battery', 'power', 'energy', 'consumption', 'life', 'drain', 'saving'],
  
  // 小程序和扩展功能
  '小程序': ['mini program', 'mini app', 'applet', 'lightweight', 'plugin', 'extension'],
  '游戏中心': ['game', 'play', 'entertainment', 'arcade', 'fun', 'casual', 'gaming'],
  '健康功能': ['health', 'fitness', 'exercise', 'workout', 'activity', 'step', 'monitor'],
  '购物功能': ['shop', 'store', 'buy', 'purchase', 'mall', 'goods', 'item', 'product']
};

// 中文关键词 - 扩展版本
const chineseFeatureKeywords = {
  // 通讯和社交功能
  '聊天功能': ['聊天', '消息', '会话', '对话', '交流', '沟通', '私信', '回复', '聊天记录', '发言'],
  '群组功能': ['群', '群组', '群聊', '多人', '讨论组', '团队', '频道', '社区', '集体'],
  '语音通话': ['语音', '通话', '打电话', '音频', '通信', '音频通话', '通讯', '语音消息', '语音聊天'],
  '视频通话': ['视频', '视频通话', '视频聊天', '视频会议', '可视通话', '视频电话', '面对面通话', '摄像头'],
  '朋友圈': ['朋友圈', '动态', '状态', '时间线', '信息流', '发布', '分享', '点赞', '评论'],
  '分享功能': ['分享', '转发', '发送', '传播', '传递', '推送', '连接'],
  
  // 实用工具
  '支付功能': ['支付', '钱包', '转账', '付款', '收款', '交易', '财付通', '微信支付', '红包', '收付款'],
  '扫码功能': ['扫码', '扫描', '二维码', '条形码', '扫一扫', '识别码', 'QR'],
  '地图导航': ['地图', '定位', '导航', '位置', '方向', '路线', '查找', '地点', '附近', '周边'],
  '日程管理': ['日程', '日历', '提醒', '计划', '安排', '活动', '会议', '预约', '行程', '时间表'],
  '备忘录': ['备忘录', '笔记', '记录', '记事', '便签', '草稿', '摘要'],
  
  // 媒体功能
  '照片分享': ['照片', '图片', '相册', '图像', '拍照', '相机', '影集', '图库', '截图'],
  '视频编辑': ['视频编辑', '剪辑', '裁剪', '合成', '特效', '滤镜', '转场', '视频处理'],
  '音乐播放': ['音乐', '歌曲', '播放', '声音', '听歌', '曲目', '播放器', '音频', '背景音乐'],
  '文件传输': ['文件', '传输', '发送文件', '接收文件', '文档', '附件', '上传', '下载', '传递文件'],
  
  // 隐私和安全
  '隐私设置': ['隐私', '保密', '设置', '权限', '可见性', '不可见', '保护', '隐藏', '权限控制'],
  '数据加密': ['加密', '安全', '保护', '密码', '安全锁', '密钥', '安全通信', '隐私保护'],
  '账号安全': ['账号', '安全', '验证', '认证', '密码', '登录', '身份', '保护', '账户'],
  
  // 可访问性和使用体验
  '界面定制': ['界面', '外观', '主题', '皮肤', '定制', '个性化', '显示', '风格', '自定义', '布局'],
  '多语言支持': ['语言', '翻译', '多语言', '国际化', '本地化', '地区', '切换语言', '方言'],
  '离线功能': ['离线', '无网络', '无连接', '本地', '无数据', '无网', '不联网'],
  '电池优化': ['电池', '电量', '耗电', '省电', '续航', '电力', '省电模式', '电池寿命', '电量消耗'],
  
  // 小程序和扩展功能
  '小程序': ['小程序', '迷你应用', '小应用', '轻应用', '插件', '扩展', '第三方', '服务'],
  '游戏中心': ['游戏', '玩', '娱乐', '休闲', '趣味', '小游戏', '游玩', '益智'],
  '健康功能': ['健康', '运动', '健身', '锻炼', '活动', '步数', '监测', '健康码'],
  '购物功能': ['购物', '商店', '买', '购买', '商城', '商品', '产品', '电商', '网购', '下单']
};

// 功能同义词映射，用于归一化处理
const featureSynonyms: Record<string, string> = {
  // 聊天和社交功能
  '微信聊天': '聊天功能',
  '信息': '聊天功能',
  '聊天记录': '聊天功能', 
  '群聊': '群组功能',
  '创建群': '群组功能',
  '视频电话': '视频通话',
  '视频会议': '视频通话',
  '语音信息': '语音通话',
  '语音留言': '语音通话',
  '状态': '朋友圈',
  '动态': '朋友圈',
  '转发': '分享功能',
  
  // 支付和实用功能
  '微信支付': '支付功能',
  '钱包': '支付功能',
  '转账': '支付功能',
  '红包': '支付功能',
  '二维码': '扫码功能',
  '扫一扫': '扫码功能',
  '位置共享': '地图导航',
  '定位': '地图导航',
  '日历': '日程管理',
  '提醒': '日程管理',
  '笔记': '备忘录',
  
  // 媒体功能
  '相册': '照片分享',
  '图片': '照片分享',
  '拍照': '照片分享',
  '视频剪辑': '视频编辑',
  '视频处理': '视频编辑',
  '听歌': '音乐播放',
  '传文件': '文件传输',
  '发送文件': '文件传输',
  
  // 安全和隐私
  '隐私': '隐私设置',
  '安全设置': '账号安全',
  '密码保护': '账号安全',
  '指纹': '账号安全',
  '面容识别': '账号安全',
  
  // 界面和体验
  '换肤': '界面定制',
  '主题': '界面定制',
  '多语言': '多语言支持',
  '国际化': '多语言支持',
  '省电': '电池优化',
  '续航': '电池优化',
  
  // 扩展功能
  '微信小程序': '小程序',
  '小游戏': '游戏中心',
  '运动': '健康功能',
  '步数': '健康功能',
  '商城': '购物功能',
  '电商': '购物功能'
};

// 简单的中文分词函数
function simpleChinesesegmentation(text: string): string[] {
  // 简单分词：按常见标点和空格分割，然后按2-4个字符长度划分
  const segments: string[] = [];
  const parts = text.split(/[\s,.!?;:"'，。！？；：""''、]/);
  
  for (const part of parts) {
    if (!part) continue;
    
    // 对于较长的片段，尝试2-4字符分词
    if (part.length > 4) {
      for (let i = 0; i < part.length; i += 2) {
        const segment = part.substring(i, Math.min(i + 4, part.length));
        if (segment) segments.push(segment);
      }
    } else {
      segments.push(part);
    }
  }
  
  return segments;
}

// 简单的分词函数，用于英文
function simpleTokenize(text: string): string[] {
  // 移除标点符号并分割
  return text.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(Boolean);
}

// 评论清洗函数，过滤低质量评论
function cleanReview(text: string, language: Language): string | null {
  if (!text) return null;
  
  // 检查评论长度
  if ((language === 'zh' && text.length < 10) || (language === 'en' && text.length < 5)) {
    return null; // 太短的评论直接过滤掉
  }
  
  // 中文脏词检查
  if (language === 'zh' && chineseBadWords.some(word => text.includes(word))) {
    return null;
  }
  
  // 过滤低信息量评论（如纯表情、重复字符等）
  const repeatedPattern = /(.)\1{5,}/;
  if (repeatedPattern.test(text)) {
    return null;
  }
  
  // 过滤掉纯数字或符号的评论
  const alphaNumericContent = text.replace(/[^a-zA-Z0-9\u4e00-\u9fa5]/g, '');
  if (alphaNumericContent.length < text.length * 0.5) {
    return null;
  }
  
  return text;
}

// 分析评论情感
function analyzeSentiment(text: string, language: Language): { score: number, comparative: number } {
  if (language === 'en') {
    // 英文情感分析
    const result = sentiment.analyze(text);
    return {
      score: result.score,
      comparative: result.comparative
    };
  } else {
    // 中文情感分析
    let score = 0;
    
    // 使用简单分词
    const segments = simpleChinesesegmentation(text);
    
    // 计算情感得分
    for (const word of segments) {
      if (chineseSentimentDict.positive.some(term => word.includes(term))) {
        score += 1;
      } else if (chineseSentimentDict.negative.some(term => word.includes(term))) {
        score -= 1;
      }
    }
    
    // 标准化得分
    return {
      score: score,
      comparative: score / (segments.length || 1)
    };
  }
}

// 提取评论中的关键功能
function extractKeyFeatures(text: string, language: Language): string[] {
  const features = new Set<string>();
  
  if (language === 'en') {
    // 英文关键词提取
    const tokens = simpleTokenize(text);
    const lowerText = text.toLowerCase();
    
    // 检查每个特性关键词
    Object.entries(featureKeywords).forEach(([feature, keywords]) => {
      if (keywords.some(keyword => 
        tokens.includes(keyword) || 
        lowerText.includes(keyword) ||
        // 检查包含词组的情况，例如"video call"
        (keyword.includes(' ') && lowerText.includes(keyword))
      )) {
        features.add(feature);
      }
    });
  } else {
    // 中文关键词提取
    // 检查每个特性关键词
    Object.entries(chineseFeatureKeywords).forEach(([feature, keywords]) => {
      if (keywords.some(keyword => text.includes(keyword))) {
        features.add(feature);
      }
    });
    
    // 检查常见同义词
    Object.entries(featureSynonyms).forEach(([synonym, feature]) => {
      if (text.includes(synonym)) {
        features.add(feature);
      }
    });
  }
  
  // 提取更具体的功能描述
  const specificFeaturePatterns = {
    zh: [
      // 正则匹配模式，寻找更具体的功能描述
      { pattern: /([^，。！？；]+)(功能|体验)很(好|棒|赞|差|糟)/g, group: 1 },
      { pattern: /(喜欢|讨厌|不喜欢|想要|需要)([^，。！？；]+)(功能|特性)/g, group: 2 },
      { pattern: /([^，。！？；]+)做得(不错|很好|一般|很差)/g, group: 1 },
      { pattern: /希望(能够|可以)?(增加|改进|优化|提供)([^，。！？；]+)/g, group: 3 },
      { pattern: /([^，。！？；]+)用起来(很|非常)?(方便|好用|难用|卡顿)/g, group: 1 }
    ],
    en: [
      // 英文匹配模式
      { pattern: /The ([^,.!?;]+) (feature|function) is (good|great|bad|terrible)/gi, group: 1 },
      { pattern: /I (like|love|hate|dislike) the ([^,.!?;]+) (feature|function)/gi, group: 2 },
      { pattern: /([^,.!?;]+) works (well|great|poorly|bad)/gi, group: 1 },
      { pattern: /wish (you could|they would) (add|improve|optimize) ([^,.!?;]+)/gi, group: 3 },
      { pattern: /([^,.!?;]+) is (very|really)? (convenient|easy|difficult|laggy) to use/gi, group: 1 }
    ]
  };
  
  // 应用正则模式提取更具体的功能
  const patterns = language === 'zh' ? specificFeaturePatterns.zh : specificFeaturePatterns.en;
  for (const { pattern, group } of patterns) {
    let match;
    // 重置正则表达式的lastIndex
    pattern.lastIndex = 0;
    
    while ((match = pattern.exec(text)) !== null) {
      if (match[group] && match[group].length > 1) {
        // 过滤掉太短的词和常见的无意义词
        const specificFeature = match[group].trim();
        
        // 检查是否存在于任何已知特性的关键词中
        let foundInKeywords = false;
        
        // 避免添加太短或过于通用的功能描述
        if (
          (language === 'zh' && specificFeature.length > 1 && specificFeature.length < 10) || 
          (language === 'en' && specificFeature.length > 2 && specificFeature.length < 20)
        ) {
          // 尝试将具体功能映射到已知类别
          let mappedToCategory = false;
          
          // 检查是否可以映射到已知类别
          const allKeywords = language === 'zh' ? chineseFeatureKeywords : featureKeywords;
          for (const [feature, keywords] of Object.entries(allKeywords)) {
            if (keywords.some(kw => specificFeature.includes(kw) || kw.includes(specificFeature))) {
              features.add(feature);
              mappedToCategory = true;
              break;
            }
          }
          
          // 如果不能映射到预定义类别，考虑添加为新的具体功能
          if (!mappedToCategory && !specificFeature.match(/^(这个|那个|它|他|她|the|this|that|it|they)$/i)) {
            // 在这里可以选择是否添加未映射的具体功能
            // 为避免过多无意义的分类，暂时不添加
            // features.add(specificFeature);
          }
        }
      }
    }
  }
  
  return Array.from(features);
}

// 提取评论中的关键词
function extractKeywords(text: string, language: Language, count: number = 3): string[] {
  if (language === 'en') {
    // 英文关键词提取 - 基于词频统计
    const tokens = simpleTokenize(text);
    const wordFreq: Record<string, number> = {};
    
    // 计算词频
    for (const token of tokens) {
      if (token.length < 3) continue; // 忽略太短的词
      wordFreq[token] = (wordFreq[token] || 0) + 1;
    }
    
    // 按频率排序
    return Object.entries(wordFreq)
      .sort((a, b) => b[1] - a[1])
      .slice(0, count)
      .map(entry => entry[0]);
  } else {
    // 中文关键词提取 - 基于特征词匹配
    const allKeywords = Object.values(chineseFeatureKeywords).flat();
    const matches = allKeywords.filter(keyword => text.includes(keyword));
    
    // 如果匹配的关键词不够，添加一些长度合适的片段
    if (matches.length < count) {
      const segments = simpleChinesesegmentation(text)
        .filter(seg => seg.length >= 2 && seg.length <= 4)
        .slice(0, count - matches.length);
      
      return [...matches, ...segments].slice(0, count);
    }
    
    return matches.slice(0, count);
  }
}

// 定义分析结果的类型以支持自定义评论示例
type AnalysisResult = {
  liked: Feature[];
  disliked: Feature[];
  customReviewExamples?: Record<string, string[]>;
};

// 重写提取特性函数
const extractFeatures = async (
  reviews: any[],
  language: Language
): Promise<AnalysisResult> => {
  // 提取有意义的评论文本用于API分析
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
    .filter((review): review is {text: string; score: number; version: string} => review !== null)
    // 移除50条限制，使用所有清洗后的有效评论
    //.slice(0, 50); // 限制数量避免API成本过高
  
  console.log(`准备使用API分析 ${validReviews.length} 条有效评论，从 ${reviews.length} 条原始评论中提取`);
  
  // 如果没有有效评论，返回空结果
  if (validReviews.length === 0) {
    console.log('没有找到有效评论，返回空结果');
    return { liked: [], disliked: [] };
  }
  
  // 尝试使用外部API分析评论
  try {
    // 检查是否配置了API密钥环境变量
    const apiKey = process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || process.env.DEEPSEEK_API_KEY;
    if (!apiKey) {
      console.log('未配置API密钥环境变量，使用备选方案');
      return fallbackFeatureExtraction(reviews, language);
    }
    
    console.log('使用大模型API进行评论分析');
    
    // 构建请求体，传递评论内容给大模型API
    const reviewTexts = validReviews.map(review => 
      `[评分: ${review.score}/5] ${review.text}`
    ).join('\n\n');
    
    // 创建提示词
    const prompt = language === 'zh' ? `
作为一个应用评论分析专家，请从以下用户评论中提取用户提到的具体功能点并分析他们的情感倾向。
你需要提取用户真正在讨论的具体功能（如"视频通话"、"支付功能"等），而不是宽泛的类别（如"UI/Design"、"性能"等）。

根据评论判断用户喜欢哪些功能，不喜欢哪些功能，并统计每种情感的提及次数。

评论语言: 中文

评论内容:
${reviewTexts}

请以JSON格式返回分析结果，包含两个数组：
1. liked: 用户喜欢的功能列表，每项包含feature(功能名称)和votes(提及次数)
2. disliked: 用户不喜欢的功能列表，每项包含feature(功能名称)和votes(提及次数)

格式示例:
{
  "liked": [
    {"feature": "视频通话", "votes": 5},
    {"feature": "朋友圈", "votes": 3}
  ],
  "disliked": [
    {"feature": "启动速度", "votes": 4},
    {"feature": "电池消耗", "votes": 2}
  ]
}

请只返回JSON数据，不要有其他说明文字。
` : `
As an app review analysis expert, please extract specific features mentioned by users and analyze their sentiment from the following reviews.
You need to extract the specific features users are actually discussing (like "video calling", "payment function"), not broad categories (like "UI/Design", "performance").

Based on the reviews, determine which features users like and dislike, and count the mentions for each sentiment.

Review language: English

Review content:
${reviewTexts}

Please return the analysis results in JSON format, containing two arrays:
1. liked: list of features users like, each with feature (name) and votes (mention count)
2. disliked: list of features users dislike, each with feature (name) and votes (mention count)

Format example:
{
  "liked": [
    {"feature": "Video calling", "votes": 5},
    {"feature": "Social feed", "votes": 3}
  ],
  "disliked": [
    {"feature": "Loading speed", "votes": 4},
    {"feature": "Battery consumption", "votes": 2}
  ]
}

Please return only the JSON data without any other explanatory text.
`;

    // 根据可用的API密钥选择不同的API服务
    let analysisResult;
    
    if (process.env.OPENAI_API_KEY) {
      // 使用OpenAI API
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
          response_format: { type: "json_object" },
          temperature: 0.3
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OpenAI API请求失败: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      analysisResult = JSON.parse(result.choices[0].message.content);
      console.log('OpenAI API分析完成');
    } 
    else if (process.env.ANTHROPIC_API_KEY) {
      // 使用Anthropic Claude API
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': process.env.ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: "claude-instant-1.2",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.3,
          max_tokens: 1000
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Anthropic API请求失败: ${response.status} ${errorText}`);
      }
      
      const result = await response.json();
      analysisResult = JSON.parse(result.content[0].text);
      console.log('Anthropic API分析完成');
    }
    else if (process.env.DEEPSEEK_API_KEY) {
      // 使用Deepseek API通过SiliconFlow调用
      
      // 使用提供的自定义提示词模板
      const outputLanguage = language === 'zh' ? '中文' : 'English';
      const customPrompt = `你是一位专业的应用评论分析专家。我需要你分析以下应用评论，提取关键信息，并生成一份结构化的分析报告，用于网页展示。

==== 评论数据开始 ====
${reviewTexts}
==== 评论数据结束 ====

输出语言: ${outputLanguage}

请完成以下分析任务，并以JSON格式返回结果:

1. 用户喜欢的功能:
   - 识别最受欢迎的5个具体功能或方面
   - 提供每个功能的提及次数和最多2条代表性评论示例(如果不够就有多少提供多少)
   - 优先选择非常具体的功能，如"视觉化的时间显示"、"桌面小组件"、"自定义提醒音效"等
   - 评论示例保留原文，不要翻译

2. 用户不喜欢的功能:
   - 识别最常被投诉的5个功能或问题
   - 提供每个问题的提及次数和最多2条代表性评论示例(如果不够就有多少提供多少)
   - 突出显示具体、可操作的问题，如"登录页面频繁崩溃"、"通知延迟问题"等
   - 评论示例保留原文，不要翻译

格式要求:
- 请以JSON格式返回结果
- 所有分析文本使用指定的语言(${outputLanguage})，但评论示例保留原文
- 选择的评论示例应代表性强且信息量大，避免过于简短的评论
- 避免重复信息和过度概括
- 结果应客观、基于数据，不要添加未在评论中出现的内容

${language === 'zh' ? `示例中文输出格式:
{
  "用户喜欢的功能": [
    {
      "功能名称": "视觉化的时间显示",
      "提及次数": xx,
      "评论示例": ["...", "..."] // 原文评论，不翻译，最多2条
    },
    ...
  ],
  "用户不喜欢的功能": [
    {
      "问题名称": "登录页面频繁崩溃",
      "提及次数": xx,
      "评论示例": ["...", "..."] // 原文评论，不翻译，最多2条
    },
    ...
  ]
}` : `示例英文输出格式:
{
  "featuresLiked": [
    {
      "featureName": "Visual time display",
      "mentionCount": xx,
      "reviewExamples": ["...", "..."] // Original reviews, no translation, max 2
    },
    ...
  ],
  "featuresDisliked": [
    {
      "issueName": "Frequent login page crashes",
      "mentionCount": xx,
      "reviewExamples": ["...", "..."] // Original reviews, no translation, max 2
    },
    ...
  ]
}`}

请确保分析全面且客观，只返回JSON格式的结果，不要包含其他说明文字。`;
      
      const response = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        },
        body: JSON.stringify({
          model: "deepseek-ai/DeepSeek-V3", // 使用DeepSeek-V3模型
          messages: [{ role: "user", content: customPrompt }],
          temperature: 0.3,
          max_tokens: 2000,
          response_format: { type: "json_object" },
          stream: true // 启用流式响应
        })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Deepseek API请求失败: ${response.status} ${errorText}`);
      }
      
      // 初始化流式响应变量
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('无法获取响应流');
      }
      
      // 处理流式响应
      let responseText = '';
      let jsonResult: any = null;
      
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          // 解码二进制数据为文本
          const chunk = new TextDecoder().decode(value);
          responseText += chunk;
          
          // 尝试从流中提取完整的JSON
          if (responseText.includes('\n\n')) {
            const lines = responseText.split('\n\n');
            for (const line of lines) {
              if (line.startsWith('data: ') && line.includes('"content"')) {
                const data = line.replace('data: ', '');
                try {
                  const parsed = JSON.parse(data);
                  if (parsed.choices && parsed.choices[0] && parsed.choices[0].message && parsed.choices[0].message.content) {
                    // 尝试解析返回的内容为JSON
                    try {
                      jsonResult = JSON.parse(parsed.choices[0].message.content);
                      console.log('成功解析流式响应JSON');
                      break;
                    } catch (e) {
                      // 内容尚未完整，继续等待
                    }
                  }
                } catch (e) {
                  // 不是有效的JSON，继续等待
                }
              }
            }
            
            // 如果已经成功解析了JSON，可以提前退出循环
            if (jsonResult) break;
          }
        }
      } catch (error) {
        console.error('读取流式响应时出错:', error);
        throw error;
      } finally {
        reader.releaseLock();
      }
      
      // 如果流式响应没有返回有效结果，尝试从完整的响应文本解析
      if (!jsonResult) {
        try {
          // 尝试从最后一个data:块中提取内容
          const dataBlocks = responseText.split('data: ').filter(block => block.trim());
          const lastDataBlock = dataBlocks[dataBlocks.length - 1];
          
          if (lastDataBlock) {
            const parsed = JSON.parse(lastDataBlock);
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].message) {
              jsonResult = JSON.parse(parsed.choices[0].message.content);
            }
          }
        } catch (e) {
          console.error('无法从流式响应中解析JSON:', e);
          throw new Error('无法从流式响应中解析结果');
        }
      }
      
      if (!jsonResult) {
        throw new Error('流式响应未返回有效JSON结果');
      }
      
      // 将解析后的结果转换为原来的格式
      const deepseekContent = jsonResult;
      
      // 将Deepseek分析结果转换为原有格式
      if (language === 'zh') {
        // 中文输出格式转换
        if (deepseekContent['用户喜欢的功能'] && deepseekContent['用户不喜欢的功能']) {
          const customReviewExamples: Record<string, string[]> = {};
          
          deepseekContent['用户喜欢的功能'].forEach((item: any) => {
            customReviewExamples[`appstore_liked_${item['功能名称']}`] = item['评论示例'] || [];
          });
          
          deepseekContent['用户不喜欢的功能'].forEach((item: any) => {
            customReviewExamples[`appstore_disliked_${item['问题名称']}`] = item['评论示例'] || [];
          });
          
          analysisResult = {
            liked: deepseekContent['用户喜欢的功能'].map((item: any) => ({
              feature: item['功能名称'],
              votes: item['提及次数']
            })).sort((a: Feature, b: Feature) => b.votes - a.votes),
            disliked: deepseekContent['用户不喜欢的功能'].map((item: any) => ({
              feature: item['问题名称'],
              votes: item['提及次数']
            })).sort((a: Feature, b: Feature) => b.votes - a.votes),
            customReviewExamples
          };
        }
      } else {
        // 英文输出格式转换
        if (deepseekContent.featuresLiked && deepseekContent.featuresDisliked) {
          const customReviewExamples: Record<string, string[]> = {};
          
          deepseekContent.featuresLiked.forEach((item: any) => {
            customReviewExamples[`appstore_liked_${item.featureName}`] = item.reviewExamples || [];
          });
          
          deepseekContent.featuresDisliked.forEach((item: any) => {
            customReviewExamples[`appstore_disliked_${item.issueName}`] = item.reviewExamples || [];
          });
          
          analysisResult = {
            liked: deepseekContent.featuresLiked.map((item: any) => ({
              feature: item.featureName,
              votes: item.mentionCount
            })).sort((a: Feature, b: Feature) => b.votes - a.votes),
            disliked: deepseekContent.featuresDisliked.map((item: any) => ({
              feature: item.issueName,
              votes: item.mentionCount
            })).sort((a: Feature, b: Feature) => b.votes - a.votes),
            customReviewExamples
          };
        }
      }
      
      console.log('Deepseek API分析完成');
    }
    
    // 验证API返回的结果格式
    if (analysisResult && analysisResult.liked && analysisResult.disliked) {
      console.log(`API分析结果: 喜欢的功能 ${analysisResult.liked.length} 个，不喜欢的功能 ${analysisResult.disliked.length} 个`);
      return {
        liked: analysisResult.liked || [],
        disliked: analysisResult.disliked || [],
        customReviewExamples: analysisResult.customReviewExamples
      };
    } else {
      throw new Error('API返回的结果格式不正确');
    }
  } catch (error) {
    console.error('使用API分析评论失败:', error);
    console.log('回退到本地分析方法');
    
    // 如果API调用失败，回退到本地分析方法
    return fallbackFeatureExtraction(reviews, language);
  }
};

// 备选的特性提取方法，使用本地分析逻辑
function fallbackFeatureExtraction(
  reviews: any[],
  language: Language
): { liked: Feature[]; disliked: Feature[] } {
  console.log('使用本地分析方法提取功能特性');
  
  // 初始化功能计数器
  const featureCounts: Record<string, { positive: number; negative: number }> = {};
  Object.keys({...featureKeywords, ...chineseFeatureKeywords}).forEach((feature) => {
    featureCounts[feature] = { positive: 0, negative: 0 };
  });
  
  // 有效评论计数
  let validReviewCount = 0;
  
  // 分析每条评论
  for (const review of reviews) {
    // 清洗评论
    const cleanedText = cleanReview(review.text || '', language);
    if (!cleanedText) continue;
    
    validReviewCount++;
    
    // 分析情感
    const sentimentResult = analyzeSentiment(cleanedText, language);
    const isPositive = review.score >= 4 || sentimentResult.comparative > 0;
    
    // 提取关键功能
    const keyFeatures = extractKeyFeatures(cleanedText, language);
    
    // 统计功能
    keyFeatures.forEach(feature => {
      if (isPositive) {
        featureCounts[feature].positive += 1;
      } else {
        featureCounts[feature].negative += 1;
      }
    });
  }
  
  console.log(`本地分析完成: 分析了 ${validReviewCount} 条有效评论，从 ${reviews.length} 条原始评论中提取`);
  
  // 构建结果
  const liked = Object.entries(featureCounts)
    .filter(([_, counts]) => counts.positive > 0)
    .map(([feature, counts]) => ({
      feature,
      votes: counts.positive,
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);
  
  const disliked = Object.entries(featureCounts)
    .filter(([_, counts]) => counts.negative > 0)
    .map(([feature, counts]) => ({
      feature,
      votes: counts.negative,
    }))
    .sort((a, b) => b.votes - a.votes)
    .slice(0, 5);
  
  return { liked, disliked };
}

// 生成评论替代文本，避免直接使用用户评论
function generateReviewAlternative(review: string, feature: string, isPositive: boolean, language: Language): string {
  // 模板库
  const templates = {
    en: {
      positive: [
        `A user mentioned that the ${feature.toLowerCase()} is excellent`,
        `Users appreciate the app's ${feature.toLowerCase()}`,
        `Multiple reviewers highlighted the great ${feature.toLowerCase()}`,
        `The ${feature.toLowerCase()} receives positive feedback from users`,
        `Many users find the ${feature.toLowerCase()} very satisfying`
      ],
      negative: [
        `A user suggested improvements for the ${feature.toLowerCase()}`,
        `Some users experienced issues with the ${feature.toLowerCase()}`,
        `The ${feature.toLowerCase()} was mentioned as an area for improvement`,
        `Several reviewers noted problems with the ${feature.toLowerCase()}`,
        `Users report that the ${feature.toLowerCase()} needs attention`
      ]
    },
    zh: {
      positive: [
        `有用户表示这款应用的${feature}非常出色`,
        `多位用户对${feature}给予了很高评价`,
        `用户反馈认为${feature}设计得很好`,
        `${feature}方面得到了用户的普遍好评`,
        `许多人喜欢这款应用的${feature}`
      ],
      negative: [
        `有用户建议改进${feature}方面的体验`,
        `一些用户在使用${feature}时遇到了问题`,
        `${feature}被提及为需要改进的地方`,
        `多位评论者指出${feature}存在问题`,
        `用户反馈希望开发者能提升${feature}性能`
      ]
    }
  };
  
  // 提取关键词作为自定义内容
  const keywords = extractKeywords(review, language);
  
  // 选择一个随机模板
  const templateSet = language === 'zh' ? templates.zh : templates.en;
  const sentimentTemplates = isPositive ? templateSet.positive : templateSet.negative;
  const template = sentimentTemplates[Math.floor(Math.random() * sentimentTemplates.length)];
  
  // 如果有提取到关键词，尝试将其添加到模板中
  if (keywords.length > 0) {
    const lang = language === 'zh' ? 'zh' : 'en';
    const keywordText = keywords.join(lang === 'zh' ? '、' : ', ');
    const sentimentWord = isPositive 
      ? (lang === 'zh' ? '喜欢' : 'appreciate') 
      : (lang === 'zh' ? '提到了问题' : 'mentioned issues with');
    
    if (lang === 'zh') {
      return `用户${sentimentWord}${feature}的${keywordText}特性`;
    } else {
      return `Users ${sentimentWord} the ${keywordText} aspects of the ${feature.toLowerCase()}`;
    }
  }
  
  return template;
}

// 重写提取评论示例函数
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
    
    // 功能关键词
    const featureKeywordsToUse = language === 'zh' 
      ? (chineseFeatureKeywords[feature.feature as keyof typeof chineseFeatureKeywords] || []) 
      : (featureKeywords[feature.feature as keyof typeof featureKeywords] || []);
    
    // 找到包含该功能关键词的评论
    const relevantReviews = reviews.filter((review) => {
      // 获取清洗后的评论文本
      const cleanedText = cleanReview(review.text || '', language);
      if (!cleanedText) return false;
      
      // 确定情感倾向
      const sentimentResult = analyzeSentiment(cleanedText, language);
      const isPositive = review.score >= 4 || sentimentResult.comparative > 0;
      
      // 提取关键功能
      const keyFeatures = extractKeyFeatures(cleanedText, language);
      
      // 检查是否包含目标功能，且情感符合要求
      return keyFeatures.includes(feature.feature) && 
             (featureType === 'liked' ? isPositive : !isPositive);
    });
    
    // 从相关评论中选择最多3条
    const selectedReviews = relevantReviews.slice(0, 3);
    
    // 为每条评论生成替代文本
    examples[key] = selectedReviews.map(review => 
      generateReviewAlternative(
        review.text || '', 
        feature.feature, 
        featureType === 'liked', 
        language
      )
    );
    
    // 如果没有找到评论，则添加一个默认的替代文本
    if (examples[key].length === 0) {
      if (language === 'zh') {
        if (featureType === 'liked') {
          examples[key] = [`用户普遍喜欢这款应用的${feature.feature}功能`];
        } else {
          examples[key] = [`用户对${feature.feature}方面提出了一些改进建议`];
        }
      } else {
        if (featureType === 'liked') {
          examples[key] = [`Users generally appreciate the ${feature.feature.toLowerCase()} of this app`];
        } else {
          examples[key] = [`Users have suggested some improvements for the ${feature.feature.toLowerCase()}`];
        }
      }
    }
  });
  
  return examples;
};

// 使用真实的App Store Scraper获取应用信息和评论
const getAppStoreData = async (appName: string, language: Language, country: string = 'us') => {
  try {
    console.log(`尝试获取App Store数据: ${appName}, 语言: ${language}, 国家: ${country}`);
    
    // 生成缓存键
    const cacheKey = `app_${appName}_${language}_${country}`;
    
    // 检查缓存
    const cachedData = reviewsCache.get(cacheKey);
    if (cachedData) {
      console.log(`从缓存中获取数据: ${appName}, 国家: ${country}`);
      return cachedData;
    }
    
    // 尝试导入app-store-scraper库（CommonJS）
    const appStore = require('app-store-scraper');
    
    if (!appStore || !appStore.search) {
      throw new Error('App Store Scraper库导入失败');
    }
    
    console.log('成功导入App Store Scraper库，开始搜索应用');
    
    // 限制请求速率
    await rateLimiter.waitIfNeeded();
    
    // 搜索应用
    const searchResults = await fetchWithRetry(() => 
      appStore.search({
        term: appName,
        num: 1,
        lang: language === 'zh' ? 'zh-cn' : 'en-us',
      })
    );
    
    if (!searchResults || !Array.isArray(searchResults) || searchResults.length === 0) {
      throw new Error(`没有找到与"${appName}"匹配的App Store应用`);
    }
    
    const app = searchResults[0] as any;
    console.log(`找到应用: ${app.title} (${app.id})`);
    
    // 分页获取所有评论
    const allReviews = await fetchAllReviews(appStore, app.id, country);
    console.log(`共获取到 ${allReviews.length} 条评论，国家: ${country}`);
    
    // 提取特性和评论示例
    console.log('开始分析评论...');
    const features = await extractFeatures(allReviews, language);
    console.log('评论分析完成，提取评论示例...');
    
    // 检查是否有自定义评论示例，如果没有再生成评论示例
    let reviewExamples;
    if (features.customReviewExamples) {
      console.log('使用大模型生成的评论示例');
      reviewExamples = features.customReviewExamples;
      // 移除customReviewExamples属性，保持原有的数据结构
      delete features.customReviewExamples;
    } else {
      console.log('使用本地提取的评论示例');
      reviewExamples = extractReviewExamples(allReviews, features, language);
    }
    
    // 构建结果
    const now = new Date();
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const result = {
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
      reviewsData: allReviews.map(review => ({
        id: review.id?.toString() || '',
        userName: review.userName || review.author || '',
        date: review.date || '',
        score: review.score || 0,
        text: review.text || '',
        title: review.title || '',
        version: review.version || '',
      })),
    };
    
    // 将结果存入缓存
    reviewsCache.set(cacheKey, result);
    
    return result;
  } catch (error) {
    console.error('获取App Store数据失败:', error);
    throw error;
  }
};

// 分页获取所有评论，兼顾性能和API限制
async function fetchAllReviews(appStore: any, appId: string, country: string) {
  const allReviews = [];
  const maxPages = 2; // 最多获取2页，每页约50条，总共约100条评论
  
  // 准备随机的请求头选项
  const headers = {
    'User-Agent': getRandomUserAgent(),
    'Accept-Language': country === 'us' ? 'en-US,en;q=0.9' : `${country};q=0.9,en;q=0.8`,
    'Cache-Control': 'no-cache',
    'Pragma': 'no-cache',
    'Accept': 'application/json, text/plain, */*'
  };
  
  console.log(`使用随机请求头进行爬取，UA: ${headers['User-Agent'].substring(0, 30)}...`);
  
  // 添加抖动延迟，使请求间隔不规则
  const addJitter = (baseDelay: number, jitterFactor: number = 0.3) => {
    const jitter = baseDelay * jitterFactor * (Math.random() * 2 - 1);
    return Math.max(500, baseDelay + jitter);
  };
  
  for (let page = 1; page <= maxPages; page++) {
    try {
      console.log(`获取第${page}页评论，国家: ${country}`);
      
      // 限制请求速率
      await rateLimiter.waitIfNeeded();
      
      // 如果不是第一页，添加更长的随机延迟
      if (page > 1) {
        const baseDelay = 3000; // 3秒基础延迟
        const actualDelay = addJitter(baseDelay, 0.5); // 添加50%的随机抖动
        console.log(`为减轻API负担，等待 ${Math.round(actualDelay)}ms 后获取下一页...`);
        await new Promise(resolve => setTimeout(resolve, actualDelay));
      }
      
      // 带重试的API请求，添加自定义头信息
      const pageReviews = await fetchWithRetry(() => 
        appStore.reviews({
          id: appId,
          country: country,
          sort: appStore.sort.RECENT,
          page: page,
          num: 50, // 每页最多50条
          // 使用自定义请求头
          requestOptions: {
            headers: headers
          }
        })
      );
      
      if (!pageReviews || !Array.isArray(pageReviews) || pageReviews.length === 0) {
        console.log(`没有更多评论或已达到限制，停止获取`);
        break;
      }
      
      // 排重处理，确保不重复添加相同的评论
      const existingIds: Set<string> = new Set(allReviews.map(review => review.id?.toString() || ''));
      const uniqueReviews: any[] = pageReviews.filter(review => !existingIds.has(review.id?.toString() || ''));
      
      if (uniqueReviews.length < pageReviews.length) {
        console.log(`移除了 ${pageReviews.length - uniqueReviews.length} 条重复评论`);
      }
      
      allReviews.push(...uniqueReviews);
      console.log(`已获取总评论数: ${allReviews.length}，本页新增: ${uniqueReviews.length}`);
      
      // 如果返回的评论数少于请求的数量，说明已经到达末尾
      if (pageReviews.length < 50) {
        console.log('已获取所有可用评论，停止分页');
        break;
      }
      
      // 如果获取的评论达到了200条，也提前结束
      if (allReviews.length >= 200) {
        console.log('已获取200条评论，达到预定上限，停止获取');
        break;
      }
      
      // 页面间添加随机延迟，避免频繁请求
      if (page < maxPages) {
        const delay = addJitter(2500, 0.4); // 基础2.5秒，添加40%的随机抖动
        console.log(`等待 ${Math.round(delay)}ms 后获取下一页...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    } catch (error) {
      console.error(`获取第${page}页评论失败:`, error);
      break; // 出现错误停止获取
    }
  }
  
  // 对评论进行一些处理，比如按时间排序
  allReviews.sort((a, b) => {
    const dateA = new Date(a.date || '');
    const dateB = new Date(b.date || '');
    return dateB.getTime() - dateA.getTime(); // 降序，最新的评论在前
  });
  
  console.log(`评论获取完成，共 ${allReviews.length} 条，已按时间降序排序`);
  
  return allReviews;
}

// 生成模拟App Store数据
const generateMockAppStoreData = async (appName: string, language: Language): Promise<AppReviewsAnalysis> => {
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

// API路由处理函数
export async function POST(request: Request) {
  const startTime = Date.now();
  
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
      
      // 记录处理时间
      const processingTime = Date.now() - startTime;
      console.log(`请求处理完成，耗时: ${processingTime}ms`);
      
      return NextResponse.json(data);
    } catch (error) {
      // 如果失败，尝试使用模拟数据
      console.error('获取真实App Store数据失败:', error);
      
      try {
        console.log('回退到模拟数据...');
        const mockData = await generateMockAppStoreData(appName, language || 'en');
        
        // 记录处理时间
        const processingTime = Date.now() - startTime;
        console.log(`模拟数据生成完成，耗时: ${processingTime}ms`);
        
        return NextResponse.json(mockData);
      } catch (mockError) {
        console.error('模拟数据生成失败:', mockError);
        return new NextResponse(
          JSON.stringify({ error: (error as Error).message || '无法获取应用数据' }),
          { status: 404 }
        );
      }
    }
  } catch (error) {
    console.error('App Store API路由错误:', error);
    return new NextResponse(
      JSON.stringify({ error: (error as Error).message || '发生未知错误' }),
      { status: 500 }
    );
  }
}

export async function OPTIONS(request: Request) {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    }
  });
} 