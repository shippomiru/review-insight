import './globals.css';
import type { Metadata } from 'next';
import { LanguageProvider } from '@/contexts/LanguageContext';

export const metadata: Metadata = {
  title: 'AppInsight｜Multi-Platform Review Analyzer - Find Hidden Opportunities',
  description: 'Analyze app reviews across platforms with AI. Discover top loved/hated features, uncover competitors\' blind spots, and get actionable insights in minutes.',
  keywords: [],
  metadataBase: new URL('https://heartheusers.com'),
  alternates: {
    canonical: 'https://heartheusers.com',
  },
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
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
} 