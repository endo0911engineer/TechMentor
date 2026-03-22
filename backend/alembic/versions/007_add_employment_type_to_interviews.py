"""add employment_type to interview_submissions

Revision ID: 007
Revises: 006
Create Date: 2026-03-22

"""
from alembic import op
import sqlalchemy as sa

revision = "007"
down_revision = "006"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("interview_submissions", sa.Column("employment_type", sa.String(50), nullable=True))


def downgrade() -> None:
    op.drop_column("interview_submissions", "employment_type")
