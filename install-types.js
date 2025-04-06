const { execSync } = require('child_process');

console.log('正在安装必要的TypeScript类型依赖...');

try {
  execSync('npm install --no-save @types/react@18.3.20 @types/react-dom@18.3.6 @types/node@20.17.30', { stdio: 'inherit' });
  console.log('TypeScript类型依赖安装完成！');
} catch (error) {
  console.error('安装TypeScript类型依赖失败:', error);
  process.exit(1);
} 