// 测试通过代理访问Google Play API的脚本

const Proxifly = require('proxifly');
const { SocksProxyAgent } = require('socks-proxy-agent');
const https = require('https');

// 初始化Proxifly客户端
const proxifly = new Proxifly({
  apiKey: 'api_test_key' // 使用测试key
});

// 测试应用名称
const appName = '微信';
const lang = 'zh'; // 中文

// 测试直接连接
async function testDirectConnection() {
  try {
    console.log('测试直接连接到Google...');
    
    const options = {
      method: 'GET',
      hostname: 'play.google.com',
      path: '/store',
      timeout: 5000
    };
    
    await makeRequest(options);
    console.log('直接连接到Google Play成功 ✅');
    return true;
  } catch (error) {
    console.error('直接连接到Google Play失败 ❌:', error.message);
    return false;
  }
}

// 使用代理测试连接
async function testProxyConnection(proxyData) {
  try {
    console.log(`\n测试通过代理连接到Google...\n代理: ${proxyData.ip}:${proxyData.port} (${proxyData.protocol})`);
    
    let proxyUrl;
    if (proxyData.protocol === 'http' || proxyData.protocol === 'https') {
      proxyUrl = `http://${proxyData.ip}:${proxyData.port}`;
    } else {
      proxyUrl = `${proxyData.protocol}://${proxyData.ip}:${proxyData.port}`;
    }
    
    const agent = new SocksProxyAgent(proxyUrl);
    
    const options = {
      method: 'GET',
      hostname: 'play.google.com',
      path: '/store',
      timeout: 8000,
      agent
    };
    
    await makeRequest(options);
    console.log(`通过代理 ${proxyData.ip}:${proxyData.port} 连接到Google Play成功 ✅`);
    return true;
  } catch (error) {
    console.error(`通过代理 ${proxyData.ip}:${proxyData.port} 连接到Google Play失败 ❌:`, error.message);
    return false;
  }
}

// 创建请求
function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(data);
        } else {
          reject(new Error(`请求失败，状态码: ${res.statusCode}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
    
    req.end();
  });
}

// 尝试通过Proxifly获取代理并测试
async function getAndTestProxies() {
  try {
    console.log('正在从Proxifly获取代理列表...');
    
    // 首先尝试获取SOCKS5代理
    let proxies = [];
    
    try {
      console.log('获取SOCKS5代理...');
      const socks5Proxy = await proxifly.getProxy({
        protocol: 'socks5',
        anonymity: ['anonymous', 'elite'],
        quantity: 5 // 需要API key才能获取多个
      });
      
      // 如果quantity=1，结果是单个对象，否则是数组
      if (Array.isArray(socks5Proxy)) {
        proxies = proxies.concat(socks5Proxy);
      } else if (socks5Proxy) {
        proxies.push(socks5Proxy);
      }
    } catch (error) {
      console.log('获取SOCKS5代理失败:', error.message);
    }
    
    // 如果没有找到SOCKS5代理，尝试获取SOCKS4代理
    if (proxies.length === 0) {
      try {
        console.log('获取SOCKS4代理...');
        const socks4Proxy = await proxifly.getProxy({
          protocol: 'socks4',
          anonymity: ['anonymous', 'elite'],
          quantity: 1
        });
        
        if (Array.isArray(socks4Proxy)) {
          proxies = proxies.concat(socks4Proxy);
        } else if (socks4Proxy) {
          proxies.push(socks4Proxy);
        }
      } catch (error) {
        console.log('获取SOCKS4代理失败:', error.message);
      }
    }
    
    // 如果还是没有找到代理，尝试获取HTTP代理
    if (proxies.length === 0) {
      try {
        console.log('获取HTTP代理...');
        const httpProxy = await proxifly.getProxy({
          protocol: 'http',
          anonymity: ['anonymous', 'elite'],
          quantity: 1
        });
        
        if (Array.isArray(httpProxy)) {
          proxies = proxies.concat(httpProxy);
        } else if (httpProxy) {
          proxies.push(httpProxy);
        }
      } catch (error) {
        console.log('获取HTTP代理失败:', error.message);
      }
    }
    
    console.log(`总共获取到 ${proxies.length} 个代理`);
    
    if (proxies.length === 0) {
      throw new Error('未找到可用代理');
    }
    
    return proxies;
  } catch (error) {
    console.error('获取代理失败:', error.message);
    
    // 返回一些静态代理用于测试
    console.log('使用备用静态代理列表...');
    return [
      { ip: '192.126.144.228', port: 31094, protocol: 'socks5' },
      { ip: '198.8.84.3', port: 1080, protocol: 'socks5' },
      { ip: '51.79.51.246', port: 7828, protocol: 'socks5' },
      { ip: '47.88.13.188', port: 10080, protocol: 'socks5' },
      { ip: '8.134.138.108', port: 8888, protocol: 'socks5' }
    ];
  }
}

// 主函数
async function main() {
  try {
    console.log('开始代理测试...\n');
    
    // 测试直接连接
    const directSuccess = await testDirectConnection();
    
    if (directSuccess) {
      console.log('\n直接连接成功，无需使用代理 ✅');
      return;
    }
    
    console.log('\n直接连接失败，尝试使用代理...');
    
    // 获取代理列表
    const proxies = await getAndTestProxies();
    
    // 测试每个代理
    let successProxy = null;
    for (const proxy of proxies) {
      const success = await testProxyConnection(proxy);
      if (success) {
        successProxy = proxy;
        break;
      }
    }
    
    // 结果摘要
    console.log('\n=== 测试结果摘要 ===');
    if (successProxy) {
      console.log(`找到可用代理: ${successProxy.ip}:${successProxy.port} ✅`);
      console.log(`类型: ${successProxy.protocol}`);
      console.log('可以使用此代理连接Google Play API');
    } else {
      console.log('未找到可用代理 ❌');
      console.log('建议使用模拟数据或其他第三方API服务');
    }
    
    // 检查我们的公共IP
    try {
      const publicIp = await proxifly.getPublicIp({
        mode: 'IPv4',
        format: 'json'
      });
      console.log('\n您的公共IP信息:', publicIp);
    } catch (error) {
      console.error('获取公共IP失败:', error.message);
    }
  } catch (error) {
    console.error('测试过程中发生错误:', error);
  }
}

// 运行主函数
main(); 