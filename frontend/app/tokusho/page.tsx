import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  robots: { index: true, follow: true },
};

const items: { label: string; value: string }[] = [
  { label: "サービス名", value: "DevPay" },
  { label: "運営責任者", value: "DevPay 運営事務局" },
  { label: "所在地", value: "お問い合わせよりご確認ください" },
  { label: "電話番号", value: "お問い合わせフォームをご利用ください" },
  { label: "メールアドレス", value: "お問い合わせフォームをご利用ください" },
  { label: "サービスの対価", value: "無料（現時点で有料サービスはありません）" },
  { label: "支払方法", value: "該当なし" },
  { label: "サービスの提供時期", value: "申込後、即時提供" },
  { label: "返品・キャンセルについて", value: "デジタルコンテンツのため返品・キャンセルは受け付けておりません" },
  { label: "動作環境", value: "モダンブラウザ（Chrome, Firefox, Safari, Edge の最新版）" },
];

export default function TokushoPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">特定商取引法に基づく表示</h1>
      <p className="text-sm text-gray-500 mb-10">
        特定商取引法第11条に基づき、以下の事項を表示します。
      </p>

      <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
        {items.map((item, i) => (
          <div
            key={i}
            className={`flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 px-6 py-4 text-sm ${
              i !== items.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <dt className="font-medium text-gray-600 sm:w-40 shrink-0">{item.label}</dt>
            <dd className="text-gray-800">{item.value}</dd>
          </div>
        ))}
      </div>

      <p className="text-xs text-gray-400 mt-6">
        ※ お問い合わせは
        <a href="/contact" className="text-blue-600 hover:underline mx-1">こちら</a>
        からご連絡ください。
      </p>
    </div>
  );
}
