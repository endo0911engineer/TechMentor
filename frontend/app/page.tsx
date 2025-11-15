'use client'

import { ChevronRight, Code, Users, Zap, Star, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0e27] text-white overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-[#1e2749]/50 backdrop-blur-md bg-[#0a0e27]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="text-xl font-bold tracking-tight">
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              TechMentor
            </span>
          </div>
          <div className="flex gap-8 items-center">
            <a href="#" className="text-sm text-gray-400 hover:text-white transition">
              機能
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition">
              プライシング
            </a>
            <a href="#" className="text-sm text-gray-400 hover:text-white transition">
              ブログ
            </a>
            <button className="px-6 py-2 bg-white text-[#0a0e27] rounded-full font-medium hover:bg-gray-100 transition text-sm">
              ログイン
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-24 px-6 relative">
        <div className="max-w-6xl mx-auto">
          {/* Background gradient */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl opacity-50" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl opacity-50" />
          
          <div className="relative z-10">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-[#1e2749] rounded-full text-sm text-cyan-400 border border-cyan-400/30">
                🚀 エンジニアと企業のベストマッチング
              </span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-bold mb-6 text-center leading-tight">
              スキルで、
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                キャリアを見つけよう
              </span>
            </h1>
            
            <p className="text-xl text-gray-400 text-center max-w-2xl mx-auto mb-12">
              メガベンチャーや外資IT企業を目指すエンジニア必見。スキルと経験で、自分にぴったりな企業とマッチング。Native Campのような手軽さで、キャリア開発を実現します。
            </p>
            
            <div className="flex gap-4 justify-center flex-wrap">
              <button className="px-8 py-4 bg-white text-[#0a0e27] rounded-full font-semibold hover:bg-gray-100 transition flex items-center gap-2">
                今すぐ始める
                <ArrowRight size={20} />
              </button>
              <button className="px-8 py-4 border-2 border-cyan-400/50 text-white rounded-full font-semibold hover:border-cyan-400 hover:bg-cyan-400/10 transition">
                デモを見る
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 mt-24 pt-12 border-t border-[#1e2749]/50">
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent mb-2">
                5,000+
              </div>
              <p className="text-gray-400">登録エンジニア</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                500+
              </div>
              <p className="text-gray-400">企業パートナー</p>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                98%
              </div>
              <p className="text-gray-400">マッチング成功率</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6 border-t border-[#1e2749]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              なぜEngineerMatchを選ぶのか
            </h2>
            <p className="text-xl text-gray-400">
              プロフェッショナルなエンジニアのためのプラットフォーム
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl bg-[#1e2749]/50 border border-[#1e2749] hover:border-cyan-400/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Code size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">スキルベースのマッチング</h3>
              <p className="text-gray-400">
                あなたのスキルセットと経験を分析し、最適な企業を自動提案。自分の強みが活かせる環境を見つけられます。
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl bg-[#1e2749]/50 border border-[#1e2749] hover:border-blue-400/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">メンターシップ・セッション</h3>
              <p className="text-gray-400">
                業界の一線で活躍するエンジニアから学べる。キャリア相談からスキルアップまで、あらゆる段階でサポート。
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl bg-[#1e2749]/50 border border-[#1e2749] hover:border-purple-400/50 transition group">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center mb-6 group-hover:scale-110 transition">
                <Zap size={24} />
              </div>
              <h3 className="text-xl font-bold mb-3">高速マッチング</h3>
              <p className="text-gray-400">
                Native Campのように気軽に始められる。プロフィール作成から初回マッチまで、わずか数分で完了。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 px-6 border-t border-[#1e2749]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              マッチングの流れ
            </h2>
            <p className="text-xl text-gray-400">
              シンプルな3ステップでキャリアチェンジ
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                title: 'プロフィール作成',
                description: 'スキル、経験、キャリア目標を登録。AIがあなたのプロフィールを分析します。',
                icon: '📝'
              },
              {
                step: '02',
                title: 'スキル診断',
                description: 'テクニカルスキルを診断。あなたの強みと改善点を可視化します。',
                icon: '🎯'
              },
              {
                step: '03',
                title: 'マッチング開始',
                description: '最適な企業やメンターを自動提案。いますぐセッションを開始できます。',
                icon: '🚀'
              }
            ].map((item, idx) => (
              <div key={idx} className="relative">
                {/* Connecting line */}
                {idx < 2 && (
                  <div className="hidden md:block absolute top-20 -right-4 w-8 h-1 bg-gradient-to-r from-cyan-400 to-transparent" />
                )}
                
                <div className="p-8 rounded-2xl bg-[#1e2749]/50 border border-[#1e2749]">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <div className="text-cyan-400 font-bold text-sm mb-2">ステップ {item.step}</div>
                  <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                  <p className="text-gray-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6 border-t border-[#1e2749]/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              ユーザーの声
            </h2>
            <p className="text-xl text-gray-400">
              実際にキャリアチェンジを実現したエンジニアたち
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                name: '田中太郎',
                role: 'フリーランスエンジニア → Google Japan',
                image: '👨‍💻',
                text: 'EngineerMatchのおかげで、理想のキャリアを実現できました。メンターシップセッションでの学びは、本当に価値があります。'
              },
              {
                name: '佐藤花子',
                role: 'スタートアップ → メタ',
                image: '👩‍💻',
                text: 'スキルベースのマッチングが本当に的確。自分の強みが活かせる環境を見つけられて、今では開発が心から楽しい。'
              },
              {
                name: '鈴木健一',
                role: 'エンタープライズSE → AWS',
                image: '🧑‍💻',
                text: '業界の第一線で活躍する方からの指導は、独学では得られない知見ばかり。キャリア形成が加速しました。'
              },
              {
                name: '山田美咲',
                role: '新卒エンジニア → Amazon',
                image: '👧',
                text: '新卒からでも利用できるのが素晴らしい。早い段階で質の高いメンターに出会えたのは、本当に大きなアドバンテージです。'
              }
            ].map((testimonial, idx) => (
              <div key={idx} className="p-8 rounded-2xl bg-[#1e2749]/50 border border-[#1e2749] hover:border-cyan-400/30 transition">
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-4xl">{testimonial.image}</div>
                  <div>
                    <p className="font-bold">{testimonial.name}</p>
                    <p className="text-sm text-cyan-400">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="currentColor" className="text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-300">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t border-[#1e2749]/50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            あなたのキャリアを、次のレベルへ
          </h2>
          <p className="text-xl text-gray-400 mb-12">
            今すぐEngineerMatchに登録して、メガベンチャー・外資IT企業への道を開きましょう
          </p>
          <button className="px-10 py-5 bg-white text-[#0a0e27] rounded-full font-bold text-lg hover:bg-gray-100 transition inline-flex items-center gap-3">
            今すぐ登録する
            <ChevronRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#1e2749]/50 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-lg mb-4 bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                EngineerMatch
              </h3>
              <p className="text-gray-400 text-sm">
                エンジニアのキャリア開発を、一気に加速させる。
              </p>
            </div>
            <div>
              <p className="font-bold mb-4">プロダクト</p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">料金</a></li>
                <li><a href="#" className="hover:text-white transition">セキュリティ</a></li>
                <li><a href="#" className="hover:text-white transition">ロードマップ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">会社</p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">ブログ</a></li>
                <li><a href="#" className="hover:text-white transition">キャリア</a></li>
                <li><a href="#" className="hover:text-white transition">お問い合わせ</a></li>
              </ul>
            </div>
            <div>
              <p className="font-bold mb-4">フォロー</p>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Twitter</a></li>
                <li><a href="#" className="hover:text-white transition">LinkedIn</a></li>
                <li><a href="#" className="hover:text-white transition">GitHub</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-[#1e2749]/50 flex justify-between items-center text-gray-400 text-sm">
            <p>© 2025 EngineerMatch. All rights reserved.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition">プライバシーポリシー</a>
              <a href="#" className="hover:text-white transition">利用規約</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}