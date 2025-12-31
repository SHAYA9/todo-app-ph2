# Quickstart: Advanced Features (Recurring Tasks & Notifications)

## Prerequisites

- Node.js and npm
- Python 3.11+ and pip
- A Neon PostgreSQL database
- Existing `todo-app-mvp` and `task-enhancements` setup (from Phase II Basic and Intermediate Levels)

## Setup

1.  **Switch to the feature branch:**
    ```bash
    git checkout 003-recurring-reminders
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
    The `Task` model has been significantly extended. For this prototype, the simplest way to update the database schema is to drop and recreate the table.
    **WARNING: This will delete all existing task data.**
    ```sql
    DROP TABLE IF EXISTS task;
    ```
    After dropping, when the backend server starts, `SQLModel.metadata.create_all()` will recreate the table with the new schema (including `recurrence_type`, `recurrence_id`, `is_archived`, `due_datetime`). For a production environment, a proper migration tool like Alembic would be used.

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

## Verification

-   Verify that you can create tasks with recurrence types and specific due dates/times.
-   Verify that completing a recurring task archives the original and creates a new instance.
-   Test browser notifications by setting a task due in the near future.
-   Ensure all existing CRUD, search, filter, and sort functionalities from previous phases still work correctly.
