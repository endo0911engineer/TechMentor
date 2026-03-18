"""update submission fields

Revision ID: 002
Revises: 001
Create Date: 2026-03-18

"""
from alembic import op
import sqlalchemy as sa

revision = "002"
down_revision = "001"
branch_labels = None
depends_on = None


def upgrade() -> None:
    # salary_submissions: add new columns
    op.add_column("salary_submissions", sa.Column("salary_breakdown", sa.Text(), nullable=True))
    op.add_column("salary_submissions", sa.Column("remote_type", sa.String(100), nullable=True))
    op.add_column("salary_submissions", sa.Column("overtime_feeling", sa.String(100), nullable=True))

    # interview_submissions: add new columns
    op.add_column("interview_submissions", sa.Column("result", sa.String(50), nullable=True))
    op.add_column("interview_submissions", sa.Column("difficulty", sa.String(50), nullable=True))
    op.add_column("interview_submissions", sa.Column("tags", sa.Text(), nullable=True))
    op.add_column("interview_submissions", sa.Column("interview_content", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("salary_submissions", "salary_breakdown")
    op.drop_column("salary_submissions", "remote_type")
    op.drop_column("salary_submissions", "overtime_feeling")
    op.drop_column("interview_submissions", "result")
    op.drop_column("interview_submissions", "difficulty")
    op.drop_column("interview_submissions", "tags")
    op.drop_column("interview_submissions", "interview_content")
