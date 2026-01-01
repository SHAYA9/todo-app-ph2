# Quick Fix for Vercel Deployment Error

## The Problem
You're getting this error:
```
Error: Function Runtimes must have a valid version
```

This happens because Vercel no longer supports Python serverless functions in the `vercel.json` format you're using.

## The Solution (2-Step Deployment)

### Step 1: Deploy Backend Separately (Choose One Platform)

#### Option A: Railway (Recommended - Easiest)
1. Go to https://railway.app
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. **Important**: Set "Root Directory" to `backend`
5. Add environment variable:
   - `DATABASE_URL`: Use Railway's built-in PostgreSQL
   - `CORS_ORIGINS`: `*` (temporary, update after frontend deployment)
6. Deploy → Save the URL (e.g., `https://your-app.railway.app`)

#### Option B: Render
1. Go to https://render.com
2. "New" → "Web Service"
3. Connect your repo
4. Settings:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables (same as Railway)
6. Deploy → Save the URL

### Step 2: Deploy Frontend to Vercel

1. **Update vercel.json** (ALREADY DONE):
   - Changed to proxy requests to your backend URL
   - You need to replace `your-backend-url.com` with actual URL

2. **Add Environment Variable in Vercel Dashboard**:
   - Go to your project on Vercel
   - Settings → Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://your-actual-backend-url.com`

3. **Redeploy**:
   - Deployments → Click "..." → Redeploy

## Files Changed

✅ `frontend/vercel.json` - Removed Python runtime config, added backend proxy
✅ `frontend/src/services/api.ts` - Uses environment variable for API URL
✅ `frontend/.env.production` - Template for production environment variables

## What You Need to Do NOW

1. **Choose a backend platform** (Railway recommended)
2. **Deploy backend** and get the URL
3. **Update `frontend/vercel.json`** line 7:
   ```json
   "destination": "https://YOUR-ACTUAL-BACKEND-URL.com/:path*"
   ```
4. **Update `frontend/.env.production`**:
   ```
   NEXT_PUBLIC_API_URL=https://YOUR-ACTUAL-BACKEND-URL.com
   ```
5. **Commit and push** changes
6. **Add environment variable** in Vercel Dashboard
7. Vercel will auto-deploy

## Quick Commands

```bash
# After updating the files above:
git add .
git commit -m "Fix: Configure for separate backend deployment"
git push origin main
```

## Verification

After deployment:
1. Visit `https://your-backend-url.com/docs` - Should see FastAPI docs
2. Visit `https://your-app.vercel.app` - Should see your frontend
3. Test creating a task - Should work end-to-end

## Need More Details?

See `VERCEL_FRONTEND_DEPLOYMENT.md` for comprehensive guide.

## Cost

- **Vercel**: Free (unlimited for personal projects)
- **Railway**: $5/month free credits (enough for small apps)
- **Render**: Free tier (spins down after 15min inactivity)