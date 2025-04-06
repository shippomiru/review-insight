'use client';

import Link from 'next/link';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Footer() {
  const { t, language } = useLanguage();
  
  return (
    <footer className="bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{t('site.name')}</h3>
            <p className="mt-4 text-sm text-gray-600">
              {t('hero.description')}
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">{t('footer.links')}</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-primary-600">
                  {t('nav.features')}
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-primary-600">
                  {t('nav.how_it_works')}
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-gray-600 hover:text-primary-600">
                  {t('nav.pricing')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">{t('footer.support')}</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/#faq" className="text-sm text-gray-600 hover:text-primary-600">
                  {t('nav.faq')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-600">
                  {t('footer.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-600">
                  {t('footer.terms')}
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">{t('footer.contact')}</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                {t('footer.contact.email')}
              </li>
              <li>
                <a 
                  href={language === 'zh' 
                    ? "https://khwde0rk62.feishu.cn/share/base/form/shrcnHncbAgLL9oleBalnzYpNtg" 
                    : "https://khwde0rk62.feishu.cn/share/base/form/shrcnrVLX9UmxzPNb506ymFhRrh"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-gray-600 hover:text-primary-600"
                >
                  {t('footer.feedback')}
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-500">
            {t('footer.copyright', { year: new Date().getFullYear().toString(), siteName: t('site.name') })}
          </p>
        </div>
      </div>
    </footer>
  );
} 