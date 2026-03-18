"""
Seed initial data.
Run: docker compose exec backend python seed.py
"""
import os
import json
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.database import Base
from app.models.company import Company
from app.models.submission import SalarySubmission, InterviewSubmission
from app.models.article import Article

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://devpay:devpay@db:5432/devpay")
engine = create_engine(DATABASE_URL)
Base.metadata.create_all(bind=engine)
SessionLocal = sessionmaker(bind=engine)
db = SessionLocal()

companies_data = [
    {"name": "メルカリ", "industry": "EC / フリマ", "is_approved": True},
    {"name": "楽天グループ", "industry": "EC / フィンテック", "is_approved": True},
    {"name": "LINE", "industry": "SNS / メッセージング", "is_approved": True},
    {"name": "サイバーエージェント", "industry": "インターネット", "is_approved": True},
    {"name": "DeNA", "industry": "ゲーム / エンタメ", "is_approved": True},
    {"name": "リクルート", "industry": "HR / 情報サービス", "is_approved": True},
]

for d in companies_data:
    if not db.query(Company).filter(Company.name == d["name"]).first():
        db.add(Company(**d))
db.commit()

# 既存の submissions を削除して再シード
db.query(InterviewSubmission).delete()
db.query(SalarySubmission).delete()
db.commit()

companies = {c.name: c for c in db.query(Company).all()}

def ic(coding=False, coding_comment="", system_design=False, system_design_comment="",
        behavioral=False, behavioral_comment="", english=False, english_comment="",
        case=False, case_comment="", other=False, other_comment=""):
    return json.dumps({
        "coding":        {"checked": coding,        "comment": coding_comment},
        "system_design": {"checked": system_design,  "comment": system_design_comment},
        "behavioral":    {"checked": behavioral,     "comment": behavioral_comment},
        "case":          {"checked": case,           "comment": case_comment},
        "english":       {"checked": english,        "comment": english_comment},
        "other":         {"checked": other,          "comment": other_comment},
    })

seed_salaries = [
    # メルカリ
    {"company_id": companies["メルカリ"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 5, "salary": 800, "salary_breakdown": "基本給700万、賞与100万", "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "ほぼなし（月10時間未満）", "tech_stack": "Go,Kubernetes,GCP", "comment": "裁量労働制で働きやすい。Goを使った大規模開発が経験できる。", "is_approved": True},
    {"company_id": companies["メルカリ"].id, "job_title": "フロントエンドエンジニア", "years_of_experience": 3, "salary": 650, "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "TypeScript,React,Next.js", "comment": "グローバルな環境で英語も使う。TypeScriptの経験が必須。", "is_approved": True},
    {"company_id": companies["メルカリ"].id, "job_title": "インフラ / SREエンジニア", "years_of_experience": 7, "salary": 950, "salary_breakdown": "基本給800万、賞与150万", "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "普通（月20〜40時間）", "tech_stack": "Kubernetes,GCP,Terraform", "comment": "技術的挑戦が多い。オンコールあり。", "is_approved": True},
    {"company_id": companies["メルカリ"].id, "job_title": "機械学習 / AIエンジニア", "years_of_experience": 4, "salary": 850, "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "Python,GCP,Kubernetes", "comment": "不正検知や推薦システムの開発。研究色が強い。", "is_approved": True},
    {"company_id": companies["メルカリ"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 2, "salary": 580, "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "ほぼなし（月10時間未満）", "tech_stack": "Go,MySQL", "comment": "入社2年目。成長環境は良いが給与は低め。", "is_approved": True},
    # 楽天
    {"company_id": companies["楽天グループ"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 4, "salary": 700, "location": "東京", "remote_type": "出社のみ", "overtime_feeling": "多い（月40〜60時間）", "tech_stack": "Java,Kotlin,AWS", "comment": "大規模システムの経験が積める。英語が必須。", "is_approved": True},
    {"company_id": companies["楽天グループ"].id, "job_title": "データエンジニア", "years_of_experience": 6, "salary": 750, "salary_breakdown": "基本給650万、賞与100万", "location": "東京", "remote_type": "出社のみ", "overtime_feeling": "普通（月20〜40時間）", "tech_stack": "Java,AWS,Python", "comment": "データ基盤の整備に取り組んでいる。", "is_approved": True},
    {"company_id": companies["楽天グループ"].id, "job_title": "フロントエンドエンジニア", "years_of_experience": 5, "salary": 680, "location": "東京", "remote_type": "出社のみ", "overtime_feeling": "普通（月20〜40時間）", "tech_stack": "React,TypeScript,Java", "comment": "古いコードベースも多いが改善中。", "is_approved": True},
    {"company_id": companies["楽天グループ"].id, "job_title": "インフラ / SREエンジニア", "years_of_experience": 8, "salary": 900, "salary_breakdown": "基本給750万、賞与150万", "location": "東京", "remote_type": "一部リモート（週1〜2日）", "overtime_feeling": "多い（月40〜60時間）", "tech_stack": "AWS,Kubernetes,Terraform", "comment": "自社クラウド運用。スケールが大きい。", "is_approved": True},
    # LINE
    {"company_id": companies["LINE"].id, "job_title": "モバイルエンジニア（Android）", "years_of_experience": 4, "salary": 720, "location": "東京", "remote_type": "一部リモート（週3日以上）", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "Kotlin,Java,AWS", "comment": "モバイル技術が最先端。Kotlinのコードが綺麗。", "is_approved": True},
    {"company_id": companies["LINE"].id, "job_title": "モバイルエンジニア（iOS）", "years_of_experience": 5, "salary": 780, "location": "東京", "remote_type": "一部リモート（週3日以上）", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "Swift,Kotlin", "comment": "億単位のユーザーへのリリース経験ができる。", "is_approved": True},
    {"company_id": companies["LINE"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 6, "salary": 820, "salary_breakdown": "基本給700万、賞与120万", "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "普通（月20〜40時間）", "tech_stack": "Java,Kotlin,Kubernetes", "comment": "Java/Kotlinを使用。マイクロサービス構成。", "is_approved": True},
    # サイバーエージェント
    {"company_id": companies["サイバーエージェント"].id, "job_title": "その他", "years_of_experience": 3, "salary": 600, "location": "東京", "remote_type": "出社のみ", "overtime_feeling": "普通（月20〜40時間）", "tech_stack": "C#,Unity,AWS", "comment": "若手が多い活気ある職場。ゲーム好きには最高。", "is_approved": True},
    {"company_id": companies["サイバーエージェント"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 5, "salary": 720, "location": "東京", "remote_type": "一部リモート（週1〜2日）", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "Go,Scala,GCP", "comment": "AbemaTVの開発。GoとScalaを使う。", "is_approved": True},
    {"company_id": companies["サイバーエージェント"].id, "job_title": "モバイルエンジニア（Android）", "years_of_experience": 4, "salary": 680, "location": "東京", "remote_type": "一部リモート（週3日以上）", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "Kotlin,Java", "comment": "Ameba事業部。Kotlinのコードレビューが厳しい。", "is_approved": True},
    # DeNA
    {"company_id": companies["DeNA"].id, "job_title": "インフラ / SREエンジニア", "years_of_experience": 5, "salary": 680, "location": "東京", "remote_type": "出社のみ", "overtime_feeling": "多い（月40〜60時間）", "tech_stack": "AWS,Python,C++", "comment": "ゲーム系のインフラは特殊。急激なスパイク対応が多い。", "is_approved": True},
    {"company_id": companies["DeNA"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 3, "salary": 620, "location": "東京", "remote_type": "出社のみ", "overtime_feeling": "普通（月20〜40時間）", "tech_stack": "C++,Python,AWS", "comment": "ゲームサーバー開発。C++とPythonを使う。", "is_approved": True},
    # リクルート
    {"company_id": companies["リクルート"].id, "job_title": "バックエンドエンジニア", "years_of_experience": 6, "salary": 850, "salary_breakdown": "基本給720万、賞与130万", "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "ほぼなし（月10時間未満）", "tech_stack": "Go,GCP,PostgreSQL", "comment": "事業横断でエンジニアとして活躍できる。Go推進中。", "is_approved": True},
    {"company_id": companies["リクルート"].id, "job_title": "データエンジニア", "years_of_experience": 4, "salary": 900, "salary_breakdown": "基本給750万、賞与150万", "location": "東京", "remote_type": "フルリモート", "overtime_feeling": "少ない（月10〜20時間）", "tech_stack": "Python,GCP,PostgreSQL", "comment": "大量の求職者データを扱う。GCPで分析基盤を構築。", "is_approved": True},
]

for s in seed_salaries:
    db.add(SalarySubmission(**s))

seed_interviews = [
    # メルカリ
    {
        "company_id": companies["メルカリ"].id, "job_title": "バックエンドエンジニア",
        "interview_rounds": 4, "result": "合格", "difficulty": "難しい",
        "tags": "技術力重視,スピード選考",
        "interview_content": ic(
            coding=True, coding_comment="LeetCode中級レベル。配列・グラフ問題が中心。時間は60分で2問。事前にLeetCodeのMediumを50問以上解いておくと安心。特にグラフのBFS/DFSとスライディングウィンドウが頻出だった。コードの可読性やエッジケースの処理も評価される。",
            system_design=True, system_design_comment="フリマアプリのマッチングシステム設計。スケーラビリティを重視して説明した。データ量・QPS・レイテンシの見積もりから始め、DBスキーマ設計、キャッシュ戦略（Redis）、非同期処理（Kafka）まで幅広く問われた。事前にSystem Design Primerを読んでおくことを強くすすめる。",
            english=True, english_comment="英語での自己紹介と簡単なQ&A。ネイティブレベルは不要だが基本的な会話力は必要。",
        ),
        "is_approved": True,
    },
    {
        "company_id": companies["メルカリ"].id, "job_title": "フロントエンドエンジニア",
        "interview_rounds": 3, "result": "合格", "difficulty": "普通",
        "tags": "カルチャーフィット重視",
        "interview_content": ic(
            coding=True, coding_comment="ReactとTypeScriptの実装課題。コンポーネント設計とパフォーマンス最適化を問われた。",
            behavioral=True, behavioral_comment="過去のプロジェクトでの失敗経験と学びを詳しく聞かれた。カルチャーフィット重視の印象。",
        ),
        "is_approved": True,
    },
    {
        "company_id": companies["メルカリ"].id, "job_title": "インフラ / SREエンジニア",
        "interview_rounds": 4, "result": "合格", "difficulty": "とても難しい",
        "tags": "技術力重視",
        "interview_content": ic(
            system_design=True, system_design_comment="大規模分散システムの障害対応設計。SLO/SLAの考え方を深く問われた。",
            other=True, other_comment="インフラ設計の問答形式とトラブルシューティング演習あり。過去のインシデント対応経験を詳しく聞かれた。",
        ),
        "is_approved": True,
    },
    # 楽天
    {
        "company_id": companies["楽天グループ"].id, "job_title": "バックエンドエンジニア",
        "interview_rounds": 5, "result": "合格", "difficulty": "難しい",
        "tags": "長期選考,技術力重視",
        "interview_content": ic(
            coding=True, coding_comment="Javaでのアルゴリズム問題。データ構造の理解を深く問われた。",
            behavioral=True, behavioral_comment="チームでの協働経験・リーダーシップ経験を複数回聞かれた。",
            english=True, english_comment="英語での技術面接1回。ネイティブスピーカーの面接官だった。事前準備が重要。",
        ),
        "is_approved": True,
    },
    {
        "company_id": companies["楽天グループ"].id, "job_title": "データエンジニア",
        "interview_rounds": 4, "result": "合格", "difficulty": "難しい",
        "tags": "技術力重視",
        "interview_content": ic(
            coding=True, coding_comment="SQLとPythonの実技試験あり。ウィンドウ関数・CTEの知識が必要。",
            system_design=True, system_design_comment="ビッグデータ処理パイプラインの設計。バッチ処理とストリーミングの使い分けを問われた。",
        ),
        "is_approved": True,
    },
    # LINE
    {
        "company_id": companies["LINE"].id, "job_title": "モバイルエンジニア（iOS）",
        "interview_rounds": 3, "result": "合格", "difficulty": "普通",
        "tags": "技術力重視",
        "interview_content": ic(
            coding=True, coding_comment="SwiftでのUI実装課題。実際のLINEアプリのコードを改善する演習があった。Combine frameworkの知識も問われた。",
            other=True, other_comment="コードレビュー形式の面接あり。既存コードの問題点を指摘する形式。",
        ),
        "is_approved": True,
    },
    # サイバーエージェント
    {
        "company_id": companies["サイバーエージェント"].id, "job_title": "バックエンドエンジニア",
        "interview_rounds": 3, "result": "合格", "difficulty": "普通",
        "tags": "カルチャーフィット重視,スピード選考",
        "interview_content": ic(
            coding=True, coding_comment="コーディングテストはAtCoder形式。競技プログラミングの素養があると有利。",
            behavioral=True, behavioral_comment="面接はカジュアルな雰囲気。若手エンジニアが面接官の一人だった。技術よりも人柄重視の印象。",
        ),
        "is_approved": True,
    },
    # DeNA
    {
        "company_id": companies["DeNA"].id, "job_title": "インフラ / SREエンジニア",
        "interview_rounds": 3, "result": "合格", "difficulty": "普通",
        "tags": "技術力重視",
        "interview_content": ic(
            system_design=True, system_design_comment="ゲームサーバーの負荷試験設計。スパイクトラフィックへの対応方法を問われた。",
            behavioral=True, behavioral_comment="フランクな雰囲気。過去のインフラ構築経験を中心に聞かれた。",
        ),
        "is_approved": True,
    },
    # リクルート
    {
        "company_id": companies["リクルート"].id, "job_title": "バックエンドエンジニア",
        "interview_rounds": 4, "result": "合格", "difficulty": "難しい",
        "tags": "技術力重視,カルチャーフィット重視",
        "interview_content": ic(
            coding=True, coding_comment="GoとPythonどちらでも選択可能。アルゴリズム2問＋設計1問の構成。",
            system_design=True, system_design_comment="求人マッチングシステムの設計。データ量が多いので検索性能をどう担保するかを問われた。",
            behavioral=True, behavioral_comment="マネージャー面接と最終面接では事業理解も重要視される。なぜリクルートか？を深掘りされた。",
        ),
        "is_approved": True,
    },
]

for s in seed_interviews:
    db.add(InterviewSubmission(**s))

seed_articles = [
    {"title": "メルカリのエンジニア年収を徹底解説【2024年版】", "slug": "mercari-engineer-salary", "content": "メルカリは日本を代表するテクノロジー企業の一つです。エンジニアの年収はどのくらいでしょうか..."},
    {"title": "日本IT企業エンジニア年収ランキング2024", "slug": "it-engineer-salary-ranking-2024", "content": "日本のIT企業におけるエンジニアの年収をランキング形式でご紹介します..."},
    {"title": "楽天エンジニアの給与・待遇を解説", "slug": "rakuten-engineer-salary", "content": "楽天グループのエンジニア採用情報や給与水準について解説します..."},
]
for a in seed_articles:
    if not db.query(Article).filter(Article.slug == a["slug"]).first():
        db.add(Article(**a))

db.commit()
db.close()
print("Seed data created successfully!")
