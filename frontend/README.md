frontend/
├── app/                       # Next.js App Router (pagesより推奨)
│   ├── layout.tsx             # 共通レイアウト
│   ├── page.tsx               # トップページ
│   ├── login/
│   │   └── page.tsx           # ログインページ
│   ├── register/
│   │   └── page.tsx           # 新規登録ページ
│   ├── profile/
│   │   ├── page.tsx           # プロフィール編集ページ
│   │   └── [userId]/page.tsx  # プロフィール詳細ページ
│   ├── search/
│   │   └── page.tsx           # 面接官検索ページ
│   ├── interviewer/
│   │   └── [id]/
│   │       ├── page.tsx       # 面接官詳細ページ
│   │       └── schedule.tsx   # 面接官スケジュール確認
│   ├── booking/
│   │   └── page.tsx           # 面接予約ページ
│   ├── payment/
│   │   └── page.tsx           # 支払いページ
│   ├── interview/
│   │   └── [id]/page.tsx      # ビデオ面接ページ
│   ├── feedback/
│   │   └── [interviewId]/page.tsx  # フィードバック閲覧ページ
│   ├── history/
│   │   └── page.tsx           # 面接履歴・レビュー投稿ページ
│   └── admin/
│       ├── page.tsx           # 管理者トップ
│       ├── users/
│       │   └── page.tsx       # ユーザー管理
│       ├── interviewers/
│       │   └── page.tsx       # 面接官管理
│       ├── schedules/
│       │   └── page.tsx       # 面接履歴管理
│       └── payments/
│           └── page.tsx       # 決済・報酬管理
│
├── components/                # UIコンポーネント
│   ├── common/                # ボタン、モーダル、入力フォーム
│   ├── user/                  # ユーザー向け部品
│   ├── interviewer/           # 面接官向け部品
│   └── admin/                 # 管理者向け部品
│
├── hooks/                     # カスタムフック（API呼び出し、フォーム管理）
│   ├── useAuth.ts
│   ├── useBooking.ts
│   └── useInterview.ts
│
├── lib/                       # ライブラリ・APIクライアント
│   ├── api.ts                 # fetch / axios ラッパー
│   ├── auth.ts                # 認証処理
│   └── utils.ts               # 共通ユーティリティ
│
├── context/                   # React Context（ログイン状態、テーマなど）
│   └── AuthContext.tsx
│
├── styles/                    # Tailwind CSS + グローバルスタイル
│   └── globals.css
│
├── types/                     # TypeScript 型定義（APIレスポンス型、フォーム型）
│   ├── user.ts
│   ├── interview.ts
│   └── payment.ts
│
└── tests/                     # フロント単体テスト
    ├── components/
    └── pages/
