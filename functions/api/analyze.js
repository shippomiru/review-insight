/**
 * 通用应用评论分析API
 * 与原始Next.js API保持相同的功能
 */

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
    const { appName, language, country, platform } = body;
    
    // 验证必要参数
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
    
    const usedLanguage = language || 'en';
    const usedCountry = country || 'us';
    
    console.log(`请求应用: ${appName}, 语言: ${usedLanguage}, 国家: ${usedCountry}, 平台: ${platform || '全部'}`);
    
    try {
      // 根据平台选择API端点
      let response;
      
      if (platform === 'android' || platform === 'google') {
        // 调用Google Play API
        const googleResponse = await fetch(`${new URL(request.url).origin}/api/analyze-google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appName,
            language: usedLanguage
          }),
        });
        
        response = await googleResponse.json();
      } else if (platform === 'ios' || platform === 'apple') {
        // 调用App Store API
        const appleResponse = await fetch(`${new URL(request.url).origin}/api/analyze-apple`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            appName,
            language: usedLanguage,
            country: usedCountry
          }),
        });
        
        response = await appleResponse.json();
      } else {
        // 默认调用两个API，然后合并结果
        const [applePromise, googlePromise] = await Promise.allSettled([
          fetch(`${new URL(request.url).origin}/api/analyze-apple`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              appName,
              language: usedLanguage,
              country: usedCountry
            }),
          }).then(res => res.json()),
          
          fetch(`${new URL(request.url).origin}/api/analyze-google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              appName,
              language: usedLanguage
            }),
          }).then(res => res.json())
        ]);
        
        // 合并结果
        response = {
          appInfo: applePromise.status === 'fulfilled' && applePromise.value.appInfo ? 
            applePromise.value.appInfo : 
            (googlePromise.status === 'fulfilled' ? googlePromise.value.appInfo : null),
        };
        
        // 添加App Store数据
        if (applePromise.status === 'fulfilled' && applePromise.value.appStore) {
          response.appStore = applePromise.value.appStore;
        }
        
        // 添加Google Play数据
        if (googlePromise.status === 'fulfilled' && googlePromise.value.googlePlay) {
          response.googlePlay = googlePromise.value.googlePlay;
        }
        
        // 合并评论示例
        const reviewExamples = {};
        
        if (applePromise.status === 'fulfilled' && applePromise.value.reviewExamples) {
          Object.assign(reviewExamples, applePromise.value.reviewExamples);
        }
        
        if (googlePromise.status === 'fulfilled' && googlePromise.value.reviewExamples) {
          Object.assign(reviewExamples, googlePromise.value.reviewExamples);
        }
        
        response.reviewExamples = reviewExamples;
      }
      
      return new Response(
        JSON.stringify(response),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    } catch (apiError) {
      console.error('API调用错误:', apiError);
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