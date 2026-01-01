# 🚀 Vercel Deployment Guide - Todo App

## ✅ Project is Now Organized for Vercel!

Your project structure has been optimized for Vercel deployment:

```
todo-app-ph2/
├── frontend/              # Deploy this directory
│   ├── api/              # Serverless functions
│   │   ├── index.py      # Main FastAPI handler
│   │   └── test.py       # Test endpoint
│   ├── src/              # Next.js frontend
│   ├── requirements.txt   # Python dependencies
│   ├── vercel.json       # Vercel configuration
│   ├── package.json      # Node dependencies
│   └── next.config.js    # Next.js config
└── backend/              # Backend code (used by API)
    └── app/              # FastAPI application
```

---

## 📋 Prerequisites

1. **GitHub Account** - Push your code to GitHub
2. **Vercel Account** - Sign up at [vercel.com](https://vercel.com)
3. **Database** - Free PostgreSQL from [neon.tech](https://neon.tech)

---

## 🗄️ Step 1: Setup Database (5 minutes)

### Get Free PostgreSQL from Neon

1. Go to **https://neon.tech**
2. Sign up with GitHub
3. Click **"Create Project"**
4. Copy the connection string (looks like):
   ```
   postgresql://user:password@host.region.aws.neon.tech/database?sslmode=require
   ```
5. **Save this!** You'll need it in Step 3

---

## 📤 Step 2: Push to GitHub (if not done)

```powershell
# Initialize git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Prepare for Vercel deployment"

# Create repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## 🌐 Step 3: Deploy to Vercel (5 minutes)

### Method 1: Web Interface (Recommended)

1. **Go to** https://vercel.com/dashboard

2. **Click** "Add New..." → "Project"

3. **Import Repository:**
   - Select your GitHub repository
   - Click "Import"

4. **Configure Project:**
   ```
   Framework Preset: Next.js
   Root Directory: frontend  ← IMPORTANT! Change from ./
   Build Command: npm run build
   Output Directory: .next
   Install Command: npm install
   ```

5. **Add Environment Variable:**
   - Click "Environment Variables"
   - Add variable:
     ```
     Name: DATABASE_URL
     Value: [Paste your Neon connection string]
     ```
   - Select: ✅ Production ✅ Preview ✅ Development

6. **Click "Deploy"** 🚀

### Method 2: Using Vercel CLI

```powershell
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Navigate to project
cd c:\Users\SHAYAN\Desktop\hackathon2\todo-app-ph2

# Deploy
vercel

# When prompted:
# - Set up and deploy? Y
# - Link to existing project? N
# - Project name? todo-app
# - Directory? frontend  ← IMPORTANT
# - Override settings? N

# Add environment variable
vercel env add DATABASE_URL
# Paste your database URL
# Select: Production, Preview, Development

# Deploy to production
vercel --prod
```

---

## 🎯 Step 4: Verify Deployment

1. **Vercel provides URL:** `https://your-app.vercel.app`

2. **Test Features:**
   - ✅ Page loads
   - ✅ Create a task
   - ✅ Mark task complete
   - ✅ Delete task
   - ✅ Search/filter works

3. **Check API:**
   - Visit: `https://your-app.vercel.app/api/`
   - Should see: `{"Hello":"World"}`

---

## 🔧 Configuration Files Explained

### 1. `frontend/vercel.json`
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "functions": {
    "api/**/*.py": {
      "runtime": "python3.9"
    }
  },
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "/api/:path*"
    }
  ]
}
```
- Configures Python runtime for API functions
- Routes `/api/*` requests to serverless functions

### 2. `frontend/api/index.py`
- FastAPI application wrapped with Mangum
- Handles all API requests as serverless function
- Automatically creates database tables

### 3. `frontend/requirements.txt`
- Python dependencies for serverless functions
- Must be in `frontend/` directory for Vercel

### 4. `frontend/next.config.js`
- Detects Vercel environment
- Routes API calls correctly

---

## 🐛 Troubleshooting

### ❌ Build Fails

**Check Build Logs:**
- Vercel Dashboard → Your Project → Deployments → Click latest
- View build logs

**Common Issues:**

1. **"Root Directory not found"**
   ```
   Solution: Set Root Directory to "frontend" in Project Settings
   ```

2. **"MODULE_NOT_FOUND" error**
   ```
   Solution: Check package.json and requirements.txt are complete
   ```

3. **TypeScript errors**
   ```powershell
   # Test locally first:
   cd frontend
   npm run build
   ```

### ❌ API Not Working

**Symptoms:** 
- Frontend loads but tasks don't save
- 500 or 404 errors on `/api/*`

**Solutions:**

1. **Check DATABASE_URL:**
   - Vercel Dashboard → Project → Settings → Environment Variables
   - Must include `?sslmode=require` at end

2. **Check API endpoint:**
   - Visit: `https://your-app.vercel.app/api/`
   - Should NOT return 404

3. **Check logs:**
   - Vercel Dashboard → Project → Functions → View logs

### ❌ CORS Errors

**Solution:**
The app is already configured for Vercel. If using custom domain, update `backend/app/main.py`:

```python
origins = [
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://your-custom-domain.com"  # Add this
]
```

Then redeploy:
```powershell
git add .
git commit -m "Update CORS"
git push
```

### ❌ Database Connection Error

**Symptoms:**
- Tasks don't load
- Error: "Connection refused" or "Connection timeout"

**Solutions:**

1. **Verify DATABASE_URL format:**
   ```
   postgresql://user:password@host:5432/database?sslmode=require
   ```
   Must have `?sslmode=require`

2. **Check Neon database status:**
   - Go to neon.tech dashboard
   - Ensure database is active

3. **Test connection locally:**
   ```powershell
   cd backend
   python -c "from app.database import engine; print('Connected!')"
   ```

---

## 🔄 Updating Your App

After making changes:

```powershell
git add .
git commit -m "Your update message"
git push origin main
```

**Vercel automatically:**
- ✅ Detects the push
- ✅ Builds new version
- ✅ Deploys updates
- ✅ Updates in ~1-2 minutes

---

## 📊 Monitoring

### View Logs
```
Vercel Dashboard → Your Project → Functions → Runtime Logs
```

### View Analytics
```
Vercel Dashboard → Your Project → Analytics
```

### View Errors
```
Vercel Dashboard → Your Project → Functions → Errors
```

---

## 🎨 Custom Domain (Optional)

1. **Buy domain** (from Namecheap, Google Domains, etc.)

2. **In Vercel:**
   - Project → Settings → Domains
   - Add your domain
   - Follow DNS setup instructions

3. **Update CORS** (if needed):
   - Edit `backend/app/main.py`
   - Add your domain to origins list

---

## 💰 Free Tier Limits

**Vercel Hobby (Free):**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Serverless function execution (100GB-hours)
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments

**More than enough for personal use!**

---

## ✅ Success Checklist

- [ ] Database created on Neon
- [ ] Code pushed to GitHub
- [ ] Vercel project created
- [ ] Root directory set to `frontend`
- [ ] DATABASE_URL environment variable added
- [ ] Build completed successfully
- [ ] App loads at Vercel URL
- [ ] Can create/edit/delete tasks
- [ ] Data persists (refresh page)

---

## 🆘 Need Help?

1. **Check this guide first**
2. **View Vercel logs** (Dashboard → Functions → Logs)
3. **Test locally:**
   ```powershell
   cd frontend
   npm install
   npm run dev
   ```
4. **Vercel Documentation:** https://vercel.com/docs

---

## 🎉 You're Done!

Your Todo App is now:
- ✅ Deployed on Vercel
- ✅ Using serverless functions
- ✅ Connected to PostgreSQL
- ✅ Accessible worldwide
- ✅ Auto-updates on git push

**Share your URL!** 🌍

```
https://your-app.vercel.app
```