import Link from 'next/link';

export default function Header() {
  return (
    <header className="relative bg-white shadow-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center text-xl font-bold text-primary-600">
            <span>反馈分析</span>
          </Link>
          <nav className="hidden md:flex">
            <ul className="flex space-x-8">
              <li>
                <Link href="/#features" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  功能特点
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  使用流程
                </Link>
              </li>
              <li>
                <Link href="/#testimonials" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  用户反馈
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  价格方案
                </Link>
              </li>
              <li>
                <Link href="/#faq" className="text-sm font-medium text-gray-700 hover:text-primary-600">
                  常见问题
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <Link href="/search" className="btn btn-primary">
            立即分析
          </Link>
        </div>
      </div>
    </header>
  );
} 