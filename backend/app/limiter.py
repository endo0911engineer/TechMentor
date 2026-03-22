from slowapi import Limiter
from slowapi.util import get_remote_address

# default_limits はすべてのエンドポイントに適用（SlowAPIMiddleware 経由）
# 管理画面への総当たり攻撃を防ぐ基本ガード
limiter = Limiter(key_func=get_remote_address, default_limits=["60/minute"])
