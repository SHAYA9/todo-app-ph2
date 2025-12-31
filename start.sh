#!/bin/bash

# Startup script for Hugging Face Spaces
# Runs both FastAPI backend and Next.js frontend

# Start FastAPI backend on port 8000 in background
echo "Starting FastAPI backend..."
cd /app
uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 &

# Wait for backend to start
sleep 3

# Start Next.js frontend on port 7860 (Hugging Face default)
echo "Starting Next.js frontend..."
cd /app/frontend
npm start -- -p 7860 -H 0.0.0.0