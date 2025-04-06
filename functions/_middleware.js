/**
 * Cloudflare Pages中间件
 * 用于处理请求并添加必要的头信息
 */
export async function onRequest(context) {
  // 解构上下文对象
  const { request, next, env } = context;
  const url = new URL(request.url);
  
  try {
    // 对于API请求，确保传递所有必要的环境变量
    if (url.pathname.startsWith('/api/')) {
      // 继续处理请求
      return await next();
    }
    
    // 对于非API请求，继续常规处理
    return await next();
  } catch (error) {
    console.error('请求处理错误:', error);
    
    // 如果是API请求，返回JSON格式错误
    if (url.pathname.startsWith('/api/')) {
      return new Response(
        JSON.stringify({
          error: '处理请求时出错',
          message: error.message || '未知错误',
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
    
    // 对于其他页面请求，继续尝试提供静态内容
    return await next();
  }
} 