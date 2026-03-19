import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          DevPay
        </Link>
        <div className="flex items-center gap-6 text-sm font-medium text-gray-600">
          <Link href="/companies" className="hover:text-blue-600 transition-colors">
            企業一覧
          </Link>
          <Link href="/ranking" className="hover:text-blue-600 transition-colors">
            年収ランキング
          </Link>
          <Link href="/interviews" className="hover:text-blue-600 transition-colors">
            面接体験
          </Link>
          <Link
            href="/submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            体験をシェア
          </Link>
        </div>
      </div>
    </nav>
  );
}
