import os
from sqlmodel import create_engine

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Railway uses postgres:// but SQLAlchemy 1.4+ requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Configure engine for Railway/production environment
# pool_pre_ping ensures connections are valid
# pool_recycle prevents stale connections
try:
    engine = create_engine(
        DATABASE_URL,
        echo=False,  # Disable SQL logging in production for better performance
        pool_pre_ping=True,
        pool_recycle=300,  # Recycle connections after 5 minutes
        connect_args={
            "connect_timeout": 10,
        }
    )
except Exception as e:
    print(f"Error creating database engine: {e}")
    print(f"DATABASE_URL format: {DATABASE_URL[:20]}...")
    raise