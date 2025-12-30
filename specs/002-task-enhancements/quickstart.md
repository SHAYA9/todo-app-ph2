# Quickstart: Task Enhancements (Intermediate Level)

## Prerequisites

- Node.js and npm
- Python 3.11+ and pip
- A Neon PostgreSQL database
- Existing `todo-app-mvp` setup (from Phase II Basic Level)

## Setup

1.  **Switch to the feature branch:**
    ```bash
    git checkout 002-task-enhancements
    ```

2.  **Ensure backend virtual environment is activated:**
    ```bash
    cd backend
    .\venv\Scripts\activate # On Windows
    # source venv/bin/activate # On Linux/macOS
    ```

3.  **Install/update backend dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Update `.env` in `backend/`:**
    Ensure `DATABASE_URL` is set to your Neon PostgreSQL database URL.

5.  **Run database migrations:**
    Since the `Task` model has been extended, you will need to apply migrations.
    *(Note: SQLModel does not have built-in migration tools like Alembic for SQLAlchemy. For this project, you would typically use a separate migration tool or manually manage schema changes. For simplicity and to fit within SQLModel's direct `create_all` usage, we will update `backend/app/main.py` to call `SQLModel.metadata.create_all()` after the model changes. This will create tables if they don't exist, but **won't automatically migrate existing tables with new columns.** A proper migration tool would be needed for production. For this prototype, if tables already exist, you may need to drop and recreate them if you encounter issues, or manually add columns.)*

    For this iteration, ensure your database reflects the new schema (e.g., by dropping and recreating tables if you are comfortable with data loss for development, or manually adding columns for `priority`, `tags`, `due_date` with appropriate types: `VARCHAR` for priority, `JSONB` for tags, `TIMESTAMP WITHOUT TIME ZONE` for due_date).

6.  **Ensure frontend dependencies are installed:**
    ```bash
    cd ../frontend # Go back to frontend directory
    npm install
    ```

## Running the application

1.  **Start the backend (from the `backend` directory, with virtual environment activated):**
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend API will be available at `http://localhost:8000`.

2.  **Start the frontend (from the `frontend` directory):**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:3000` (or `http://localhost:3001` if port 3000 is in use).

Verify that new tasks can be added with priority, tags, and due date, and that search, filter, and sort functionalities work correctly on the UI.
