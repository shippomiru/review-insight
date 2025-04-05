import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SearchForm from '@/components/SearchForm';

export default function SearchPage() {
  return (
    <main>
      <Header />
      
      <section className="section">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              应用评价分析
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              输入应用名称，获取用户评价洞察
            </p>
          </div>
          
          <div className="mt-12">
            <SearchForm />
          </div>
        </div>
      </section>
      
      <Footer />
    </main>
  );
} 