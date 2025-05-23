'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AppAnalyzer from '@/components/AppAnalyzer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function SearchPage() {
  const { t } = useLanguage();

  return (
    <main>
      <Header />
      
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('search.title') || '应用评价分析'}
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              {t('search.description') || '输入应用名称，获取用户评价洞察'}
            </p>
          </div>
          
          <div className="mt-12">
            <AppAnalyzer />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 