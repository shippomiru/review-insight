import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-50">
      <div className="container py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">反馈分析</h3>
            <p className="mt-4 text-sm text-gray-600">
              获取应用用户评价洞察，了解用户最喜欢和最不满意的功能。
            </p>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">快速链接</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/#features" className="text-sm text-gray-600 hover:text-primary-600">
                  功能特点
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="text-sm text-gray-600 hover:text-primary-600">
                  使用流程
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="text-sm text-gray-600 hover:text-primary-600">
                  价格方案
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">支持</h4>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/#faq" className="text-sm text-gray-600 hover:text-primary-600">
                  常见问题
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-sm text-gray-600 hover:text-primary-600">
                  隐私政策
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-sm text-gray-600 hover:text-primary-600">
                  使用条款
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-base font-medium text-gray-900">联系我们</h4>
            <ul className="mt-4 space-y-2">
              <li className="text-sm text-gray-600">
                邮箱: contact@example.com
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-200 pt-6">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} 反馈分析. 数据来源于应用商店，版权归平台和用户所有。
          </p>
        </div>
      </div>
    </footer>
  );
} 