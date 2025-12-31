# Multi-stage build for Next.js + FastAPI on Hugging Face Spaces
FROM node:20-slim AS frontend-builder

# Build Next.js frontend
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --only=production
COPY frontend/ ./
RUN npm run build

# Final stage - Python with Node
FROM python:3.11-slim

# Install Node.js for serving Next.js
RUN apt-get update && apt-get install -y \
    nodejs \
    npm \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy Python requirements and install
COPY requirements.txt .
COPY backend/requirements.txt backend/
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

# Copy backend code
COPY backend/ backend/

# Copy built frontend from builder stage
COPY --from=frontend-builder /app/frontend/.next frontend/.next
COPY --from=frontend-builder /app/frontend/public frontend/public
COPY --from=frontend-builder /app/frontend/package*.json frontend/
COPY frontend/next.config.js frontend/

# Install frontend production dependencies
WORKDIR /app/frontend
RUN npm ci --only=production

# Copy startup script
WORKDIR /app
COPY start.sh .
RUN chmod +x start.sh

# Expose port (Hugging Face uses 7860 by default)
EXPOSE 7860

# Set environment variables
ENV PORT=7860
ENV HOST=0.0.0.0
ENV NODE_ENV=production

# Run the application
CMD ["./start.sh"]