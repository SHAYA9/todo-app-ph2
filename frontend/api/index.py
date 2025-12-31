import sys
from pathlib import Path

# Add backend to Python path (now it's two levels up from frontend/api/)
backend_dir = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(backend_dir))

# Import after path is set
from mangum import Mangum
from backend.app.main import app

# Create handler for Vercel
# lifespan="off" prevents lifespan events from running on every request
handler = Mangum(app, lifespan="off", api_gateway_base_path="/api")