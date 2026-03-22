import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-gray-500 mb-10">最終更新日：2024年1月1日</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 mb-3">収集する情報</h2>
          <p className="mb-2">本サービスでは、以下の情報を収集することがあります。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>投稿フォームに入力された情報（企業名・年収・面接体験など）</li>
            <li>アクセスログ（IPアドレス、ブラウザ情報、アクセス日時など）</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">情報の利用目的</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>本サービスの提供・運営・改善</li>
            <li>不正利用の検知・防止</li>
            <li>利用状況の分析</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">個人情報の取り扱い</h2>
          <p>
            本サービスへの投稿にアカウント登録は不要であり、氏名・メールアドレスなどの個人情報は
            収集していません。投稿内容と個人を紐づけた形でのデータ管理は行っておりません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第三者への情報提供</h2>
          <p>
            運営者は、法令に基づく場合を除き、収集した情報を第三者に提供・開示しません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">Cookieについて</h2>
          <p>
            本サービスでは、管理画面の認証情報の保持などの目的でセッションストレージを利用しています。
            これらはブラウザの設定から無効にすることが可能ですが、一部機能が制限される場合があります。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">アクセス解析</h2>
          <p>
            本サービスでは、サービス改善のためにアクセス解析ツールを使用する場合があります。
            解析ツールはCookieを使用してアクセス情報を収集しますが、個人を特定する情報は含まれません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">プライバシーポリシーの変更</h2>
          <p>
            運営者は必要に応じて本ポリシーを変更することがあります。重要な変更がある場合は
            サービス上でお知らせします。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">お問い合わせ</h2>
          <p>
            個人情報の取り扱いに関するお問い合わせは、
            <a href="/contact" className="text-blue-600 hover:underline">お問い合わせページ</a>
            よりご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
