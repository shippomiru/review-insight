'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

// 定义语言类型
export type Language = 'zh' | 'en';

// 定义上下文类型
type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string>) => string;
};

// 创建上下文
const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// 翻译文本
const translations = {
  zh: {
    // Header
    'site.name': '反馈分析',
    'nav.features': '功能特点',
    'nav.how_it_works': '使用流程',
    'nav.testimonials': '用户反馈',
    'nav.pricing': '价格方案',
    'nav.faq': '常见问题',
    
    // Hero
    'hero.title1': '洞察用户声音',
    'hero.title2': '提升应用体验',
    'hero.description': '分析 App Store 和 Google Play 的用户评论，发现用户最喜欢和最不满意的功能，获取宝贵反馈洞察，助力产品决策。',
    
    // App Analyzer
    'search.label': '应用名称',
    'search.placeholder': '例如：微信、Facebook、TikTok',
    'search.button': '开始分析',
    'search.analyzing': '分析中...',
    'search.error.empty': '请输入应用名称',
    'search.error.general': '分析过程中出现错误，请稍后重试',
    'search.progress': '分析进度',
    'search.getting_data': '正在从应用商店获取数据...',
    'search.wait_message': '分析过程通常需要 3-5 分钟，请耐心等待...',
    
    // Analysis Result
    'result.title': '{appName} 评价分析',
    'result.date_range': '分析时间范围',
    'result.reviews_count': '分析评论总数',
    'result.reviews_unit': '条',
    'result.google_play': 'Google Play 分析',
    'result.app_store': 'App Store 分析',
    'result.app_store_analysis': 'App Store 评价分析',
    'result.app_rating': '平均评分',
    'result.country': '地区',
    'result.likes': '用户喜欢的功能',
    'result.dislikes': '用户不满意的功能',
    'result.votes': '票',
    'result.feedback_examples': '用户反馈示例：',
    'result.no_appstore_data': '未能获取App Store数据，请尝试其他应用',
    
    // Features Section
    'features.title': '功能特点',
    'features.subtitle': '我们提供全面的应用评价分析，帮助您深入了解用户反馈',
    'features.multiplatform.title': '多平台支持',
    'features.multiplatform.description': '同时分析 App Store 和 Google Play 的评论数据，获取全面的用户反馈视图。',
    'features.ranking.title': '功能排行榜',
    'features.ranking.description': '清晰展示用户最喜欢和最不满意的功能排行，帮助您识别产品优势和改进点。',
    'features.compliance.title': '合规数据处理',
    'features.compliance.description': '以合规方式处理用户评论，不直接展示原始评论，保护用户隐私和平台权益。',
    
    // How It Works
    'how.title': '使用流程',
    'how.subtitle': '简单三步，获取应用评价的深度洞察',
    'how.step1.title': '输入应用名称',
    'how.step1.description': '在搜索框中输入您想要分析的应用名称，我们将从 App Store 和 Google Play 获取该应用的用户评论。',
    'how.step2.title': '分析评论数据',
    'how.step2.description': '我们将收集近半年的评论数据，分析用户情感和提到的功能，提取关键洞察。整个过程通常需要几分钟时间。',
    'how.step3.title': '获取洞察报告',
    'how.step3.description': '分析完成后，您将看到详细的报告，包括用户最喜欢的功能和最不满意的功能排行榜，帮助您了解产品优势和改进机会。',
    
    // Testimonials
    'testimonials.title': '用户反馈',
    'testimonials.subtitle': '听听我们的用户怎么说',
    'testimonials.person1.name': '王小明',
    'testimonials.person1.position': '产品经理 @科技公司',
    'testimonials.person1.quote': '"这个工具帮助我们发现了用户真正关心的功能点，大大提高了产品迭代的效率。通过分析用户评论，我们更加清晰地了解了用户的喜好和痛点。"',
    'testimonials.person2.name': '李静',
    'testimonials.person2.position': '应用开发者',
    'testimonials.person2.quote': '"作为独立开发者，这个工具给了我巨大的帮助。通过了解用户最喜欢和最不满意的功能，我能够更有针对性地进行应用优化，提高用户满意度。"',
    'testimonials.person3.name': '张伟',
    'testimonials.person3.position': '市场总监 @创业公司',
    'testimonials.person3.quote': '"这个分析工具帮助我们更好地了解竞争对手的产品优势和不足，为我们的市场策略提供了有价值的参考。数据分析非常直观，使用体验很好。"',
    
    // FAQ
    'faq.title': '常见问题',
    'faq.subtitle': '关于我们服务的常见问题解答',
    'faq.q1.title': '这个工具如何收集评论数据？',
    'faq.q1.answer': '我们使用合规的方式从 App Store 和 Google Play 获取公开的用户评论数据，仅限于评论日期、评分和评论内容。我们严格控制采集频率和间隔，确保符合平台规定。',
    'faq.q2.title': '分析结果会展示原始评论内容吗？',
    'faq.q2.answer': '不会。为了保护用户隐私和遵守平台规定，我们不会展示原始评论内容。我们只会展示分析后的洞察，如功能排行榜和经过同义词替换的反馈示例。',
    'faq.q3.title': '分析一个应用需要多长时间？',
    'faq.q3.answer': '分析时间取决于评论数量和服务器负载。通常情况下，分析一个应用的近半年评论数据需要 3-5 分钟。在分析过程中，您可以看到进度提示。',
    'faq.q4.title': '分析结果的准确性如何？',
    'faq.q4.answer': '我们使用先进的自然语言处理技术分析评论，准确识别用户提到的功能和情感。虽然技术在不断进步，但分析结果仍可能存在一定误差，建议结合您自己的判断使用。',
    
    // Pricing
    'pricing.title': '价格方案',
    'pricing.subtitle': '选择适合您需求的方案',
    'pricing.basic.title': '基础版',
    'pricing.basic.description': '适合个人开发者和小型团队',
    'pricing.basic.price': '¥0',
    'pricing.basic.period': '/月',
    'pricing.basic.feature1': '每月分析 3 个应用',
    'pricing.basic.feature2': '最近 3 个月评论数据',
    'pricing.basic.feature3': '基础功能洞察',
    'pricing.basic.cta': '开始使用',
    'pricing.pro.title': '专业版',
    'pricing.pro.description': '适合中小型企业和专业团队',
    'pricing.pro.tag': '推荐方案',
    'pricing.pro.price': '¥199',
    'pricing.pro.period': '/月',
    'pricing.pro.feature1': '每月分析 15 个应用',
    'pricing.pro.feature2': '最近 6 个月评论数据',
    'pricing.pro.feature3': '高级功能洞察',
    'pricing.pro.feature4': '竞品对比分析',
    'pricing.pro.cta': '选择方案',
    'pricing.enterprise.title': '企业版',
    'pricing.enterprise.description': '适合大型企业和高级需求',
    'pricing.enterprise.price': '¥999',
    'pricing.enterprise.period': '/月',
    'pricing.enterprise.feature1': '无限应用分析',
    'pricing.enterprise.feature2': '最近 12 个月评论数据',
    'pricing.enterprise.feature3': '全面功能洞察',
    'pricing.enterprise.feature4': '市场趋势分析',
    'pricing.enterprise.feature5': '专属客户支持',
    'pricing.enterprise.cta': '联系我们',
    
    // Footer
    'footer.links': '快速链接',
    'footer.support': '支持',
    'footer.privacy': '隐私政策',
    'footer.terms': '使用条款',
    'footer.contact': '联系我们',
    'footer.contact.email': '邮箱: contact@example.com',
    'footer.copyright': '© {year} {siteName}. 数据来源于应用商店，版权归平台和用户所有。',
    
    // Feedback Examples
    'feedback.liked.default1': '用户对这个功能表示满意',
    'feedback.liked.default2': '这项功能获得了积极评价',
    'feedback.liked.default3': '用户认为这个功能很实用',
    'feedback.disliked.default1': '用户对这个功能表示不满',
    'feedback.disliked.default2': '这项功能收到了一些改进建议',
    'feedback.disliked.default3': '用户希望这个功能能够优化',
    
    // Date format
    'date.format': '{startDate} 至 {endDate}',
  },
  en: {
    // Header
    'site.name': 'Review Analyzer',
    'nav.features': 'Features',
    'nav.how_it_works': 'How It Works',
    'nav.testimonials': 'Testimonials',
    'nav.pricing': 'Pricing',
    'nav.faq': 'FAQ',
    
    // Hero
    'hero.title1': 'Gain Insights from User Voices',
    'hero.title2': 'Improve App Experience',
    'hero.description': 'Analyze App Store and Google Play reviews to discover what users love and dislike about your app, get valuable feedback insights, and make informed product decisions.',
    
    // App Analyzer
    'search.label': 'App Name',
    'search.placeholder': 'e.g., WeChat, Facebook, TikTok',
    'search.button': 'Analyze',
    'search.analyzing': 'Analyzing...',
    'search.error.empty': 'Please enter an app name',
    'search.error.general': 'An error occurred during analysis, please try again later',
    'search.progress': 'Analysis Progress',
    'search.getting_data': 'Retrieving data from app stores...',
    'search.wait_message': 'Analysis typically takes 3-5 minutes, please be patient...',
    
    // Analysis Result
    'result.title': '{appName} Review Analysis',
    'result.date_range': 'Analysis Time Range',
    'result.reviews_count': 'Reviews Analyzed',
    'result.reviews_unit': 'reviews',
    'result.google_play': 'Google Play Analysis',
    'result.app_store': 'App Store Analysis',
    'result.app_store_analysis': 'App Store Review Analysis',
    'result.app_rating': 'Average Rating',
    'result.country': 'Region',
    'result.likes': 'Features Users Like',
    'result.dislikes': 'Features Users Dislike',
    'result.votes': 'votes',
    'result.feedback_examples': 'User Feedback Examples:',
    'result.no_appstore_data': 'Unable to retrieve App Store data, please try another app',
    
    // Features Section
    'features.title': 'Features',
    'features.subtitle': 'We provide comprehensive app review analysis to help you deeply understand user feedback',
    'features.multiplatform.title': 'Multi-platform Support',
    'features.multiplatform.description': 'Analyze reviews from both App Store and Google Play to get a complete view of user feedback.',
    'features.ranking.title': 'Feature Ranking',
    'features.ranking.description': 'Clearly display what users like and dislike, helping you identify product strengths and improvement opportunities.',
    'features.compliance.title': 'Compliant Data Processing',
    'features.compliance.description': 'Process user reviews in a compliant way, not displaying original comments to protect user privacy and platform rights.',
    
    // How It Works
    'how.title': 'How It Works',
    'how.subtitle': 'Three simple steps to get deep insights from app reviews',
    'how.step1.title': 'Enter App Name',
    'how.step1.description': 'Input the name of the app you want to analyze in the search box, and we will fetch user reviews from both App Store and Google Play.',
    'how.step2.title': 'Analyze Review Data',
    'how.step2.description': 'We collect reviews from the past six months, analyze user sentiment and mentioned features to extract key insights. The process typically takes a few minutes.',
    'how.step3.title': 'Get Insight Report',
    'how.step3.description': 'When analysis is complete, you\'ll see a detailed report including rankings of features users like and dislike, helping you understand product strengths and improvement opportunities.',
    
    // Testimonials
    'testimonials.title': 'Testimonials',
    'testimonials.subtitle': 'Hear what our users say',
    'testimonials.person1.name': 'John Smith',
    'testimonials.person1.position': 'Product Manager @Tech Co.',
    'testimonials.person1.quote': '"This tool helped us discover features that users really care about, greatly improving our product iteration efficiency. By analyzing user reviews, we gained a clearer understanding of user preferences and pain points."',
    'testimonials.person2.name': 'Jane Liu',
    'testimonials.person2.position': 'App Developer',
    'testimonials.person2.quote': '"As an independent developer, this tool has been a tremendous help. By understanding what features users like and dislike, I can optimize my application more effectively and improve user satisfaction."',
    'testimonials.person3.name': 'William Zhang',
    'testimonials.person3.position': 'Marketing Director @Startup',
    'testimonials.person3.quote': '"This analysis tool helps us better understand the strengths and weaknesses of competitors\' products, providing valuable reference for our marketing strategy. The data analysis is very intuitive and user-friendly."',
    
    // FAQ
    'faq.title': 'FAQ',
    'faq.subtitle': 'Frequently asked questions about our service',
    'faq.q1.title': 'How does this tool collect review data?',
    'faq.q1.answer': 'We use compliant methods to gather publicly available user review data from App Store and Google Play, limited to review dates, ratings, and content. We strictly control collection frequency and intervals to comply with platform regulations.',
    'faq.q2.title': 'Will the analysis results show original review content?',
    'faq.q2.answer': 'No. To protect user privacy and comply with platform regulations, we don\'t display original review content. We only show insights from our analysis, such as feature rankings and feedback examples with synonyms substitution.',
    'faq.q3.title': 'How long does it take to analyze an app?',
    'faq.q3.answer': 'Analysis time depends on the number of reviews and server load. Typically, analyzing six months of review data for an app takes 3-5 minutes. You can see progress indicators during the analysis process.',
    'faq.q4.title': 'How accurate are the analysis results?',
    'faq.q4.answer': 'We use advanced natural language processing to analyze reviews and accurately identify features and sentiments mentioned by users. While technology continues to improve, analysis results may still have some margin of error, so we recommend using your judgment alongside our insights.',
    
    // Pricing
    'pricing.title': 'Pricing',
    'pricing.subtitle': 'Choose a plan that fits your needs',
    'pricing.basic.title': 'Basic',
    'pricing.basic.description': 'For individual developers and small teams',
    'pricing.basic.price': '$0',
    'pricing.basic.period': '/month',
    'pricing.basic.feature1': '3 app analyses per month',
    'pricing.basic.feature2': 'Last 3 months of review data',
    'pricing.basic.feature3': 'Basic feature insights',
    'pricing.basic.cta': 'Get Started',
    'pricing.pro.title': 'Professional',
    'pricing.pro.description': 'For small to medium businesses and professional teams',
    'pricing.pro.tag': 'Recommended',
    'pricing.pro.price': '$29',
    'pricing.pro.period': '/month',
    'pricing.pro.feature1': '15 app analyses per month',
    'pricing.pro.feature2': 'Last 6 months of review data',
    'pricing.pro.feature3': 'Advanced feature insights',
    'pricing.pro.feature4': 'Competitor comparison',
    'pricing.pro.cta': 'Choose Plan',
    'pricing.enterprise.title': 'Enterprise',
    'pricing.enterprise.description': 'For large enterprises and advanced needs',
    'pricing.enterprise.price': '$149',
    'pricing.enterprise.period': '/month',
    'pricing.enterprise.feature1': 'Unlimited app analyses',
    'pricing.enterprise.feature2': 'Last 12 months of review data',
    'pricing.enterprise.feature3': 'Comprehensive feature insights',
    'pricing.enterprise.feature4': 'Market trend analysis',
    'pricing.enterprise.feature5': 'Dedicated customer support',
    'pricing.enterprise.cta': 'Contact Us',
    
    // Footer
    'footer.links': 'Quick Links',
    'footer.support': 'Support',
    'footer.privacy': 'Privacy Policy',
    'footer.terms': 'Terms of Service',
    'footer.contact': 'Contact Us',
    'footer.contact.email': 'Email: contact@example.com',
    'footer.copyright': '© {year} {siteName}. Data sourced from app stores, copyright belongs to platforms and users.',
    
    // Feedback Examples
    'feedback.liked.default1': 'Users express satisfaction with this feature',
    'feedback.liked.default2': 'This feature received positive feedback',
    'feedback.liked.default3': 'Users find this feature practical',
    'feedback.disliked.default1': 'Users express dissatisfaction with this feature',
    'feedback.disliked.default2': 'This feature received improvement suggestions',
    'feedback.disliked.default3': 'Users wish this feature could be optimized',
    
    // Date format
    'date.format': '{startDate} to {endDate}',
  }
};

// 创建Provider组件
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('zh');

  // 翻译函数
  const t = (key: string, params?: Record<string, string>) => {
    let text = translations[language][key as keyof typeof translations[typeof language]] || key;
    
    // 替换参数
    if (params) {
      Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
      });
    }
    
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

// 创建hook以便组件使用
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}; 