# Complete Railway Deployment Guide - Every Step

## Prerequisites
- GitHub account with your repository
- Railway account (sign up at https://railway.app - use GitHub login)

---

## Part 1: Deploy Backend to Railway

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Click **"Login"** (top right)
3. Click **"Login with GitHub"**
4. Authorize Railway to access your GitHub account
5. You'll get $5 free credits (no credit card required initially)

### Step 2: Create New Project
1. Click **"New Project"** button (or "Start a New Project")
2. Select **"Deploy from GitHub repo"**
3. If this is your first time:
   - Click **"Configure GitHub App"**
   - Select which repositories Railway can access
   - Choose **"Only select repositories"**
   - Select your `todo-app-ph2` repository
   - Click **"Install & Authorize"**

### Step 3: Select Repository and Configure
1. You'll see a list of your repositories
2. Click on **`todo-app-ph2`**
3. Railway will start analyzing your repository

### Step 4: Configure Root Directory (CRITICAL)
1. After selecting repo, Railway will show deployment settings
2. **IMPORTANT**: Click on the service card that was created
3. Go to **"Settings"** tab
4. Scroll down to **"Source"** section
5. Find **"Root Directory"** field
6. Enter: **`backend`** (without quotes)
7. Click **"Deploy"** or the checkmark to save

### Step 5: Add PostgreSQL Database
1. In your project dashboard, click **"+ New"** button
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway will create a PostgreSQL database
5. Wait for it to provision (takes 10-30 seconds)

### Step 6: Connect Database to Backend Service
1. Click on your **backend service** card (the one you configured)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"** → **"Add Reference"**
4. Select your **PostgreSQL database**
5. Choose **"DATABASE_URL"** from the dropdown
6. Click **"Add"**
7. This automatically connects your backend to the database

### Step 7: Add CORS Environment Variable
1. Still in **"Variables"** tab of your backend service
2. Click **"+ New Variable"** → **"New Variable"**
3. Enter:
   - **Variable Name**: `CORS_ORIGINS`
   - **Value**: `*` (temporary - we'll update after frontend deployment)
4. Click **"Add"**

### Step 8: Configure Build and Start Commands (If Needed)
1. Go to **"Settings"** tab of your backend service
2. Scroll to **"Build"** section
3. **Build Command**: Leave empty or set to:
   ```
   pip install -r requirements.txt
   ```
4. Scroll to **"Deploy"** section
5. **Start Command**: Set to:
   ```
   uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```
6. Click checkmark to save

### Step 9: Deploy
1. Railway should auto-deploy after configuration
2. If not, go to **"Deployments"** tab
3. Click **"Deploy"** button
4. Watch the build logs in real-time

### Step 10: Get Your Backend URL
1. Once deployment succeeds (green checkmark)
2. Go to **"Settings"** tab
3. Scroll to **"Networking"** section
4. Click **"Generate Domain"** button
5. Railway will generate a public URL like:
   ```
   https://your-app-production-xxxx.up.railway.app
   ```
6. **COPY THIS URL** - you'll need it for frontend deployment

### Step 11: Test Your Backend
1. Open your backend URL in browser
2. Add `/docs` to the end: `https://your-app-production-xxxx.up.railway.app/docs`
3. You should see the FastAPI interactive documentation
4. Try the **"GET /tasks"** endpoint to verify it works

---

## Part 2: Update Frontend Configuration

### Step 12: Update vercel.json with Your Backend URL
1. Open `frontend/vercel.json` in your code editor
2. Replace line 7 with your actual Railway URL:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://your-app-production-xxxx.up.railway.app/:path*"
       }
     ]
   }
   ```
3. Replace `your-app-production-xxxx.up.railway.app` with your actual Railway domain

### Step 13: Update .env.production
1. Open `frontend/.env.production`
2. Update with your Railway URL:
   ```
   NEXT_PUBLIC_API_URL=https://your-app-production-xxxx.up.railway.app
   ```

### Step 14: Commit and Push Changes
```bash
git add .
git commit -m "Configure frontend for Railway backend"
git push origin main
```

---

## Part 3: Deploy Frontend to Vercel

### Step 15: Login to Vercel
1. Go to https://vercel.com
2. Click **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**
4. Authorize Vercel

### Step 16: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find your `todo-app-ph2` repository
3. Click **"Import"**

### Step 17: Configure Project Settings
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: Click **"Edit"** next to root directory
   - Select **`frontend`**
   - Click **"Continue"**
3. **Build Settings**:
   - Build Command: `npm run build` (auto-detected)
   - Output Directory: `.next` (auto-detected)
   - Install Command: `npm install` (auto-detected)

### Step 18: Add Environment Variables
1. Click **"Environment Variables"** section (expand it)
2. Click **"Add"**:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://your-app-production-xxxx.up.railway.app`
   - Select **all environments** (Production, Preview, Development)
3. Click **"Add"** to save

### Step 19: Deploy Frontend
1. Click **"Deploy"** button
2. Wait for build to complete (1-3 minutes)
3. You'll see a success screen with your deployment URL
4. Click **"Visit"** to open your app

### Step 20: Get Your Vercel URL
1. Your Vercel URL will be something like:
   ```
   https://your-app-shaya9.vercel.app
   ```
2. **COPY THIS URL**

---

## Part 4: Update Backend CORS Settings

### Step 21: Update CORS in Railway
1. Go back to Railway dashboard
2. Click on your **backend service**
3. Go to **"Variables"** tab
4. Find the **`CORS_ORIGINS`** variable
5. Click the **pencil icon** to edit
6. Update value to your Vercel URL:
   ```
   https://your-app-shaya9.vercel.app,https://*.vercel.app
   ```
   (This allows your main domain and preview deployments)
7. Click **checkmark** to save
8. Railway will automatically redeploy with new CORS settings

---

## Part 5: Test Complete Deployment

### Step 22: Test Your Deployed App
1. Open your Vercel URL: `https://your-app-shaya9.vercel.app`
2. Test functionality:
   - ✅ Click **"Add Task"** - create a new task
   - ✅ Verify task appears in the list
   - ✅ Click **checkbox** - mark task as complete
   - ✅ Click **"Edit"** - modify task
   - ✅ Click **"Delete"** - remove task

### Step 23: Check for Errors
1. Open browser DevTools (F12)
2. Go to **Console** tab
3. Look for any red error messages
4. If you see CORS errors:
   - Double-check CORS_ORIGINS in Railway includes your Vercel domain
   - Make sure there are no typos in URLs

---

## Railway Settings Summary

### Service Settings (Backend)
```yaml
Source:
  Repository: your-username/todo-app-ph2
  Branch: main
  Root Directory: backend

Build:
  Build Command: pip install -r requirements.txt
  Watch Paths: /backend/**

Deploy:
  Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
  Restart Policy: Always

Networking:
  Public Domain: Generated (https://xxx.up.railway.app)
```

### Environment Variables (Backend)
```
DATABASE_URL=postgresql://postgres:password@host:5432/railway
  (Automatically added by Railway when you add PostgreSQL)

CORS_ORIGINS=https://your-app.vercel.app,https://*.vercel.app
  (You add this manually)
```

---

## Vercel Settings Summary

### Project Settings (Frontend)
```yaml
Build & Development Settings:
  Framework Preset: Next.js
  Root Directory: frontend
  Build Command: npm run build
  Output Directory: .next
  Install Command: npm install
  Development Command: next dev

Environment Variables:
  NEXT_PUBLIC_API_URL: https://xxx.up.railway.app
```

---

## Troubleshooting Common Issues

### Issue 1: "Module not found" during Railway build
**Solution**: 
- Check that Root Directory is set to `backend`
- Verify `requirements.txt` is in the `backend` folder
- Check Railway build logs for specific missing modules

### Issue 2: CORS errors in browser
**Solution**:
- Verify CORS_ORIGINS in Railway includes your Vercel domain
- Make sure there are no trailing slashes in URLs
- Redeploy backend after updating CORS_ORIGINS

### Issue 3: 502 Bad Gateway on Railway
**Solution**:
- Check that Start Command is correct: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Verify DATABASE_URL is set
- Check Railway logs for Python errors

### Issue 4: Frontend can't connect to backend
**Solution**:
- Verify NEXT_PUBLIC_API_URL is set in Vercel environment variables
- Check vercel.json has correct Railway URL
- Redeploy frontend after adding environment variable

### Issue 5: Database connection errors
**Solution**:
- Ensure PostgreSQL database is added to Railway project
- Verify DATABASE_URL reference is added to backend service
- Check that database is in the same Railway project

---

## Monitoring and Logs

### View Railway Logs
1. Go to Railway dashboard
2. Click your backend service
3. Click **"Deployments"** tab
4. Click on latest deployment
5. View **"Build Logs"** and **"Deploy Logs"**

### View Vercel Logs
1. Go to Vercel dashboard
2. Click your project
3. Click **"Deployments"** tab
4. Click on latest deployment
5. Click **"View Function Logs"**

---

## Cost and Limits

### Railway Free Tier
- $5 free credits per month
- ~500 hours of execution time
- Suitable for development and small projects
- No credit card required to start
- Upgrade to Pro ($20/month) for production

### Vercel Free Tier
- Unlimited deployments
- 100 GB bandwidth
- 100 hours Edge Function execution
- Perfect for frontend hosting
- No credit card required

---

## Next Steps After Deployment

1. ✅ Set up custom domain (optional)
2. ✅ Enable GitHub auto-deployments (already done)
3. ✅ Set up monitoring/alerts
4. ✅ Configure environment-specific variables (staging/production)
5. ✅ Add SSL certificate (Railway provides free SSL)

---

## Quick Reference Commands

### Check Backend Locally (Before Deployment)
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
# Visit http://localhost:8000/docs
```

### Check Frontend Locally
```bash
cd frontend
npm install
npm run dev
# Visit http://localhost:3000
```

### Update Deployment
```bash
# Any git push to main automatically triggers deployment
git add .
git commit -m "Update message"
git push origin main
```

---

## Support Links

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Vercel Docs: https://vercel.com/docs
- Your Backend URL: https://xxx.up.railway.app/docs
- Your Frontend URL: https://xxx.vercel.app

---

## Checklist

Use this checklist to track your deployment:

### Backend (Railway)
- [ ] Created Railway account
- [ ] Created new project from GitHub
- [ ] Set root directory to `backend`
- [ ] Added PostgreSQL database
- [ ] Connected DATABASE_URL to backend service
- [ ] Added CORS_ORIGINS variable
- [ ] Set start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- [ ] Generated public domain
- [ ] Tested `/docs` endpoint
- [ ] Copied Railway URL

### Frontend (Vercel)
- [ ] Updated vercel.json with Railway URL
- [ ] Updated .env.production with Railway URL
- [ ] Committed and pushed changes
- [ ] Created Vercel account
- [ ] Imported project from GitHub
- [ ] Set root directory to `frontend`
- [ ] Added NEXT_PUBLIC_API_URL environment variable
- [ ] Deployed successfully
- [ ] Copied Vercel URL

### Final Steps
- [ ] Updated CORS_ORIGINS in Railway with Vercel URL
- [ ] Tested complete app on Vercel URL
- [ ] Verified all features work (create, read, update, delete)
- [ ] Checked browser console for errors
- [ ] Celebrated successful deployment! 🎉