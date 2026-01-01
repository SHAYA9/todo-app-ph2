import sys
import os
from pathlib import Path

# Add backend to Python path (now it's two levels up from frontend/api/)
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

# Ensure database tables are created on first serverless invocation
# This is safe because SQLModel checks if tables exist before creating
try:
    from backend.app.database import engine
    from backend.app import models
    # Create tables if they don't exist
    models.SQLModel.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not initialize database tables: {e}")

# Import after path is set
from mangum import Mangum
from backend.app.main import app

# Create handler for Vercel
# lifespan="off" prevents lifespan events from running on every request
handler = Mangum(app, lifespan="off", api_gateway_base_path="/api")