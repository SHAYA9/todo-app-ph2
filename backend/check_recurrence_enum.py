from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.database import engine

# Check what values are in the recurrence enum
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT unnest(enum_range(NULL::recurrence))::text AS enum_value
    """))
    
    print("Current recurrence enum values:")
    for row in result:
        print(f"  - {row[0]}")