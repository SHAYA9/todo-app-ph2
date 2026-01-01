# Railway Deployment with Neon DB - Complete Guide

## Overview
This guide shows how to deploy your FastAPI backend to Railway using Neon DB (serverless PostgreSQL) instead of Railway's built-in database.

**Why Neon DB?**
- ✅ Generous free tier (10 GB storage, 1 GB transfer, 1 million queries/month)
- ✅ Serverless - scales to zero when not in use
- ✅ Instant database creation
- ✅ Built-in connection pooling
- ✅ Can be used across multiple projects

---

## Part 1: Create Neon Database

### Step 1: Sign Up for Neon
1. Go to https://neon.tech
2. Click **"Sign Up"**
3. Choose **"Sign up with GitHub"** (recommended)
4. Authorize Neon to access your GitHub account

### Step 2: Create a New Project
1. Click **"Create a Project"** button
2. Enter project details:
   - **Project Name**: `todo-app` (or your preferred name)
   - **Region**: Choose closest to you (e.g., US East, EU West)
   - **PostgreSQL Version**: 16 (latest, default)
3. Click **"Create Project"**
4. Neon will create the database in ~5 seconds

### Step 3: Get Connection String
1. On your project dashboard, you'll see **"Connection Details"**
2. Make sure **"Pooled connection"** is selected (important for serverless!)
3. Copy the connection string - it looks like:
   ```
   postgresql://username:password@ep-xxx-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```
4. **SAVE THIS** - you'll need it for Railway

### Step 4: (Optional) Create a Dedicated Database
1. In Neon console, go to **"Databases"** tab
2. Click **"New Database"**
3. Name it: `todo_db`
4. This keeps your todo app data separate
5. Update your connection string to use this database:
   ```
   postgresql://username:password@ep-xxx.neon.tech/todo_db?sslmode=require
   ```

---

## Part 2: Deploy Backend to Railway

### Step 5: Create Railway Account
1. Go to https://railway.app
2. Click **"Login"** → **"Login with GitHub"**
3. Authorize Railway

### Step 6: Create New Project
1. Click **"New Project"**
2. Select **"Deploy from GitHub repo"**
3. Configure GitHub App:
   - Click **"Configure GitHub App"**
   - Select **"Only select repositories"**
   - Choose your `todo-app-ph2` repository
   - Click **"Install & Authorize"**

### Step 7: Select Repository
1. Find and click your `todo-app-ph2` repository
2. Railway will start analyzing it

### Step 8: Configure Service Settings
1. Click on the **service card** that was created
2. Go to **"Settings"** tab
3. **Service Name**: Change to `backend` (optional, for clarity)
4. Scroll to **"Source"** section
5. **Root Directory**: Enter `backend`
6. Click checkmark to save

### Step 9: Set Build and Start Commands
1. Still in **"Settings"** tab
2. Scroll to **"Build"** section:
   - **Build Command**: 
     ```
     pip install -r requirements.txt
     ```
3. Scroll to **"Deploy"** section:
   - **Start Command**:
     ```
     uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```
4. Click checkmark to save each

### Step 10: Add Environment Variables
1. Go to **"Variables"** tab
2. Click **"+ New Variable"** → **"New Variable"**
3. Add these variables one by one:

   **Variable 1: DATABASE_URL**
   - **Name**: `DATABASE_URL`
   - **Value**: Your Neon connection string from Step 3
     ```
     postgresql://username:password@ep-xxx.neon.tech/neondb?sslmode=require
     ```
   - Click **"Add"**

   **Variable 2: CORS_ORIGINS**
   - **Name**: `CORS_ORIGINS`
   - **Value**: `*` (temporary - we'll update after frontend deployment)
   - Click **"Add"**

   **Variable 3: RAILWAY_ENVIRONMENT** (auto-set by Railway)
   - This should already exist as `production`
   - If not, Railway sets it automatically

### Step 11: Deploy
1. Railway will auto-deploy after adding variables
2. If not, go to **"Deployments"** tab
3. Click **"Deploy"** button
4. Watch the logs:
   - Build logs will show pip installation
   - Deploy logs will show uvicorn starting
5. Wait for **green checkmark** (1-2 minutes)

### Step 12: Generate Public Domain
1. Go to **"Settings"** tab
2. Scroll to **"Networking"** section
3. Click **"Generate Domain"** button
4. Railway creates a URL like:
   ```
   https://backend-production-xxxx.up.railway.app
   ```
5. **COPY THIS URL** - you need it for frontend

### Step 13: Test Your Backend
1. Open: `https://your-railway-url.up.railway.app/docs`
2. You should see FastAPI documentation
3. Try **"GET /tasks"** endpoint:
   - Click **"Try it out"**
   - Click **"Execute"**
   - Should return `[]` (empty array)
4. Try **"POST /tasks/"** to create a test task:
   - Click **"Try it out"**
   - Use this JSON:
     ```json
     {
       "title": "Test Task",
       "description": "Testing Railway + Neon DB",
       "completed": false,
       "priority": "medium"
     }
     ```
   - Click **"Execute"**
   - Should return the created task with an ID

---

## Part 3: Update Frontend Configuration

### Step 14: Update vercel.json
1. Open `frontend/vercel.json`
2. Update line 7 with your Railway URL:
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "rewrites": [
       {
         "source": "/api/:path*",
         "destination": "https://backend-production-xxxx.up.railway.app/:path*"
       }
     ]
   }
   ```

### Step 15: Update .env.production
1. Open `frontend/.env.production`
2. Update with your Railway URL:
   ```
   NEXT_PUBLIC_API_URL=https://backend-production-xxxx.up.railway.app
   ```

### Step 16: Commit Changes
```bash
git add .
git commit -m "Configure frontend for Railway + Neon DB backend"
git push origin main
```

---

## Part 4: Deploy Frontend to Vercel

### Step 17: Login to Vercel
1. Go to https://vercel.com
2. **"Sign Up"** or **"Login"**
3. Choose **"Continue with GitHub"**

### Step 18: Import Project
1. Click **"Add New..."** → **"Project"**
2. Find `todo-app-ph2`
3. Click **"Import"**

### Step 19: Configure Build Settings
1. **Framework Preset**: Next.js (auto-detected)
2. **Root Directory**: 
   - Click **"Edit"**
   - Select `frontend`
   - Click **"Continue"**
3. **Build Command**: `npm run build` (auto-detected)
4. **Output Directory**: `.next` (auto-detected)

### Step 20: Add Environment Variable
1. Expand **"Environment Variables"**
2. Add variable:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://backend-production-xxxx.up.railway.app`
   - Select: **All** (Production, Preview, Development)
3. Click **"Add"**

### Step 21: Deploy
1. Click **"Deploy"**
2. Wait 1-3 minutes for build
3. Once done, click **"Visit"** to see your app
4. **COPY YOUR VERCEL URL**: `https://your-app.vercel.app`

---

## Part 5: Update CORS Settings

### Step 22: Update Railway CORS
1. Go back to Railway dashboard
2. Click your **backend service**
3. Go to **"Variables"** tab
4. Find **CORS_ORIGINS** variable
5. Click **pencil icon** to edit
6. Update value to:
   ```
   https://your-app.vercel.app,https://*.vercel.app
   ```
   (Replace with your actual Vercel URL)
7. Click **checkmark** to save
8. Railway will auto-redeploy (takes ~30 seconds)

---

## Part 6: Test Complete Deployment

### Step 23: Test End-to-End
1. Open your Vercel URL: `https://your-app.vercel.app`
2. Test all features:
   - ✅ **Add Task**: Create a new task
   - ✅ **View Tasks**: See it in the list
   - ✅ **Mark Complete**: Click checkbox
   - ✅ **Edit Task**: Modify title/description
   - ✅ **Delete Task**: Remove task
3. Open browser DevTools (F12):
   - Check **Console** for errors
   - Check **Network** tab - API calls should succeed (200 status)

### Step 24: Verify Database
1. Go to Neon console: https://console.neon.tech
2. Click your project
3. Go to **"SQL Editor"** tab
4. Run query:
   ```sql
   SELECT * FROM tasks;
   ```
5. You should see the tasks you created!

---

## Configuration Summary

### Neon Database
```yaml
Project: todo-app
Database: neondb (or todo_db)
Connection: Pooled connection (for serverless)
Connection String: 
  postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require
```

### Railway Backend Service
```yaml
Service Name: backend
Root Directory: backend

Build Command: pip install -r requirements.txt
Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT

Environment Variables:
  DATABASE_URL: postgresql://...neon.tech/neondb?sslmode=require
  CORS_ORIGINS: https://your-app.vercel.app,https://*.vercel.app
  RAILWAY_ENVIRONMENT: production (auto-set)

Domain: https://backend-production-xxxx.up.railway.app
```

### Vercel Frontend
```yaml
Framework: Next.js
Root Directory: frontend
Build Command: npm run build
Output Directory: .next

Environment Variables:
  NEXT_PUBLIC_API_URL: https://backend-production-xxxx.up.railway.app

Domain: https://your-app.vercel.app
```

---

## Troubleshooting

### Issue 1: Railway Build Fails - "No module named 'app'"
**Solution**:
- Verify Root Directory is set to `backend` in Railway Settings
- Check that `requirements.txt` is in the `backend` folder

### Issue 2: Database Connection Error
**Solution**:
- Verify DATABASE_URL is correct (copy fresh from Neon)
- Make sure you're using **Pooled connection** string from Neon
- Check Neon project is not suspended (verify in Neon console)

### Issue 3: CORS Errors in Browser
**Solution**:
- Update CORS_ORIGINS in Railway to include your Vercel URL
- Make sure there are no spaces in the comma-separated list
- Redeploy Railway backend after updating CORS_ORIGINS

### Issue 4: Frontend Can't Connect to Backend
**Solution**:
- Verify NEXT_PUBLIC_API_URL is set in Vercel environment variables
- Check vercel.json has correct Railway URL
- Redeploy Vercel frontend after adding environment variable

### Issue 5: 502 Bad Gateway from Railway
**Solution**:
- Check Railway logs for Python errors
- Verify Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- Make sure DATABASE_URL is set correctly

---

## Monitoring & Logs

### View Railway Logs
1. Railway Dashboard → Click your service
2. **"Deployments"** tab → Click latest deployment
3. See **Build Logs** and **Deploy Logs**
4. Filter by log level (Info, Warning, Error)

### View Neon Logs
1. Neon Console → Your project
2. **"Monitoring"** tab
3. View connection count, query stats, storage usage

### View Vercel Logs
1. Vercel Dashboard → Your project
2. **"Deployments"** tab → Click deployment
3. **"Functions"** → **"Logs"** tab
4. See API route logs and errors

---

## Cost Breakdown (Free Tiers)

### Neon DB
- **Storage**: 10 GB free
- **Data Transfer**: 1 GB/month free
- **Compute**: Always available (auto-suspend after 5 min idle)
- **Good for**: ~1M queries/month

### Railway
- **Credits**: $5/month free
- **Usage**: ~500 hours execution time
- **Good for**: Small apps with moderate traffic

### Vercel
- **Bandwidth**: 100 GB/month
- **Deployments**: Unlimited
- **Execution**: 100 hours/month
- **Good for**: Most frontend projects

**Total Cost**: $0/month for development and small production apps!

---

## Database Management

### Neon Console Features
- **SQL Editor**: Run queries directly
- **Branches**: Create database branches for testing
- **Monitoring**: View usage, connections, queries
- **Backups**: Automatic daily backups (retained 7 days on free tier)

### Connect to Neon from Local Machine
```bash
# Install PostgreSQL client
brew install postgresql  # Mac
# or
sudo apt install postgresql-client  # Linux

# Connect
psql "postgresql://user:pass@ep-xxx.neon.tech/neondb?sslmode=require"

# Run migrations
\dt  # List tables
SELECT * FROM tasks;  # Query data
```

---

## Scaling Considerations

### When to Upgrade

**Neon**: Upgrade to Pro ($19/month) when you exceed:
- 10 GB storage
- 1 GB data transfer/month
- Need more than 1 project

**Railway**: Upgrade to Pro ($20/month) when you exceed:
- $5 monthly free credits
- Need faster builds
- Want staging environments

**Vercel**: Upgrade to Pro ($20/month) when you exceed:
- 100 GB bandwidth
- Need team collaboration
- Want faster support

---

## Security Best Practices

### 1. Environment Variables
✅ Never commit DATABASE_URL to git
✅ Use different databases for dev/staging/prod
✅ Rotate Neon passwords periodically

### 2. CORS Configuration
✅ Don't use `*` in production
✅ List specific allowed origins
✅ Keep CORS_ORIGINS updated when domains change

### 3. Database Security
✅ Use Neon's IP allowlist (if needed)
✅ Enable connection pooling
✅ Monitor unusual query patterns in Neon console

---

## Deployment Checklist

### Initial Setup
- [ ] Created Neon account and project
- [ ] Copied Neon connection string (pooled)
- [ ] Created Railway account
- [ ] Deployed backend to Railway
- [ ] Set root directory to `backend`
- [ ] Added DATABASE_URL environment variable
- [ ] Added CORS_ORIGINS environment variable
- [ ] Generated Railway public domain
- [ ] Tested `/docs` endpoint

### Frontend Setup
- [ ] Updated vercel.json with Railway URL
- [ ] Updated .env.production with Railway URL
- [ ] Committed and pushed changes
- [ ] Created Vercel account
- [ ] Imported project to Vercel
- [ ] Set root directory to `frontend`
- [ ] Added NEXT_PUBLIC_API_URL environment variable
- [ ] Deployed successfully

### Final Steps
- [ ] Updated CORS_ORIGINS with Vercel URL
- [ ] Tested complete app on Vercel
- [ ] Verified database entries in Neon console
- [ ] Checked browser console for errors
- [ ] All CRUD operations working
- [ ] 🎉 Deployment complete!

---

## Next Steps

1. **Custom Domain**: Add your domain in Vercel and Railway
2. **Monitoring**: Set up error tracking (Sentry, LogRocket)
3. **Analytics**: Add Google Analytics or Plausible
4. **CI/CD**: Automatic testing before deployment
5. **Database Backups**: Set up Neon scheduled backups

---

## Support Resources

- **Neon Docs**: https://neon.tech/docs
- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Your Backend API**: https://your-railway-url.up.railway.app/docs
- **Your Frontend App**: https://your-vercel-url.vercel.app

---

## Quick Reference

### Update Backend Code
```bash
git add backend/
git commit -m "Update backend"
git push origin main
# Railway auto-deploys
```

### Update Frontend Code
```bash
git add frontend/
git commit -m "Update frontend"
git push origin main
# Vercel auto-deploys
```

### Check Deployment Status
- **Railway**: https://railway.app/dashboard
- **Vercel**: https://vercel.com/dashboard
- **Neon**: https://console.neon.tech

### Emergency Rollback
**Railway**: Deployments tab → Previous deployment → Redeploy
**Vercel**: Deployments tab → Previous deployment → Promote to Production