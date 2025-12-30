# Quickstart: Full-Stack Todo App MVP

## Prerequisites

- Node.js and npm
- Python 3.11+ and pip
- A Neon PostgreSQL database

## Setup

1.  **Clone the repository.**
2.  **Set up the backend:**
    - Create a virtual environment: `python -m venv venv`
    - Activate the virtual environment: `source venv/bin/activate` (on Linux/macOS) or `venv\Scripts\activate` (on Windows)
    - Install dependencies: `pip install -r requirements.txt`
    - Create a `.env` file in the `backend` directory with the following content:
        ```
        DATABASE_URL=<your-neon-database-url>
        ```
3.  **Set up the frontend:**
    - Install dependencies: `npm install`

## Running the application

1.  **Start the backend:**
    - `uvicorn app.main:app --reload`
2.  **Start the frontend:**
    - `npm run dev`

The application will be available at `http://localhost:3000`.
The backend API will be available at `http://localhost:8000`.
