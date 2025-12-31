import sys
from pathlib import Path

# Add parent directory to path to import backend module
backend_path = Path(__file__).parent.parent
sys.path.insert(0, str(backend_path))

from backend.app.main import app

# Export the app for Vercel
# Vercel's Python runtime expects 'app' or 'application'
application = app