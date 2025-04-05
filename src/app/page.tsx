'use client';

import Footer from '@/components/Footer';
import Link from 'next/link';
import Image from 'next/image';
import AppAnalyzer from '@/components/AppAnalyzer';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Home() {
  const { t } = useLanguage();
  
  return (
    <main>
      {/* Hero Section */}
      <section className="relative bg-white" id="hero">
        <div className="container py-16">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block text-primary-600">{t('hero.title1')}</span>
              <span className="block">{t('hero.title2')}</span>
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              {t('hero.description')}
            </p>
          </div>
          
          <div className="mt-12">
            <AppAnalyzer />
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className="bg-gray-50 section" id="features">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('features.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('features.subtitle')}
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
              <h3 className="text-xl font-medium text-gray-900">{t('features.multiplatform.title')}</h3>
              <p className="mt-4 text-gray-600">
                {t('features.multiplatform.description')}
              </p>
            </div>
            
            {/* Feature 2 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-5 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">{t('features.ranking.title')}</h3>
              <p className="mt-4 text-gray-600">
                {t('features.ranking.description')}
              </p>
            </div>
            
            {/* Feature 3 */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <div className="mb-5 rounded-full bg-primary-100 p-3 text-primary-600 inline-block">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900">{t('features.compliance.title')}</h3>
              <p className="mt-4 text-gray-600">
                {t('features.compliance.description')}
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
              {t('how.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('how.subtitle')}
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
                  {t('how.step1.title')}
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  {t('how.step1.description')}
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
                  {t('how.step2.title')}
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  {t('how.step2.description')}
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
                  {t('how.step3.title')}
                </h3>
                <p className="mt-4 text-lg text-gray-600">
                  {t('how.step3.description')}
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="bg-gray-50 section" id="testimonials">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              {t('testimonials.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('testimonials.subtitle')}
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
                  <h4 className="text-lg font-medium text-gray-900">{t('testimonials.person1.name')}</h4>
                  <p className="text-sm text-gray-600">{t('testimonials.person1.position')}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  {t('testimonials.person1.quote')}
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
                  <h4 className="text-lg font-medium text-gray-900">{t('testimonials.person2.name')}</h4>
                  <p className="text-sm text-gray-600">{t('testimonials.person2.position')}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  {t('testimonials.person2.quote')}
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
                  <h4 className="text-lg font-medium text-gray-900">{t('testimonials.person3.name')}</h4>
                  <p className="text-sm text-gray-600">{t('testimonials.person3.position')}</p>
                </div>
              </div>
              <div className="mt-6">
                <p className="text-gray-600">
                  {t('testimonials.person3.quote')}
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
              {t('faq.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('faq.subtitle')}
            </p>
          </div>
          <div className="mt-16 grid gap-8 md:grid-cols-2">
            {/* FAQ Item 1 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                {t('faq.q1.title')}
              </h3>
              <p className="mt-4 text-gray-600">
                {t('faq.q1.answer')}
              </p>
            </div>
            
            {/* FAQ Item 2 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                {t('faq.q2.title')}
              </h3>
              <p className="mt-4 text-gray-600">
                {t('faq.q2.answer')}
              </p>
            </div>
            
            {/* FAQ Item 3 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                {t('faq.q3.title')}
              </h3>
              <p className="mt-4 text-gray-600">
                {t('faq.q3.answer')}
              </p>
            </div>
            
            {/* FAQ Item 4 */}
            <div>
              <h3 className="text-xl font-medium text-gray-900">
                {t('faq.q4.title')}
              </h3>
              <p className="mt-4 text-gray-600">
                {t('faq.q4.answer')}
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
              {t('pricing.title')}
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              {t('pricing.subtitle')}
            </p>
          </div>
          <div className="mt-16 grid gap-8 lg:grid-cols-3">
            {/* Basic Plan */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="text-xl font-medium text-gray-900">{t('pricing.basic.title')}</h3>
              <p className="mt-4 text-sm text-gray-600">
                {t('pricing.basic.description')}
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">{t('pricing.basic.price')}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">{t('pricing.basic.period')}</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.basic.feature1')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.basic.feature2')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.basic.feature3')}</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/#hero" className="btn btn-primary w-full">
                  {t('pricing.basic.cta')}
                </Link>
              </div>
            </div>
            
            {/* Pro Plan */}
            <div className="relative rounded-lg bg-white p-8 shadow-lg">
              <div className="absolute -top-3 left-0 right-0 mx-auto w-32 rounded-full bg-primary-600 py-1 text-center text-sm font-medium text-white">
                {t('pricing.pro.tag')}
              </div>
              <h3 className="text-xl font-medium text-gray-900">{t('pricing.pro.title')}</h3>
              <p className="mt-4 text-sm text-gray-600">
                {t('pricing.pro.description')}
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">{t('pricing.pro.price')}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">{t('pricing.pro.period')}</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.pro.feature1')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.pro.feature2')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.pro.feature3')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.pro.feature4')}</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/#hero" className="btn btn-primary w-full">
                  {t('pricing.pro.cta')}
                </Link>
              </div>
            </div>
            
            {/* Enterprise Plan */}
            <div className="rounded-lg bg-white p-8 shadow-sm">
              <h3 className="text-xl font-medium text-gray-900">{t('pricing.enterprise.title')}</h3>
              <p className="mt-4 text-sm text-gray-600">
                {t('pricing.enterprise.description')}
              </p>
              <div className="mt-6">
                <p className="flex items-baseline">
                  <span className="text-5xl font-bold tracking-tight text-gray-900">{t('pricing.enterprise.price')}</span>
                  <span className="ml-1 text-xl font-medium text-gray-500">{t('pricing.enterprise.period')}</span>
                </p>
              </div>
              <ul className="mt-8 space-y-4">
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.enterprise.feature1')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.enterprise.feature2')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.enterprise.feature3')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.enterprise.feature4')}</p>
                </li>
                <li className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="ml-3 text-gray-600">{t('pricing.enterprise.feature5')}</p>
                </li>
              </ul>
              <div className="mt-8">
                <Link href="/#hero" className="btn btn-primary w-full">
                  {t('pricing.enterprise.cta')}
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