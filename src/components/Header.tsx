'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'zh' ? 'en' : 'zh');
  };

  return (
    <header className="relative bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center text-xl font-bold text-primary-600">
            <span>{t('site.name')}</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li>
                <Link href="/#features" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {t('nav.how_it_works')}
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {t('nav.testimonials')}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {t('nav.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  {t('nav.faq')}
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={toggleLanguage}
            className="flex items-center justify-center rounded-md border border-gray-300 px-3 py-1 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>
        </div>
      </div>
    </header>
  );
} 