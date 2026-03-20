import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* ブランド */}
          <div className="md:col-span-1">
            <p className="text-xl font-bold text-blue-600 mb-3">DevPay</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              日本のITエンジニアのための<br />
              給与・面接情報共有プラットフォーム
            </p>
          </div>

          {/* サービス */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">サービス</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/companies" className="hover:text-blue-600 transition-colors">企業一覧</Link></li>
              <li><Link href="/ranking" className="hover:text-blue-600 transition-colors">年収ランキング</Link></li>
              <li><Link href="/interviews" className="hover:text-blue-600 transition-colors">面接体験</Link></li>
              <li><Link href="/submit" className="hover:text-blue-600 transition-colors">体験をシェア</Link></li>
            </ul>
          </div>

          {/* ヘルプ */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">ヘルプ</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/faq" className="hover:text-blue-600 transition-colors">よくある質問（FAQ）</Link></li>
              <li><Link href="/contact" className="hover:text-blue-600 transition-colors">お問い合わせ</Link></li>
              <li><Link href="/contact#delete" className="hover:text-blue-600 transition-colors">投稿の削除依頼</Link></li>
              <li><Link href="/faq#credibility" className="hover:text-blue-600 transition-colors">データの信憑性について</Link></li>
            </ul>
          </div>

          {/* 法的情報 */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-3">法的情報</p>
            <ul className="space-y-2 text-sm text-gray-500">
              <li><Link href="/terms" className="hover:text-blue-600 transition-colors">利用規約</Link></li>
              <li><Link href="/privacy" className="hover:text-blue-600 transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/tokusho" className="hover:text-blue-600 transition-colors">特定商取引法に基づく表示</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} DevPay - 日本ITエンジニア給与データベース
        </div>
      </div>
    </footer>
  );
}
