"""add email to contacts

Revision ID: 006
Revises: 005
Create Date: 2026-03-20

"""
from alembic import op
import sqlalchemy as sa

revision = "006"
down_revision = "005"
branch_labels = None
depends_on = None


def upgrade() -> None:
    op.add_column("contacts", sa.Column("email", sa.String(255), nullable=True))


def downgrade() -> None:
    op.drop_column("contacts", "email")
