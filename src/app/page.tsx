import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <main>
      <Header />
      
      {/* Hero Section */}
      <section className="relative bg-white" id="hero">
        <div className="container py-24">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-primary-600">洞察用户声音</span>
              <span className="block">提升应用体验</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              分析 App Store 和 Google Play 的用户评论，发现用户最喜欢和最不满意的功能，
              获取宝贵反馈洞察，助力产品决策。
            </p>
            <div className="mt-10 flex justify-center gap-4">
              <Link href="/search" className="btn btn-primary px-8 py-3">
                开始分析
              </Link>
              <Link href="/#how-it-works" className="btn btn-secondary px-8 py-3">
                了解更多
              </Link>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 section" id="features">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              功能特点
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              我们提供全面的应用评价分析，帮助您深入了解用户反馈
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-5 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">多平台支持</h3>
              <p className="mt-4 text-gray-600">
                同时分析 App Store 和 Google Play 的评论数据，获取全面的用户反馈视图。
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-5 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">功能排行榜</h3>
              <p className="mt-4 text-gray-600">
                清晰展示用户最喜欢和最不满意的功能排行，帮助您识别产品优势和改进点。
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-5 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">合规数据处理</h3>
              <p className="mt-4 text-gray-600">
                以合规方式处理用户评论，不直接展示原始评论，保护用户隐私和平台权益。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              使用流程
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              简单三步，获取应用评价的深度洞察
            </p>
          </div>
          <div className="mt-16 grid gap-y-12">
            {/* Step 1 */}
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                  1
                </div>
                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  输入应用名称
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  在搜索框中输入您想要分析的应用名称，我们将从 App Store 和 Google Play 获取该应用的用户评论。
                </p>
              </div>
              <div className="order-1 flex justify-center md:order-2">
                <div className="relative h-64 w-full max-w-sm rounded-lg bg-gray-100 shadow-sm">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    [搜索界面示意图]
                  </div>
                </div>
              </div>
            </div>
            
            {/* Step 2 */}
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="flex justify-center">
                <div className="relative h-64 w-full max-w-sm rounded-lg bg-gray-100 shadow-sm">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    [分析过程示意图]
                  </div>
                </div>
              </div>
              <div>
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                  2
                </div>
                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  分析评论数据
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  我们将收集近半年的评论数据，分析用户情感和提到的功能，提取关键洞察。整个过程通常需要几分钟时间。
                </p>
              </div>
            </div>
            
            {/* Step 3 */}
            <div className="grid items-center gap-8 md:grid-cols-2">
              <div className="order-2 md:order-1">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-xl font-bold text-primary-600">
                  3
                </div>
                <h3 className="mt-6 text-2xl font-medium text-gray-900">
                  获取洞察报告
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  分析完成后，您将看到详细的报告，包括用户最喜欢的功能和最不满意的功能排行榜，帮助您了解产品优势和改进机会。
                </p>
              </div>
              <div className="order-1 flex justify-center md:order-2">
                <div className="relative h-64 w-full max-w-sm rounded-lg bg-gray-100 shadow-sm">
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                    [分析结果示意图]
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-16 text-center">
            <Link href="/search" className="btn btn-primary px-8 py-3">
              立即开始分析
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 section" id="testimonials">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              用户反馈
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              听听我们的用户怎么说
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    头像
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">王小明</h4>
                  <p className="text-sm text-gray-600">产品经理 @科技公司</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  "这个工具帮助我们发现了用户真正关心的功能点，大大提高了产品迭代的效率。通过分析用户评论，我们更加清晰地了解了用户的喜好和痛点。"
                </p>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    头像
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">李静</h4>
                  <p className="text-sm text-gray-600">应用开发者</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  "作为独立开发者，这个工具给了我巨大的帮助。通过了解用户最喜欢和最不满意的功能，我能够更有针对性地进行应用优化，提高用户满意度。"
                </p>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="flex items-center">
                <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
                  <div className="flex h-full w-full items-center justify-center text-gray-400">
                    头像
                  </div>
                </div>
                <div className="ml-4">
                  <h4 className="text-lg font-medium text-gray-900">张伟</h4>
                  <p className="text-sm text-gray-600">市场总监 @创业公司</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  "这个分析工具帮助我们更好地了解竞争对手的产品优势和不足，为我们的市场策略提供了有价值的参考。数据分析非常直观，使用体验很好。"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="section" id="faq">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              常见问题
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              关于我们服务的常见问题解答
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* FAQ Item 1 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                这个工具如何收集评论数据？
              </h3>
              <p className="mt-4 text-gray-600">
                我们使用合规的方式从 App Store 和 Google Play 获取公开的用户评论数据，仅限于评论日期、评分和评论内容。我们严格控制采集频率和间隔，确保符合平台规定。
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                分析结果会展示原始评论内容吗？
              </h3>
              <p className="mt-4 text-gray-600">
                不会。为了保护用户隐私和遵守平台规定，我们不会展示原始评论内容。我们只会展示分析后的洞察，如功能排行榜和经过同义词替换的反馈示例。
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                分析一个应用需要多长时间？
              </h3>
              <p className="mt-4 text-gray-600">
                分析时间取决于评论数量和服务器负载。通常情况下，分析一个应用的近半年评论数据需要 3-5 分钟。在分析过程中，您可以看到进度提示。
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                分析结果的准确性如何？
              </h3>
              <p className="mt-4 text-gray-600">
                我们使用先进的自然语言处理技术分析评论，准确识别用户提到的功能和情感。虽然技术在不断进步，但分析结果仍可能存在一定误差，建议结合您自己的判断使用。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="bg-gray-50 section" id="pricing">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              价格方案
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              选择适合您需求的方案
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="text-xl font-medium text-gray-900">基础版</h3>
              <p className="mt-4 text-sm text-gray-600">
                适合个人开发者和小型团队
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">¥0</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/月</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">每月分析 3 个应用</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">最近 3 个月评论数据</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">基础功能洞察</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/search" className="btn btn-primary w-full">
                  开始使用
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="relative rounded-lg bg-white p-8 shadow-lg">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-primary-600 py-1 text-center text-sm font-medium text-white">
                推荐方案
              </div>
              <h3 className="text-xl font-medium text-gray-900">专业版</h3>
              <p className="mt-4 text-sm text-gray-600">
                适合中小型企业和专业团队
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">¥199</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/月</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">每月分析 15 个应用</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">最近 6 个月评论数据</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">高级功能洞察</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">竞品对比分析</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/pricing" className="btn btn-primary w-full">
                  选择方案
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="text-xl font-medium text-gray-900">企业版</h3>
              <p className="mt-4 text-sm text-gray-600">
                适合大型企业和高级需求
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">¥999</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">/月</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">无限应用分析</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">最近 12 个月评论数据</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">全面功能洞察</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">市场趋势分析</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">专属客户支持</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/contact" className="btn btn-primary w-full">
                  联系我们
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 