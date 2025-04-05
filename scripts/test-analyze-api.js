// 测试分析API和Google Play模拟数据

const fetch = require('node-fetch');

// 要测试的应用名称
const appName = '微信';
const language = 'zh';

async function testAnalyzeApi() {
  try {
    console.log(`开始测试分析API，应用名称: ${appName}, 语言: ${language}`);
    
    // 发送请求到API端点
    const response = await fetch('http://localhost:3000/api/analyze', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        appName,
        language
      })
    });
    
    if (!response.ok) {
      throw new Error(`API请求失败，状态码: ${response.status}`);
    }
    
    const data = await response.json();
    
    // 打印摘要
    console.log('\n=== 分析结果摘要 ===');
    console.log(`应用名称: ${data.appInfo.title}`);
    console.log(`开发者: ${data.appInfo.developer}`);
    console.log(`评分: ${data.appInfo.score}`);
    console.log(`评价数: ${data.appInfo.ratings}`);
    
    // 检查Google Play和App Store数据
    console.log('\n=== 平台支持 ===');
    console.log(`Google Play: ${data.googlePlay ? '✅' : '❌'}`);
    console.log(`App Store: ${data.appStore ? '✅' : '❌'}`);
    
    // 显示用户喜欢的特性
    if (data.googlePlay) {
      console.log('\n=== Google Play用户喜欢的特性 ===');
      data.googlePlay.liked.forEach((feature, index) => {
        console.log(`${index + 1}. ${feature.feature}: ${feature.votes}票`);
      });
      
      console.log('\n=== Google Play用户不喜欢的特性 ===');
      data.googlePlay.disliked.forEach((feature, index) => {
        console.log(`${index + 1}. ${feature.feature}: ${feature.votes}票`);
      });
    }
    
    if (data.appStore) {
      console.log('\n=== App Store用户喜欢的特性 ===');
      data.appStore.liked.forEach((feature, index) => {
        console.log(`${index + 1}. ${feature.feature}: ${feature.votes}票`);
      });
      
      console.log('\n=== App Store用户不喜欢的特性 ===');
      data.appStore.disliked.forEach((feature, index) => {
        console.log(`${index + 1}. ${feature.feature}: ${feature.votes}票`);
      });
    }
    
    // 显示评论示例
    console.log('\n=== 评论示例 ===');
    Object.keys(data.reviewExamples).forEach(key => {
      console.log(`\n${key}:`);
      data.reviewExamples[key].forEach((review, index) => {
        console.log(`  ${index + 1}. "${review}"`);
      });
    });
    
    console.log('\n测试完成，API正常工作 ✅');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 启动测试
testAnalyzeApi(); 