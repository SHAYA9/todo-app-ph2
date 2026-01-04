# backend/migrate_push_subscriptions.py
from dotenv import load_dotenv
load_dotenv()

from backend.app.database import engine
from backend.app.models import PushSubscription, SQLModel

def migrate_push_subscriptions():
    print("Creating PushSubscription table...")
    SQLModel.metadata.create_all(engine, tables=[PushSubscription.__table__])
    print("PushSubscription table created.")

if __name__ == "__main__":
    migrate_push_subscriptions()
