from dotenv import load_dotenv
load_dotenv()

from sqlalchemy import text
from app.database import engine

# Check the actual table schema
with engine.connect() as conn:
    result = conn.execute(text("""
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns
        WHERE table_name = 'task'
        ORDER BY ordinal_position
    """))
    
    print("Current task table schema:")
    for row in result:
        print(f"  {row[0]:20} {row[1]:20} nullable={row[2]:5} default={row[3]}")