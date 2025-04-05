/**
 * Google Play API 模拟数据
 * 在无法访问Google Play API时提供模拟数据
 */

const mockApps = {
  '微信': {
    appId: 'com.tencent.mm',
    title: '微信',
    description: '微信是一款跨平台的通讯工具。支持单人、多人参与。通过手机网络发送语音、图片、视频和文字。',
    summary: '超过10亿人使用的社交通讯工具',
    developer: 'Tencent Technology (Shenzhen) Company Limited',
    developerEmail: 'android@tencent.com',
    developerWebsite: 'http://weixin.qq.com',
    developerAddress: 'Kejizhongyi Avenue, Hi-tech Park, Nanshan District, Shenzhen, 518057, China',
    privacyPolicy: 'https://weixin.qq.com/cgi-bin/readtemplate?lang=zh_CN&t=weixin_agreement&s=privacy',
    genre: '社交',
    genreId: 'SOCIAL',
    icon: 'https://play-lh.googleusercontent.com/r3THnBcK8pcg0QnUd8Zj_weMPJ83Xytj8WcpzLk0d-zpjjQrjbX-jJWnRHUrf3TLiw=s180',
    headerImage: 'https://play-lh.googleusercontent.com/r3THnBcK8pcg0QnUd8Zj_weMPJ83Xytj8WcpzLk0d-zpjjQrjbX-jJWnRHUrf3TLiw',
    screenshots: [
      'https://play-lh.googleusercontent.com/MWfzOGCj9_u2C9-iZ3U7eBJoJ7U1R8Jbc1L8LT3EK0fDIL_WNb7kEI_S6OLYmLw9XQ=w720-h310',
      'https://play-lh.googleusercontent.com/WEuQQa0q4OhZ1J_zQ8QwCweSvfhkjR5PwEOVN5WoFaZjyY_3UomcLl48Y7pUQjKbPgI=w720-h310',
      'https://play-lh.googleusercontent.com/NKlz0ahFnEZe-0nrGf7XpSUbhSMKjBz7zSk-IbNLvXsYgQqVrtoQgzlYTKBAZNXoEJU=w720-h310'
    ],
    contentRating: 'Everyone',
    contentRatingDescription: '无不良内容',
    adSupported: false,
    containsAds: false,
    released: '2011-01-21',
    updated: '2023-05-10',
    version: '8.0.44',
    recentChanges: '全新的微信8.0，焕然一新。\n- 视频通话支持更多滤镜和效果\n- 表情包可以添加到收藏\n- 性能优化和稳定性改进',
    price: 0,
    currency: 'USD',
    free: true,
    offersIAP: true,
    IAPRange: '¥6.00 - ¥588.00 每项',
    size: '180M',
    androidVersion: '需要Android 5.0及更高版本',
    minAndroidVersion: '5.0',
    installsMin: 5000000000,
    installsMax: 10000000000,
    score: 4.5,
    ratings: 65876234,
    reviews: 12356789,
    histogram: {
      '1': 456789,
      '2': 237890,
      '3': 987600,
      '4': 2345678,
      '5': 8987654
    }
  },
  
  'QQ': {
    appId: 'com.tencent.mobileqq',
    title: 'QQ',
    description: 'QQ是腾讯推出的一款社交软件，支持在线聊天、视频通话、点对点断点续传文件、共享文件、网络硬盘、自定义面板、QQ邮箱等多种功能。',
    summary: '欢迎使用QQ',
    developer: 'Tencent Technology (Shenzhen) Company Limited',
    developerEmail: 'android@tencent.com',
    developerWebsite: 'http://im.qq.com',
    developerAddress: 'Kejizhongyi Avenue, Hi-tech Park, Nanshan District, Shenzhen, 518057, China',
    privacyPolicy: 'https://privacy.qq.com/',
    genre: '社交',
    genreId: 'SOCIAL',
    icon: 'https://play-lh.googleusercontent.com/xRKFFWwvGGBDRLjYQaFJuOFuCFJiuUUQQHGfodW-KQEaZDIKwJlgvEYzNDZkbubDk95q=s180',
    headerImage: 'https://play-lh.googleusercontent.com/xRKFFWwvGGBDRLjYQaFJuOFuCFJiuUUQQHGfodW-KQEaZDIKwJlgvEYzNDZkbubDk95q',
    screenshots: [
      'https://play-lh.googleusercontent.com/uPWehRmiFzJ3pkAETfQmw9BUJhw719WCnMktuEYrGRxIrxUumvLfeDZGWdyzzdL_1g=w720-h310',
      'https://play-lh.googleusercontent.com/o3UFgx_QTGK-VuK-ILOy9OjAnRvyeZeZNVnV58Nf3QVCyFFcBSQ3NKJ6NM7g5ck-2CI=w720-h310',
      'https://play-lh.googleusercontent.com/NJ5wCbEK-DViMweCl6-iH2Y5xUP5BJA98quAuQXWVHtQOwy6Tl1D9tTLiFRaZVE3KeHX=w720-h310'
    ],
    contentRating: 'Everyone',
    contentRatingDescription: '无不良内容',
    adSupported: false,
    containsAds: false,
    released: '2010-09-01',
    updated: '2023-05-15',
    version: '8.9.50',
    recentChanges: '- 全新界面设计\n- 提高消息发送速度\n- 优化文件传输功能\n- 修复已知问题',
    price: 0,
    currency: 'USD',
    free: true,
    offersIAP: true,
    IAPRange: '¥1.00 - ¥888.00 每项',
    size: '165M',
    androidVersion: '需要Android 5.0及更高版本',
    minAndroidVersion: '5.0',
    installsMin: 1000000000,
    installsMax: 5000000000,
    score: 4.3,
    ratings: 34567890,
    reviews: 7654321,
    histogram: {
      '1': 345678,
      '2': 456789,
      '3': 876543,
      '4': 1456789,
      '5': 5432109
    }
  },
  
  '支付宝': {
    appId: 'com.eg.android.AlipayGphone',
    title: '支付宝',
    description: '支付宝，全球领先的独立第三方支付平台，致力于为广大用户提供安全快速的电子支付/网上支付/安全支付/手机支付体验，及转账收款/水电煤缴费/信用卡还款/AA收款等生活服务应用。',
    summary: '生活好帮手',
    developer: 'Alipay (China) Technology Co., Ltd.',
    developerEmail: 'support@alipay.com',
    developerWebsite: 'https://www.alipay.com/',
    developerAddress: 'No. 556 Xixi Road, Hangzhou, Zhejiang, China',
    privacyPolicy: 'https://render.alipay.com/p/yuyan/180020010001196791/alipay-privacy-policy.html',
    genre: '财务',
    genreId: 'FINANCE',
    icon: 'https://play-lh.googleusercontent.com/ZZtO_u3g9CwDxwCDYDXbwCxuNbFgFGa5szm3GsF__uDubRYEw3-ZhQg5KnRDtJTI1Q=s180',
    headerImage: 'https://play-lh.googleusercontent.com/ZZtO_u3g9CwDxwCDYDXbwCxuNbFgFGa5szm3GsF__uDubRYEw3-ZhQg5KnRDtJTI1Q',
    screenshots: [
      'https://play-lh.googleusercontent.com/ZEKSuy3BMR42BwDhYP6jFzCEiTHwGLnWI-9vPVwh6MIW_5QnUfDtGtBGXPXm-q1VSA=w720-h310',
      'https://play-lh.googleusercontent.com/3IXblmsaCG9PDZFefrvWHyxCmL63CYlZnvY2D9-Np0i-z9Rw1cQUVsCMZA-6_Vwc3ig=w720-h310',
      'https://play-lh.googleusercontent.com/H0mJNX-T8Rra2gdzaWnxcZdc_j-CpYhfKgu7PblqMbcr7dgGlcnrBteUOWbZC23q9KY=w720-h310'
    ],
    contentRating: 'Everyone',
    contentRatingDescription: '无不良内容',
    adSupported: false,
    containsAds: false,
    released: '2011-01-01',
    updated: '2023-05-20',
    version: '10.5.68',
    recentChanges: '- 全新的界面设计\n- 优化扫码支付功能\n- 新增更多理财产品\n- 修复已知问题',
    price: 0,
    currency: 'USD',
    free: true,
    offersIAP: false,
    IAPRange: '',
    size: '150M',
    androidVersion: '需要Android 6.0及更高版本',
    minAndroidVersion: '6.0',
    installsMin: 500000000,
    installsMax: 1000000000,
    score: 4.7,
    ratings: 23456789,
    reviews: 5678901,
    histogram: {
      '1': 234567,
      '2': 123456,
      '3': 345678,
      '4': 1234567,
      '5': 7654321
    }
  }
};

// 生成随机评论
const reviewAuthors = [
  '张三', '李四', '王五', '赵六', '钱七', '孙八', '周九', '吴十',
  '郑一', '王二', '陈三', '马四', '朱五', '林六', '何七', '高八',
  '罗九', '郭十', '梁一', '宋二', '唐三', '许四', '韩五', '冯六',
  '邓七', '曹八', '彭九', '曾十', '萧一', '田二', '董三', '袁四',
  '潘五', '蒋六', '蔡七', '余八', '杜九', '叶十', '程一', '苏二',
  '魏三', '吕四', '丁五', '任六', '沈七', '姚八', '卢九', '姜十'
];

const positiveReviewTexts = [
  '这款应用真的很棒，功能齐全，使用方便。',
  '使用体验非常好，界面设计很美观。',
  '比其他同类应用要好用得多，强烈推荐！',
  '开发人员做得很好，应用很稳定，没有遇到过崩溃。',
  '功能丰富，满足了我的所有需求。',
  '界面简洁大方，操作也很流畅。',
  '使用非常方便，很适合日常使用。',
  '应用很实用，已经使用了很长时间。',
  '更新很勤快，一直在增加新功能。',
  '客服响应速度很快，解决问题效率高。'
];

const negativeReviewTexts = [
  '最近更新后经常崩溃，希望尽快修复。',
  '有时候会卡顿，影响用户体验。',
  '广告太多了，影响使用。',
  '电量消耗太大，手机很快就没电了。',
  '占用内存太多，导致手机运行缓慢。',
  '启动速度太慢，需要等待很长时间。',
  '某些功能不好用，建议改进。',
  '隐私保护做得不好，感觉个人信息不安全。',
  '用户界面太复杂，不容易上手。',
  '提示通知太频繁，很烦人。'
];

const neutralReviewTexts = [
  '总体来说还可以，但有些地方需要改进。',
  '功能基本满足需求，希望再增加一些新功能。',
  '使用体验一般，没有特别惊艳的地方。',
  '最新版本有所改进，但仍然存在一些问题。',
  '相比其他应用差不多，没有太大优势。',
  '有优点也有缺点，总体上可以接受。',
  '还算稳定，但偶尔会有些小问题。',
  '功能有些重复，可以精简一下。',
  '界面设计可以更美观一些。',
  '比之前的版本有进步，但还可以更好。'
];

/**
 * 根据评分生成评论文本
 */
function getReviewTextByScore(score) {
  if (score >= 4) {
    return positiveReviewTexts[Math.floor(Math.random() * positiveReviewTexts.length)];
  } else if (score <= 2) {
    return negativeReviewTexts[Math.floor(Math.random() * negativeReviewTexts.length)];
  } else {
    return neutralReviewTexts[Math.floor(Math.random() * neutralReviewTexts.length)];
  }
}

/**
 * 生成随机日期（过去一年内）
 */
function getRandomDate() {
  const now = new Date();
  const pastYear = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());
  const randomTime = pastYear.getTime() + Math.random() * (now.getTime() - pastYear.getTime());
  return new Date(randomTime);
}

/**
 * 生成评论列表
 */
function generateReviews(appName, count = 50) {
  if (!mockApps[appName]) {
    return [];
  }
  
  const appInfo = mockApps[appName];
  const reviews = [];
  
  for (let i = 0; i < count; i++) {
    // 生成与应用总体评分分布相近的随机评分
    const randomValue = Math.random() * 100;
    let score;
    let sum = 0;
    
    const totalRatings = Object.values(appInfo.histogram).reduce((a, b) => a + b, 0);
    
    for (let j = 1; j <= 5; j++) {
      sum += (appInfo.histogram[j] / totalRatings) * 100;
      if (randomValue <= sum) {
        score = j;
        break;
      }
    }
    
    if (!score) score = 5; // 默认值
    
    const reviewId = `review-${appName.replace(/\s+/g, '-').toLowerCase()}-${i}`;
    const userName = reviewAuthors[Math.floor(Math.random() * reviewAuthors.length)];
    const date = getRandomDate();
    const text = getReviewTextByScore(score);
    const thumbsUp = Math.floor(Math.random() * 100);
    const version = appInfo.version;
    
    reviews.push({
      id: reviewId,
      userName,
      userImage: 'https://play-lh.googleusercontent.com/a-/default-user',
      date: date.toISOString(),
      score,
      text,
      thumbsUp,
      replyDate: null,
      replyText: null,
      version,
      appVersion: version
    });
  }
  
  // 按日期排序，最新的在前
  reviews.sort((a, b) => new Date(b.date) - new Date(a.date));
  
  return reviews;
}

/**
 * 搜索应用
 */
function search(term, options = {}) {
  const results = [];
  const lowerTerm = term.toLowerCase();
  
  for (const appName in mockApps) {
    if (appName.toLowerCase().includes(lowerTerm) || 
        mockApps[appName].appId.toLowerCase().includes(lowerTerm) ||
        mockApps[appName].description.toLowerCase().includes(lowerTerm)) {
      
      const app = { ...mockApps[appName] };
      results.push({
        appId: app.appId,
        title: app.title,
        summary: app.summary,
        developer: app.developer,
        developerId: app.developer.replace(/\s+/g, '.').toLowerCase(),
        icon: app.icon,
        score: app.score,
        price: app.price,
        free: app.free
      });
    }
  }
  
  return Promise.resolve(results);
}

/**
 * 获取应用详情
 */
function app(appId) {
  for (const appName in mockApps) {
    if (mockApps[appName].appId === appId) {
      return Promise.resolve(mockApps[appName]);
    }
  }
  
  return Promise.reject(new Error(`App with ID ${appId} not found`));
}

/**
 * 获取应用评论
 */
function reviews(options) {
  const { appId } = options;
  
  for (const appName in mockApps) {
    if (mockApps[appName].appId === appId) {
      const reviews = generateReviews(appName, options.count || 50);
      
      return Promise.resolve({
        data: reviews,
        nextPaginationToken: null // 模拟没有更多评论
      });
    }
  }
  
  return Promise.reject(new Error(`Reviews for app with ID ${appId} not found`));
}

// 导出模拟的API
module.exports = {
  search,
  app,
  reviews
}; 