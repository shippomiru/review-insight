import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/contexts/LanguageContext';
import Header from '@/components/Header';

export const metadata: Metadata = {
  title: '用户反馈趋势分析 - 了解应用评价洞察',
  description: '分析 App Store 和 Google Play 的用户评论，获取应用评价洞察，了解用户最喜欢和最不满意的功能。',
  keywords: '应用评价分析, 用户反馈趋势, App Store 评论分析, Google Play 评论分析, 应用市场调研',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body>
        <LanguageProvider>
          <Header />
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 