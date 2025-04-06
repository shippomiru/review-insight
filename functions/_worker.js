// 设置NodeJS兼容性选项
export const config = {
  compatibility_date: "2023-05-18",
  compatibility_flags: ["nodejs_compat"],
};

// 导出中间件
export { default as middleware } from './_middleware.js';

// 重导向所有API请求
export * as routes from './api/[[route]].js';
export * as analyzeApple from './api/analyze-apple.js';
export * as analyzeGoogle from './api/analyze-google.js';
export * as analyze from './api/analyze.js'; 