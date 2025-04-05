// 测试Google Play和App Store API

// 导入包
// Google Play Scraper 将通过动态导入
const appStoreModule = require('app-store-scraper');

// 测试应用名称
const appName = '微信';
const lang = 'zh'; // 中文
const appStoreId = 414478124; // 微信的App Store ID

async function testGooglePlayAPI() {
  try {
    console.log('=== 开始测试 Google Play API ===');
    console.log('正在动态导入 google-play-scraper...');
    
    // 动态导入 ESM 模块
    const gplayModule = await import('google-play-scraper');
    
    // 获取导出的默认对象
    const gplay = gplayModule.default;
    
    if (!gplay || !gplay.search) {
      throw new Error('Google Play Scraper 模块导入错误: search 方法不存在');
    }
    
    console.log('成功导入 Google Play Scraper');
    
    // 测试搜索功能
    console.log(`搜索应用: ${appName}`);
    const searchResults = await gplay.search({
      term: appName,
      num: 1,
      lang: lang === 'zh' ? 'zh-CN' : 'en-US',
    });
    
    if (!searchResults || searchResults.length === 0) {
      throw new Error('没有找到匹配的应用');
    }
    
    const app = searchResults[0];
    console.log(`找到应用: ${app.title} (${app.appId})`);
    console.log(`开发者: ${app.developer}`);
    console.log(`评分: ${app.score}`);
    
    // 测试评论功能
    console.log(`\n获取应用评论...`);
    const reviewsResult = await gplay.reviews({
      appId: app.appId,
      lang: lang === 'zh' ? 'zh-CN' : 'en-US',
      sort: gplay.sort.NEWEST,
      num: 3, // 仅获取3条评论用于测试
    });
    
    if (!reviewsResult || !reviewsResult.data) {
      throw new Error('无法获取应用评论');
    }
    
    console.log(`获取到 ${reviewsResult.data.length} 条评论:`);
    reviewsResult.data.forEach((review, index) => {
      console.log(`\n评论 #${index + 1}:`);
      console.log(`用户: ${review.userName}`);
      console.log(`评分: ${review.score}`);
      console.log(`日期: ${review.date}`);
      console.log(`内容: ${review.text.substring(0, 100)}${review.text.length > 100 ? '...' : ''}`);
    });
    
    console.log('\nGoogle Play API 测试成功 ✅');
    return true;
  } catch (error) {
    console.error('Google Play API 测试失败 ❌:', error);
    return false;
  }
}

async function testAppStoreAPI() {
  try {
    console.log('\n=== 开始测试 App Store API ===');
    
    // 测试搜索功能
    console.log(`搜索应用: ${appName}`);
    
    const searchResults = await appStoreModule.search({
      term: appName,
      num: 1,
      lang: lang === 'zh' ? 'zh-cn' : 'en-us',
    });
    
    if (!searchResults || searchResults.length === 0) {
      throw new Error('没有找到匹配的应用');
    }
    
    const app = searchResults[0];
    console.log(`找到应用: ${app.title} (${app.id})`);
    console.log(`开发者: ${app.developer}`);
    console.log(`评分: ${app.score}`);
    
    // 测试评论功能
    console.log(`\n获取应用评论...`);
    const reviews = await appStoreModule.reviews({
      id: app.id,
      lang: lang === 'zh' ? 'zh-cn' : 'en-us',
      sort: appStoreModule.sort.RECENT,
      page: 1,
      num: 3, // 仅获取3条评论用于测试
    });
    
    if (!reviews || !Array.isArray(reviews)) {
      throw new Error('无法获取应用评论');
    }
    
    console.log(`获取到 ${reviews.length} 条评论:`);
    reviews.forEach((review, index) => {
      console.log(`\n评论 #${index + 1}:`);
      console.log(`用户: ${review.userName}`);
      console.log(`评分: ${review.score}`);
      console.log(`日期: ${review.date}`);
      console.log(`标题: ${review.title}`);
      console.log(`内容: ${review.text.substring(0, 100)}${review.text.length > 100 ? '...' : ''}`);
    });
    
    console.log('\nApp Store API 测试成功 ✅');
    return true;
  } catch (error) {
    console.error('App Store API 测试失败 ❌:', error);
    return false;
  }
}

// 运行测试
(async () => {
  try {
    console.log('开始API测试...\n');
    
    const googleSuccess = await testGooglePlayAPI();
    const appStoreSuccess = await testAppStoreAPI();
    
    console.log('\n=== 测试结果摘要 ===');
    console.log(`Google Play API: ${googleSuccess ? '成功 ✅' : '失败 ❌'}`);
    console.log(`App Store API: ${appStoreSuccess ? '成功 ✅' : '失败 ❌'}`);
    
    console.log('\n测试完成.');
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
})();
