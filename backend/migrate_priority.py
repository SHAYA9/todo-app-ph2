from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.database import engine

# Fix the priority column to have a default value and update existing rows
with engine.connect() as conn:
    # First, update all NULL priority values to 'MEDIUM'
    print("Updating NULL priority values to 'MEDIUM'...")
    result = conn.execute(text("UPDATE task SET priority = 'MEDIUM' WHERE priority IS NULL"))
    print(f"Updated {result.rowcount} rows")
    
    # Then, set the column to NOT NULL with a default value
    print("Altering table to set priority NOT NULL with default 'MEDIUM'...")
    conn.execute(text("ALTER TABLE task ALTER COLUMN priority SET DEFAULT 'MEDIUM'"))
    conn.execute(text("ALTER TABLE task ALTER COLUMN priority SET NOT NULL"))
    
    conn.commit()
    print("Migration completed successfully!")