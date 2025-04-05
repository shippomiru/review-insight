'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';

export default function TestPage() {
  return (
    <main>
      <Header />
      
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              测试页面
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              这是一个测试页面，用于确认路由正常工作
            </p>
            
            <div className="mt-8 flex justify-center space-x-4">
              <Link href="/" className="btn btn-primary">回到首页</Link>
              <Link href="/search" className="btn btn-secondary">去搜索页</Link>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 