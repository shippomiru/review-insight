# 用户反馈趋势分析

这是一个用于分析 App Store 和 Google Play 上用户评论的网站，旨在提供应用评价的深入洞察。

## 项目特点

- 收集并分析 App Store 和 Google Play 上的应用评论
- 利用大模型API提取用户喜欢和不喜欢的具体功能点
- 提供清晰的功能排行榜和投票统计
- 合规处理用户数据，不直接展示原始评论
- 完全兼容Cloudflare Pages部署

## 技术栈

- 前端：Next.js + TailwindCSS
- 数据采集：google-play-scraper 和 app-store-scraper
- 数据分析：大模型API集成（OpenAI GPT/Anthropic Claude）
- 部署平台：Cloudflare Pages

## 开发指南

### 安装依赖

```bash
npm install
```

### 设置环境变量

```bash
cp .env.example .env.local
```

编辑`.env.local`文件，添加您的OpenAI或Anthropic API密钥：

```
OPENAI_API_KEY=sk-your-api-key-here
```

或者

```
ANTHROPIC_API_KEY=sk-ant-your-api-key-here
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## Cloudflare Pages部署指南

本项目特别优化了在Cloudflare Pages上的部署，使用纯JavaScript实现和外部API调用，避免了需要原生编译的依赖项。

1. **创建Cloudflare Pages项目**

   - 登录Cloudflare Dashboard
   - 进入"Pages"部分
   - 点击"创建项目"，连接到您的Git仓库

2. **配置构建设置**

   - 框架预设: Next.js
   - 构建命令: `npm run build`
   - 输出目录: `.next`

3. **设置环境变量**

   在Cloudflare Pages的项目设置中，添加以下环境变量:
   
   - `OPENAI_API_KEY`: 您的OpenAI API密钥
   - 或者 `ANTHROPIC_API_KEY`: 您的Anthropic API密钥

4. **部署**

   Cloudflare会自动构建和部署您的应用。每次推送到主分支时，会触发新的部署。

## 使用说明

1. 访问应用主页
2. 输入应用名称，选择语言和国家/地区
3. 系统将获取应用评论并进行分析
4. 分析结果将显示用户最喜欢和最不喜欢的具体功能
5. 您还可以查看每个功能的代表性评论示例

## 注意事项

- 大模型API分析需要API密钥和费用
- 如果未配置API密钥，系统会回退到本地分析方法
- 本地分析方法精度较低，但不需要外部API调用
- 缓存机制可以减少API调用次数和成本 