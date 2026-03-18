# TASKS.md

開発タスク一覧

---

# Phase 1

プロジェクトセットアップ

* Next.js プロジェクト作成
* FastAPI プロジェクト作成
* Docker環境構築
* PostgreSQL接続設定
* 環境変数設定

---

# Phase 2

データベース設計

* Companyテーブル作成
* SalarySubmissionテーブル作成
* InterviewSubmissionテーブル作成
* Articleテーブル作成

マイグレーションツール導入（Alembic）

---

# Phase 3

バックエンドAPI実装

Company API

* GET /companies
* GET /companies/{id}

Submission API

* POST /salary-submissions
* POST /interview-submissions

Company submissions

* GET /companies/{id}/submissions

Article API

* GET /articles
* GET /articles/{id}

---

# Phase 4

フロントエンド実装

トップページ

* サービス概要
* 人気企業表示

企業一覧ページ

* 企業検索
* 企業カード表示

企業詳細ページ

* 企業情報表示
* 年収統計表示
* 投稿一覧表示

投稿ページ

* 給与投稿フォーム
* 面接体験投稿フォーム

記事ページ

* SEO記事表示

---

# Phase 5

集計機能

企業年収統計

* 平均年収
* 中央値
* 年収レンジ

ランキングページ

* 年収ランキング

---

# Phase 6

管理機能

管理画面

* 投稿承認
* 投稿削除
* 企業追加
* 記事作成

---

# Phase 7

インフラ構築

AWS設定

* ECS クラスター作成
* RDS PostgreSQL作成
* S3バケット作成
* CloudFront設定

CI/CD

* GitHub Actions
* Docker build
* ECS deploy

---

# Phase 8

MVPローンチ

初期データ作成

* 企業100社登録
* 企業概要作成
* SEO記事10本作成

公開

* ドメイン設定
* SSL設定
* Google Search Console登録

---

# Phase 9

成長施策

* SEO記事拡充
* 投稿促進
* SNSマーケティング
* エンジニアコミュニティ投稿
