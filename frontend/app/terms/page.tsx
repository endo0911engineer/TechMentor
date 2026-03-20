export default function TermsPage() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">利用規約</h1>
      <p className="text-sm text-gray-500 mb-10">最終更新日：2024年1月1日</p>

      <div className="space-y-8 text-sm text-gray-700 leading-relaxed">
        <section>
          <h2 className="font-bold text-gray-900 mb-3">第1条（適用）</h2>
          <p>
            本利用規約（以下「本規約」）は、DevPay（以下「本サービス」）の利用条件を定めるものです。
            ユーザーの皆様には、本規約に従って本サービスをご利用いただきます。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第2条（禁止事項）</h2>
          <p className="mb-2">ユーザーは、本サービスの利用にあたり、以下の行為をしてはなりません。</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>虚偽または誤解を招く情報の投稿</li>
            <li>他者を誹謗中傷する内容の投稿</li>
            <li>個人が特定できる情報の投稿</li>
            <li>著作権その他の知的財産権を侵害する行為</li>
            <li>本サービスの運営を妨害する行為</li>
            <li>その他、法令または公序良俗に違反する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第3条（投稿コンテンツ）</h2>
          <p>
            ユーザーが投稿したコンテンツの著作権はユーザーに帰属しますが、本サービスへの投稿をもって、
            運営者は当該コンテンツをサービス内で無償・無期限に利用する権利が付与されるものとします。
            投稿内容は管理者の確認後に公開されます。不適切と判断した場合、投稿を削除または非公開にする
            場合があります。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第4条（免責事項）</h2>
          <p>
            本サービスに掲載されている情報は、ユーザーによる自主的な投稿に基づくものであり、
            その正確性・完全性を運営者が保証するものではありません。本サービスの利用に起因して
            生じた損害について、運営者は一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第5条（サービスの変更・停止）</h2>
          <p>
            運営者は、ユーザーへの事前通知なく本サービスの内容を変更し、または本サービスの提供を
            停止・終了することができます。これによりユーザーに損害が生じた場合でも、運営者は
            一切の責任を負いません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第6条（規約の変更）</h2>
          <p>
            運営者は必要に応じて本規約を変更することができます。変更後の規約はサービス上に掲示した
            時点から効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-gray-900 mb-3">第7条（準拠法・管轄裁判所）</h2>
          <p>
            本規約の解釈にあたっては日本法を準拠法とし、本サービスに関して生じた紛争については
            東京地方裁判所を第一審の専属的合意管轄裁判所とします。
          </p>
        </section>
      </div>
    </div>
  );
}
