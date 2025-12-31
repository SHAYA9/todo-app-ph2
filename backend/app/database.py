import os
from sqlmodel import create_engine

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Configure engine for serverless environment
# pool_pre_ping ensures connections are valid
# pool_recycle prevents stale connections
engine = create_engine(
    DATABASE_URL,
    echo=False,  # Disable SQL logging in production for better performance
    pool_pre_ping=True,
    pool_recycle=300,  # Recycle connections after 5 minutes
    connect_args={
        "connect_timeout": 10,
        "options": "-c timezone=utc"
    }
)