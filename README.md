# 用户反馈趋势分析

这是一个用于分析 App Store 和 Google Play 上用户评论的网站，旨在提供应用评价的深入洞察。

## 项目特点

- 收集并分析 App Store 和 Google Play 上的应用评论
- 提取用户喜欢和不喜欢的功能点
- 提供清晰的功能排行榜和投票统计
- 合规处理用户数据，不直接展示原始评论

## 技术栈

- 前端：Next.js + TailwindCSS
- 数据采集：google-play-scraper 和 app-store-scraper
- 数据分析：自然语言处理技术
- 部署平台：Cloudflare Pages

## 开发指南

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
``` 