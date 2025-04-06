/**
 * App Store应用评论分析API
 * 与原始Next.js API保持相同的功能
 */
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
    const { appName, language, country } = body;
    
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
    
    console.log(`请求应用: ${appName}, 语言: ${language || 'en'}, 国家: ${country || 'us'}`);
    
    try {
      // 临时使用静态测试数据响应，确保前端可以正常工作
      // 这只是为了验证部署，后续可以替换为实际API调用
      return new Response(
        JSON.stringify({
          appInfo: {
            title: appName,
            developer: "测试开发者",
            score: 4.5,
            reviews: 100,
            version: "1.0.0",
            releaseDate: "2024-04-01",
            lastUpdated: "2024-04-06",
            appLink: `https://apps.apple.com/app/${appName}`,
            appIcon: "https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/a1/b5/9b/a1b59bfa-59b6-ae1a-a069-ca3ec28eea9a/Icon-83.5@2x.png.png/200x200bb.png"
          },
          appStore: {
            liked: [
              { feature: "用户界面", votes: 45 },
              { feature: "功能性", votes: 32 },
              { feature: "性能", votes: 25 },
              { feature: "客户支持", votes: 18 },
              { feature: "创新设计", votes: 15 }
            ],
            disliked: [
              { feature: "广告数量", votes: 22 },
              { feature: "崩溃问题", votes: 17 },
              { feature: "电池消耗", votes: 14 },
              { feature: "订阅模式", votes: 12 },
              { feature: "更新频率", votes: 8 }
            ]
          },
          reviewExamples: {
            "appstore_liked_用户界面": ["用户界面设计简洁直观，让人一目了然", "很喜欢这个应用的界面布局，使用起来非常便捷"],
            "appstore_liked_功能性": ["提供了我需要的所有功能，非常实用", "功能齐全且易于使用，节省了我很多时间"],
            "appstore_liked_性能": ["运行流畅，没有任何卡顿", "即使处理大量数据也很快"],
            "appstore_liked_客户支持": ["客服响应非常迅速，解决了我的所有问题", "遇到问题时得到了很好的支持"],
            "appstore_liked_创新设计": ["很多创新的功能是其他应用没有的", "设计理念非常前卫"],
            
            "appstore_disliked_广告数量": ["广告太多了，影响使用体验", "希望能减少广告或提供无广告版本"],
            "appstore_disliked_崩溃问题": ["使用一段时间后经常崩溃", "有时候会突然关闭，导致数据丢失"],
            "appstore_disliked_电池消耗": ["耗电量很大，使用一会儿手机就发热", "后台运行时消耗电量过多"],
            "appstore_disliked_订阅模式": ["价格太贵了，应该提供一次性购买选项", "订阅模式不合理，很多基本功能都需要付费"],
            "appstore_disliked_更新频率": ["更新太慢，很多bug长时间没有修复", "希望能更频繁地推出新功能"]
          }
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (apiError) {
      console.error('API处理错误:', apiError);
      return new Response(
        JSON.stringify({ 
          error: '处理API请求时出错',
          message: apiError.message || '内部服务器错误'
        }),
        {
          status: 500,
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