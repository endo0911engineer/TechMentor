"""add industries table

Revision ID: 004
Revises: 003
Create Date: 2026-03-19

"""
from alembic import op
import sqlalchemy as sa

revision = "004"
down_revision = "003"
branch_labels = None
depends_on = None

INITIAL_INDUSTRIES = [
    "EC / フリマ",
    "EC / フィンテック",
    "SNS / メッセージング",
    "インターネット",
    "ゲーム / エンタメ",
    "HR / 情報サービス",
    "通信",
    "SI / ITサービス",
    "SI / ハードウェア",
    "SaaS / クラウド",
    "FinTech",
    "ヘルスケア / メドテック",
    "教育 / EdTech",
    "AI / データ",
    "セキュリティ",
    "その他",
]


def upgrade() -> None:
    industries_table = op.create_table(
        "industries",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("name"),
    )
    op.create_index("ix_industries_id", "industries", ["id"])
    op.bulk_insert(industries_table, [{"name": n} for n in INITIAL_INDUSTRIES])


def downgrade() -> None:
    op.drop_index("ix_industries_id", table_name="industries")
    op.drop_table("industries")
