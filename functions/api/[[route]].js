/**
 * Cloudflare Function代理
 * 将API请求转发到部署的API服务
 * 
 * 注意：这只是一个临时解决方案，用于保持功能一致性
 * 最终应该迁移完整的API逻辑到Cloudflare Functions
 */

// 设置NodeJS兼容性选项
export const config = {
  compatibility_date: "2023-05-18",
  compatibility_flags: ["nodejs_compat"],
};

export async function onRequest(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  
  // 从请求URL提取API路径
  const apiPath = url.pathname.replace('/api/', '');
  
  try {
    // 如果是OPTIONS请求，返回CORS头信息
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
    
    // 创建转发请求
    // 注意：根据您部署API的位置，需要更新API_BASE_URL
    // 此处临时使用同一个域名，但在实际生产中应该指向实际API服务器
    const API_BASE_URL = `https://heartheusers.com/api`;
    const forwardUrl = `${API_BASE_URL}/${apiPath}`;
    
    // 克隆原始请求以保留方法、头信息和正文
    const forwardRequest = new Request(forwardUrl, {
      method: request.method,
      headers: request.headers,
      body: request.body,
      redirect: 'follow',
    });
    
    // 转发请求并返回响应
    const response = await fetch(forwardRequest);
    
    // 创建新的响应对象以添加CORS头
    const responseData = await response.arrayBuffer();
    return new Response(responseData, {
      status: response.status,
      statusText: response.statusText,
      headers: {
        ...Object.fromEntries(response.headers),
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    console.error('API代理错误:', error);
    
    // 返回错误响应
    return new Response(
      JSON.stringify({
        error: '处理API请求时出错',
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
} 