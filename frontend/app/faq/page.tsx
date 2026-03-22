import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "よくある質問",
  robots: { index: true, follow: true },
};

const faqs = [
  {
    id: "anonymous",
    question: "本当に匿名ですか？",
    answer:
      "はい、完全に匿名です。投稿時にアカウント登録は不要で、氏名・メールアドレスなどの個人情報は一切収集していません。IPアドレスも投稿内容と紐づけた形では保存しておらず、誰が投稿したかを特定することはできません。",
  },
  {
    id: "delete",
    question: "投稿したデータは後で消せますか？",
    answer:
      "投稿後に管理画面から個人が直接削除することはできませんが、削除依頼フォームからお申し込みいただければ対応します。投稿内容と投稿日時を記載の上、お問い合わせページの削除依頼フォームよりご連絡ください。",
  },
  {
    id: "credibility",
    question: "データの信憑性はどのくらいありますか？",
    answer:
      "DevPay に掲載されているデータはユーザーが自主的に投稿したものです。すべての投稿は管理者が内容を確認してから公開しており、明らかに不正確・虚偽と判断されるものは非公開にしています。ただし、投稿内容の正確性をDevPayが保証するものではありません。参考情報としてご活用ください。" +
      "※本サービスの初期データは、各社が公開している採用情報や統計に基づき、独自に算出した推定値を含みます",
  },
  {
    id: "when-published",
    question: "投稿はいつ公開されますか？",
    answer:
      "投稿後、管理者が内容を確認してから公開します。通常は数日以内に公開されますが、投稿数によっては時間がかかる場合があります。",
  },
  {
    id: "free",
    question: "無料で使えますか？",
    answer: "はい、DevPay はすべての機能を無料でご利用いただけます。アカウント登録も不要です。",
  },
  {
    id: "what-companies",
    question: "どんな企業の情報が見られますか？",
    answer:
      "日本のIT企業全般が対象です。外資系・国内系を問わず、ソフトウェアエンジニアやデータサイエンティストなどの情報が投稿されています。掲載企業は投稿によって増えていきます。",
  },
  {
    id: "inappropriate",
    question: "不適切な投稿を見かけた場合はどうすればいいですか？",
    answer:
      "お問い合わせページよりご報告ください。確認の上、不適切と判断した場合は速やかに削除対応します。",
  },
  {
    id: "edit",
    question: "投稿内容を後から修正できますか？",
    answer:
      "現在、投稿者本人が直接修正する機能は提供していません。修正が必要な場合はお問い合わせページよりご連絡ください。",
  },
];

export default function FaqPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">よくある質問（FAQ）</h1>
      <p className="text-sm text-gray-500 mb-10">DevPay についてよくいただく質問をまとめました。</p>

      <div className="space-y-4">
        {faqs.map((faq) => (
          <div key={faq.id} id={faq.id} className="bg-white border border-gray-200 rounded-2xl p-6">
            <p className="font-semibold text-gray-900 mb-3">Q. {faq.question}</p>
            <p className="text-sm text-gray-600 leading-relaxed">A. {faq.answer}</p>
          </div>
        ))}
      </div>

      <div className="mt-10 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
        <p className="text-sm text-gray-600 mb-3">解決しない場合はお気軽にお問い合わせください</p>
        <Link
          href="/contact"
          className="inline-block bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700"
        >
          お問い合わせ
        </Link>
      </div>
    </div>
  );
}
