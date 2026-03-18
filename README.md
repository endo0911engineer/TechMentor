# DevPay - 日本ITエンジニア給与データベース

## ローカル開発手順

### 必要なもの
- Docker / Docker Compose

### 起動方法

1. リポジトリをクローン

2. Dockerコンテナを起動

```bash
docker compose up --build
```

3. 初期データを投入

```bash
docker compose exec backend python seed.py
```

4. ブラウザでアクセス

- フロントエンド: http://localhost:3000
- API: http://localhost:8000
- API ドキュメント: http://localhost:8000/docs

### 管理画面

http://localhost:3000/admin

管理者キー: `devpay-admin-secret`

### ページ構成

| ページ | URL |
|--------|-----|
| トップ | / |
| 企業一覧 | /companies |
| 企業詳細 | /companies/[id] |
| 投稿フォーム | /submit |
| 年収ランキング | /ranking |
| 管理画面 | /admin |

### API エンドポイント

| メソッド | パス | 説明 |
|---------|------|------|
| GET | /companies | 企業一覧 |
| GET | /companies/{id} | 企業詳細 |
| GET | /companies/{id}/stats | 年収統計 |
| GET | /companies/{id}/salary-submissions | 給与投稿一覧 |
| GET | /companies/{id}/interview-submissions | 面接投稿一覧 |
| POST | /salary-submissions | 給与投稿 |
| POST | /interview-submissions | 面接投稿 |
| GET | /articles | 記事一覧 |
| GET | /articles/{slug} | 記事詳細 |
| GET | /admin/salary-submissions | 未承認の給与投稿（管理者） |
| POST | /admin/salary-submissions/{id}/approve | 給与投稿承認（管理者） |
| DELETE | /admin/salary-submissions/{id} | 給与投稿削除（管理者） |
| GET | /admin/interview-submissions | 未承認の面接投稿（管理者） |
| POST | /admin/interview-submissions/{id}/approve | 面接投稿承認（管理者） |
| DELETE | /admin/interview-submissions/{id} | 面接投稿削除（管理者） |
| POST | /admin/companies | 企業追加（管理者） |
| POST | /admin/articles | 記事追加（管理者） |
