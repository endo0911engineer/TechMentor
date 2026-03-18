# ARCHITECTURE.md

日本ITエンジニア給与データベース

---

# 1. システム概要

本システムは、日本のIT企業におけるソフトウェアエンジニアの給与・面接情報を集約するWebサービスである。

構成は以下の3層構造とする。

・フロントエンド
・バックエンドAPI
・データベース

ユーザーはNext.jsで構築されたフロントエンドを通じてFastAPIのAPIを利用する。

---

# 2. システム構成

Frontend

Next.js
SSR対応

Backend

FastAPI
REST API

Database

PostgreSQL

Infrastructure

AWS

・ECS（アプリケーション実行）
・RDS（PostgreSQL）
・S3（静的ファイル）
・CloudFront（CDN）

---

# 3. システム構成図

User
↓
Next.js（Frontend）
↓
FastAPI（Backend API）
↓
PostgreSQL（RDS）

---

# 4. フロントエンド構成

フレームワーク

Next.js (App Router)

主な機能

・企業一覧ページ
・企業詳細ページ
・投稿フォーム
・ランキングページ
・SEO記事ページ

ディレクトリ構成

app/

home
companies
companies/[id]
submit
articles
ranking

components/

CompanyCard
SalaryChart
SubmissionForm

lib/

apiClient

---

# 5. バックエンド構成

FastAPI を使用し REST API を提供する。

主な機能

・企業情報取得
・給与投稿
・面接投稿
・投稿集計
・記事管理

ディレクトリ構成

app/

main.py
routers/
models/
schemas/
services/
repositories/

---

# 6. API設計

主要エンドポイント

企業一覧

GET /companies

企業詳細

GET /companies/{company_id}

給与投稿

POST /salary-submissions

面接投稿

POST /interview-submissions

企業の投稿取得

GET /companies/{company_id}/submissions

記事一覧

GET /articles

記事詳細

GET /articles/{id}

---

# 7. データベース設計

主要テーブル

Company
SalarySubmission
InterviewSubmission
Article

---

Company

id
name
description
industry
employee_count
founded_year
headquarters

---

SalarySubmission

id
company_id
job_title
years_of_experience
salary
location
remote
created_at

---

InterviewSubmission

id
company_id
interview_rounds
coding_test
experience_comment
created_at

---

Article

id
title
slug
content
created_at

---

# 8. 集計ロジック

企業ページでは以下の統計を表示する。

・平均年収
・中央値
・年収レンジ
・投稿件数

これらはSalarySubmissionから計算する。

---

# 9. セキュリティ

匿名投稿のため以下を実施する。

・入力値バリデーション
・XSS対策
・SQLインジェクション対策

投稿は管理者確認後に公開する。