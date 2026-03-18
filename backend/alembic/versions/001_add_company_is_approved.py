"""add is_approved to companies

Revision ID: 001
Revises:
Create Date: 2026-03-16

"""
from alembic import op
import sqlalchemy as sa

revision = "001"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column(
        "companies",
        sa.Column("is_approved", sa.Boolean(), nullable=True),
    )
    op.execute("UPDATE companies SET is_approved = true")
    op.alter_column(
        "companies",
        "is_approved",
        nullable=False,
        server_default=sa.text("false"),
    )


def downgrade() -> None:
    op.drop_column("companies", "is_approved")
