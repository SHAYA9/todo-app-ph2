# Deploy to Hugging Face Spaces 🤗

Complete guide to deploy your Todo App on Hugging Face Spaces for FREE!

## 🚀 Quick Deploy (3 Steps)

### Step 1: Get a Database (2 minutes)

1. Go to [neon.tech](https://neon.tech)
2. Sign up (free)
3. Create a new project
4. Copy the connection string

**Example connection string:**
```
postgresql://user:password@host.region.aws.neon.tech/database?sslmode=require
```

### Step 2: Create Hugging Face Space (1 minute)

1. Go to [huggingface.co/new-space](https://huggingface.co/new-space)
2. **Space name:** `todo-app` (or your choice)
3. **License:** MIT
4. **SDK:** Docker
5. **Hardware:** CPU basic (FREE)
6. Click **Create Space**

### Step 3: Deploy Your Code (3 minutes)

**Option A: Using Git (Recommended)**

```bash
# Add Hugging Face as remote
git remote add hf https://huggingface.co/spaces/YOUR_USERNAME/todo-app

# Push to Hugging Face
git push hf main
```

**Option B: Upload Files**

1. In your Space, click **Files** → **Upload files**
2. Upload all files from your project
3. Commit changes

### Step 4: Add Database Secret (1 minute)

1. In your Space, click **Settings** tab
2. Scroll to **Repository secrets**
3. Click **New secret**
   - **Name:** `DATABASE_URL`
   - **Value:** Your PostgreSQL connection string
4. Click **Save**

### Step 5: Wait for Build (3-5 minutes)

Hugging Face will:
- ✅ Build Docker image
- ✅ Install dependencies
- ✅ Start your app
- ✅ Make it public

**Your app will be live at:**
```
https://huggingface.co/spaces/YOUR_USERNAME/todo-app
```

---

## 📁 Project Structure for Hugging Face

```
todo-app-ph2/
├── Dockerfile               # Docker configuration
├── start.sh                 # Startup script
├── README_HUGGINGFACE.md    # Space README
├── requirements.txt         # Python dependencies
├── .dockerignore           # Files to exclude
├── backend/                 # FastAPI backend
└── frontend/               # Next.js frontend
```

---

## 🔧 Configuration Files Explained

### 1. Dockerfile
Builds both Next.js and FastAPI into one container:
- Stage 1: Build Next.js frontend
- Stage 2: Setup Python + FastAPI
- Copies built frontend
- Runs both services

### 2. start.sh
Startup script that:
- Starts FastAPI backend on port 8000
- Starts Next.js frontend on port 7860
- Both services run simultaneously

### 3. README_HUGGINGFACE.md
The README that shows on your Space page (public facing)

---

## 🌐 How It Works

```
User Request → https://your-space.hf.space
       ↓
┌────────────────────────────┐
│   Docker Container         │
│                            │
│  Next.js → localhost:7860 │ ← User sees this
│      ↓                     │
│  Proxy to localhost:8000   │
│      ↓                     │
│  FastAPI Backend          │
└────────────────────────────┘
       ↓
PostgreSQL Database (Neon)
```

---

## ⚙️ Environment Variables

Set in Space Settings → Repository secrets:

| Secret | Description | Required |
|--------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ Yes |

**Format:**
```
postgresql://user:password@host:port/database?sslmode=require
```

---

## 🐛 Troubleshooting

### Build Failed

**Check Build Logs:**
- Space page → **Building** → View logs

**Common Issues:**
1. Dockerfile syntax error → Check Dockerfile
2. Missing dependencies → Check requirements.txt
3. Node.js issues → Check package.json

### App Shows Error Page

**Check Runtime Logs:**
- Space page → **Logs** tab

**Common Issues:**
1. Database connection → Verify `DATABASE_URL` secret
2. Port binding → Should use 7860 (Hugging Face default)
3. Missing files → Check .dockerignore

### Database Connection Error

**Fix:**
1. Verify `DATABASE_URL` in secrets
2. Must include `?sslmode=require`
3. Check database is accessible (Neon status)

---

## 🆓 Free Tier Limits

**Hugging Face Community (Free):**
- ✅ Unlimited public spaces
- ✅ 2 CPU cores
- ✅ 16GB RAM  
- ✅ 50GB storage
- ✅ No time limits
- ⚠️ Space must be public

**Upgrade Options:**
- 💰 $9/month: Private spaces
- 💰 More for GPU/better CPU

---

## 🔄 Updating Your App

After making code changes:

```bash
git add .
git commit -m "Updated feature"
git push hf main
```

Hugging Face automatically rebuilds and redeploys! ✨

---

## ✨ Features

Your deployed app includes:
- ✅ Full-stack Next.js + FastAPI
- ✅ PostgreSQL database
- ✅ Task management
- ✅ Browser notifications
- ✅ Search & filtering
- ✅ Priority levels
- ✅ Auto HTTPS
- ✅ Public URL

---

## 🎯 Success Checklist

- [ ] Database created on Neon
- [ ] Hugging Face Space created
- [ ] Code pushed to Space
- [ ] `DATABASE_URL` secret added
- [ ] Build completed successfully
- [ ] App accessible at your Space URL
- [ ] Can create/edit/delete tasks
- [ ] Database persists data

---

## 📚 Resources

- [Hugging Face Spaces Docs](https://huggingface.co/docs/hub/spaces)
- [Docker SDK Guide](https://huggingface.co/docs/hub/spaces-sdks-docker)
- [Neon Database Docs](https://neon.tech/docs)

---

**Your Todo App is ready for Hugging Face! 🚀**

Deploy it and share your Space with the world! 🌍