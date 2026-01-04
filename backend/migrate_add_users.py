"""
Migration script to add User table and user_id to Task table.
Run this script once to update your existing database schema.
"""
import os
from dotenv import load_dotenv
from sqlalchemy import create_engine, text

# Load environment variables
load_dotenv()

DATABASE_URL = os.environ.get("DATABASE_URL")

if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable is not set")

# Railway uses postgres:// but SQLAlchemy 1.4+ requires postgresql://
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

engine = create_engine(DATABASE_URL)

def migrate():
    with engine.connect() as conn:
        print("Starting migration...")
        
        # Create User table
        print("Creating User table...")
        conn.execute(text("""
            CREATE TABLE IF NOT EXISTS "user" (
                id SERIAL PRIMARY KEY,
                email VARCHAR NOT NULL UNIQUE,
                name VARCHAR NOT NULL,
                hashed_password VARCHAR NOT NULL,
                created_at TIMESTAMP NOT NULL DEFAULT (now() AT TIME ZONE 'utc')
            );
        """))
        conn.commit()
        print("✓ User table created")
        
        # Check if user_id column already exists
        result = conn.execute(text("""
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name='task' AND column_name='user_id';
        """))
        
        if result.fetchone() is None:
            print("Adding user_id column to Task table...")
            
            # Create a default user for existing tasks
            print("Creating default user for existing tasks...")
            conn.execute(text("""
                INSERT INTO "user" (email, name, hashed_password)
                VALUES ('default@example.com', 'Default User', '$2b$12$defaulthashedpasswordplaceholder')
                ON CONFLICT (email) DO NOTHING;
            """))
            conn.commit()
            
            # Get the default user ID
            result = conn.execute(text("""
                SELECT id FROM "user" WHERE email = 'default@example.com';
            """))
            default_user_id = result.fetchone()[0]
            print(f"✓ Default user created with ID: {default_user_id}")
            
            # Add user_id column (nullable first)
            conn.execute(text("""
                ALTER TABLE task ADD COLUMN user_id INTEGER;
            """))
            conn.commit()
            print("✓ user_id column added")
            
            # Set default user_id for existing tasks
            conn.execute(text(f"""
                UPDATE task SET user_id = {default_user_id} WHERE user_id IS NULL;
            """))
            conn.commit()
            print("✓ Existing tasks assigned to default user")
            
            # Make user_id NOT NULL and add foreign key
            conn.execute(text("""
                ALTER TABLE task ALTER COLUMN user_id SET NOT NULL;
            """))
            conn.execute(text("""
                ALTER TABLE task ADD CONSTRAINT task_user_id_fkey 
                FOREIGN KEY (user_id) REFERENCES "user"(id);
            """))
            conn.execute(text("""
                CREATE INDEX IF NOT EXISTS ix_task_user_id ON task(user_id);
            """))
            conn.commit()
            print("✓ user_id constraints and index added")
        else:
            print("✓ user_id column already exists")
        
        print("\n✅ Migration completed successfully!")
        print("\nIMPORTANT: A default user was created with:")
        print("  Email: default@example.com")
        print("  Password: (You need to reset this via signup)")
        print("\nAll existing tasks have been assigned to this default user.")
        print("Please create a new account via the signup page.")

if __name__ == "__main__":
    try:
        migrate()
    except Exception as e:
        print(f"\n❌ Migration failed: {e}")
        raise