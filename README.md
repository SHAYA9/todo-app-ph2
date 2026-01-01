# Todo App - Full Stack Application

A full-stack todo application with Next.js frontend and FastAPI backend, deployed on Vercel.

## Tech Stack

**Frontend:**
- Next.js 14 (React)
- TypeScript
- Tailwind CSS v4

**Backend:**
- FastAPI (Python)
- SQLModel
- PostgreSQL (Neon)

## 🚀 Quick Deploy to Vercel (Recommended)

**See detailed guide:** [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)

**Quick steps:**
1. Get free database from [neon.tech](https://neon.tech)
2. Push code to GitHub
3. Deploy on [vercel.com](https://vercel.com) (set root directory to `frontend`)
4. Add `DATABASE_URL` environment variable
5. Done! ✅

---

## 🖥️ Local Development

### Prerequisites
- Node.js 18+ and npm
- Python 3.10+
- PostgreSQL database (or use Neon)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```
DATABASE_URL=your_postgresql_connection_string
```

5. Run the backend:
```bash
uvicorn app.main:app --reload --port 8000
```

The backend API will be available at `http://localhost:8000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Deployment to Vercel

### One-Click Deploy

1. Push your code to GitHub
2. Go to [Vercel](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repository
5. Add environment variable:
   - `DATABASE_URL`: Your PostgreSQL connection string

Vercel will automatically:
- Deploy the Next.js frontend
- Deploy the FastAPI backend as serverless functions
- Set up the routing between them

### Manual Deploy

Install Vercel CLI:
```bash
npm i -g vercel
```

Deploy:
```bash
vercel
```

Add environment variables in Vercel dashboard or via CLI:
```bash
vercel env add DATABASE_URL
```

## Environment Variables

### Backend (.env)
- `DATABASE_URL`: PostgreSQL connection string

### Frontend (.env.local)
- `NEXT_PUBLIC_API_URL`: API endpoint (defaults to `/api`)

## Features

- ✅ Create, read, update, delete tasks
- ✅ Task search and filtering
- ✅ Priority levels (Low, Medium, High)
- ✅ Due dates with notifications
- ✅ Task completion tracking
- ✅ Sorting options
- ✅ Browser notifications for upcoming tasks

## API Endpoints

- `GET /tasks` - Get all tasks (with filters)
- `POST /tasks/` - Create a new task
- `GET /tasks/upcoming` - Get upcoming tasks
- `PUT /tasks/{id}` - Update a task
- `DELETE /tasks/{id}` - Delete a task

## Project Structure

```
.
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI application
│   │   ├── models.py        # SQLModel models
│   │   ├── schemas.py       # Pydantic schemas
│   │   ├── crud.py          # Database operations
│   │   └── database.py      # Database connection
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── app/             # Next.js app directory
│   │   ├── components/      # React components
│   │   ├── services/        # API client
│   │   ├── types/           # TypeScript types
│   │   └── utils/           # Utility functions
│   └── package.json
├── api/
│   └── index.py             # Vercel serverless function entry point
└── vercel.json              # Vercel configuration
```

## License

MIT