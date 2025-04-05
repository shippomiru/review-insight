// 测试从多个国家获取App Store评论

const appStore = require('app-store-scraper');

// 要测试的应用
const appName = '微信';
const appId = 414478124; // 微信在App Store的ID

// 要获取评论的国家
const countries = ['cn', 'hk', 'tw', 'us', 'jp'];

async function testAppStoreReviews() {
  try {
    console.log(`开始测试App Store评论获取，应用: ${appName} (ID: ${appId})`);
    
    // 获取应用详情
    console.log('获取应用详情...');
    const appInfo = await appStore.app({ id: appId });
    console.log(`成功获取应用详情: ${appInfo.title}`);
    console.log(`开发者: ${appInfo.developer}`);
    console.log(`评分: ${appInfo.score} (共${appInfo.reviews}个评论)`);
    console.log(`当前版本: ${appInfo.version}`);
    console.log(`更新日期: ${appInfo.updated}`);
    
    // 获取不同国家的评论
    let totalReviews = 0;
    let countryReviewCounts = {};
    let allReviews = [];
    
    console.log('\n开始获取各国家/地区的评论:');
    for (const country of countries) {
      console.log(`\n===== ${country} 地区 =====`);
      
      let countryReviews = [];
      const maxPages = 3; // 每个国家最多获取3页评论
      
      for (let page = 1; page <= maxPages; page++) {
        try {
          console.log(`获取 ${country} 地区第 ${page} 页评论...`);
          const reviews = await appStore.reviews({
            id: appId,
            country: country,
            page: page,
            sort: appStore.sort.RECENT
          });
          
          if (reviews && reviews.length > 0) {
            console.log(`获取到 ${reviews.length} 条评论`);
            countryReviews = countryReviews.concat(reviews);
          } else {
            console.log(`${country} 地区没有更多评论`);
            break;
          }
        } catch (error) {
          console.error(`获取 ${country} 地区第 ${page} 页评论失败:`, error.message);
          break;
        }
      }
      
      // 保存国家评论数量
      countryReviewCounts[country] = countryReviews.length;
      totalReviews += countryReviews.length;
      
      // 保存所有评论
      allReviews = allReviews.concat(countryReviews.map(review => ({
        ...review,
        country: country
      })));
      
      // 显示该国家的评分统计
      const ratings = {
        '5': 0, '4': 0, '3': 0, '2': 0, '1': 0
      };
      
      countryReviews.forEach(review => {
        ratings[review.score]++;
      });
      
      console.log(`评分分布:`);
      for (let i = 5; i >= 1; i--) {
        console.log(`${i}星: ${ratings[i]} 条 (${Math.round(ratings[i] / countryReviews.length * 100)}%)`);
      }
      
      // 显示几条最新评论
      if (countryReviews.length > 0) {
        console.log('\n最新评论:');
        const latestReviews = countryReviews.slice(0, 3);
        latestReviews.forEach((review, index) => {
          console.log(`${index + 1}. ${review.title} - ${review.userName} (${review.score}星)`);
          console.log(`   ${review.text.slice(0, 100)}${review.text.length > 100 ? '...' : ''}`);
          console.log(`   版本: ${review.version}, 日期: ${new Date(review.updated).toLocaleDateString()}`);
          console.log('');
        });
      }
    }
    
    // 输出总结
    console.log('\n===== 测试总结 =====');
    console.log(`总共获取到 ${totalReviews} 条评论`);
    console.log('国家/地区评论数量:');
    for (const country in countryReviewCounts) {
      console.log(`${country}: ${countryReviewCounts[country]} 条`);
    }
    
    // 找出一些常见提到的关键词
    console.log('\n关键词分析:');
    const keywords = {
      '稳定': 0, '崩溃': 0, '闪退': 0, 
      '卡顿': 0, '慢': 0, '速度': 0,
      '界面': 0, '设计': 0, 'UI': 0,
      '功能': 0, '好用': 0, '简单': 0,
      '体验': 0, '广告': 0, '隐私': 0
    };
    
    allReviews.forEach(review => {
      const text = review.text.toLowerCase();
      for (const keyword in keywords) {
        if (text.includes(keyword.toLowerCase())) {
          keywords[keyword]++;
        }
      }
    });
    
    // 按出现频率排序并显示
    const sortedKeywords = Object.entries(keywords).sort((a, b) => b[1] - a[1]);
    console.log('常见关键词出现次数:');
    sortedKeywords.forEach(([keyword, count]) => {
      console.log(`${keyword}: ${count} 次 (${Math.round(count / totalReviews * 100)}%)`);
    });
    
    console.log('\n测试完成 ✅');
  } catch (error) {
    console.error('测试失败:', error);
  }
}

// 运行测试
testAppStoreReviews(); 