# Vercel 404 Error - Quick Fix Guide

## The Problem
You're getting **404: NOT_FOUND** errors on Vercel, even though:
- ✅ Backend is working on Railway
- ✅ Backend `/docs` endpoint works
- ❌ Frontend on Vercel can't connect to backend

## Root Cause
The `vercel.json` file has **placeholder URL** that needs to be replaced with your **actual Railway backend URL**.

---

## Quick Fix (3 Steps)

### Step 1: Get Your Railway Backend URL
1. Go to https://railway.app/dashboard
2. Click your backend service
3. Go to **"Settings"** tab
4. Scroll to **"Networking"** section
5. Copy your domain (looks like):
   ```
   https://backend-production-xxxx.up.railway.app
   ```

### Step 2: Update vercel.json
1. Open `frontend/vercel.json`
2. **IMPORTANT**: The destination should NOT have `/api` at the end
3. Update line 6:
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
   ❌ WRONG: `"destination": "https://your-url.com/api/:path*"` (has /api)
   ✅ CORRECT: `"destination": "https://your-url.com/:path*"` (no /api)

4. Replace `backend-production-xxxx.up.railway.app` with YOUR actual Railway URL

### Step 3: Update Environment Variable in Vercel
1. Go to https://vercel.com/dashboard
2. Click your project
3. Go to **"Settings"** → **"Environment Variables"**
4. Find or add `NEXT_PUBLIC_API_URL`:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://backend-production-xxxx.up.railway.app`
   - **Environments**: All (Production, Preview, Development)
5. Click **"Save"**

### Step 4: Commit and Redeploy
```bash
# Commit the vercel.json change
git add frontend/vercel.json
git commit -m "Fix: Update vercel.json with actual backend URL"
git push origin main

# Vercel will auto-deploy
```

OR manually redeploy:
1. Go to Vercel dashboard
2. **"Deployments"** tab
3. Click **"..."** on latest deployment
4. Click **"Redeploy"**

---

## Why the 404 Happened

### Issue 1: Placeholder URL
```json
// ❌ This doesn't work
"destination": "https://your-backend-url.com/:path*"
```

### Issue 2: Wrong Path
```json
// ❌ Backend routes don't have /api prefix
"destination": "https://your-url.com/api/:path*"

// ✅ Correct - routes are at root level
"destination": "https://your-url.com/:path*"
```

### How It Should Work
1. Browser requests: `https://your-app.vercel.app/api/tasks`
2. Vercel rewrites to: `https://backend.railway.app/tasks`
3. Backend responds with tasks list
4. Vercel returns response to browser

---

## Verify the Fix

### Test 1: Check vercel.json
Open `frontend/vercel.json` and verify:
- [ ] URL is your actual Railway URL (not placeholder)
- [ ] Destination does NOT end with `/api/:path*`
- [ ] Destination ends with `/:path*`

### Test 2: Check Environment Variable
1. Vercel Dashboard → Settings → Environment Variables
2. Verify `NEXT_PUBLIC_API_URL` exists
3. Value matches your Railway URL

### Test 3: Test the App
1. Open your Vercel URL
2. Open DevTools (F12) → Network tab
3. Try to add a task
4. Check the API request:
   - Should show: `https://your-app.vercel.app/api/tasks`
   - Status should be: **200 OK** (not 404)

---

## Still Getting 404?

### Check Backend is Accessible
Test your backend directly:
```bash
# In browser or curl
curl https://your-backend.railway.app/tasks
```
Should return: `[]` or list of tasks

If this fails:
- Backend might be down
- Check Railway logs
- Verify DATABASE_URL is set

### Check CORS Settings
1. Open browser DevTools → Console
2. Look for CORS errors
3. If you see CORS errors:
   - Go to Railway → Your service → Variables
   - Update `CORS_ORIGINS` to include your Vercel URL:
     ```
     https://your-app.vercel.app,https://*.vercel.app
     ```

### Check Next.js Config
Your `next.config.js` has rewrites, but **vercel.json takes precedence** on Vercel.
Make sure vercel.json is correct (Step 2 above).

---

## Common Mistakes

### ❌ Mistake 1: Including /api in destination
```json
"destination": "https://backend.railway.app/api/:path*"
```
**Why wrong**: Your backend routes are `/tasks`, not `/api/tasks`

### ❌ Mistake 2: Using placeholder URL
```json
"destination": "https://your-backend-url.com/:path*"
```
**Why wrong**: This isn't a real URL

### ❌ Mistake 3: Wrong protocol
```json
"destination": "http://backend.railway.app/:path*"
```
**Why wrong**: Railway uses HTTPS, not HTTP

### ✅ Correct Configuration
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://backend-production-abc123.up.railway.app/:path*"
    }
  ]
}
```

---

## Alternative: Remove vercel.json

If you prefer to use `next.config.js` for rewrites:

1. **Delete** `frontend/vercel.json`
2. **Update** `frontend/next.config.js`:
   ```javascript
   const nextConfig = {
     async rewrites() {
       const isVercel = process.env.VERCEL_ENV;
       
       if (isVercel) {
         return [
           {
             source: '/api/:path*',
             destination: process.env.NEXT_PUBLIC_API_URL + '/:path*',
           },
         ];
       }
       
       // Local development
       return [
         {
           source: '/api/:path*',
           destination: 'http://localhost:8000/:path*',
         },
       ];
     },
   };
   ```
3. Make sure `NEXT_PUBLIC_API_URL` is set in Vercel (Step 3 above)

---

## Quick Checklist

Before redeploying, verify:
- [ ] `frontend/vercel.json` has your actual Railway URL
- [ ] Railway URL in vercel.json does NOT end with `/api`
- [ ] `NEXT_PUBLIC_API_URL` is set in Vercel environment variables
- [ ] Backend is accessible at `https://your-backend.railway.app/docs`
- [ ] CORS_ORIGINS in Railway includes your Vercel URL
- [ ] Changes are committed and pushed to GitHub

---

## Success Checklist

After redeploying, you should see:
- [x] No 404 errors in browser console
- [x] API calls succeed (200 status in Network tab)
- [x] Can create tasks
- [x] Can view tasks
- [x] Can update tasks
- [x] Can delete tasks

---

## Need More Help?

### Check Logs
**Railway**: Dashboard → Service → Deployments → View logs
**Vercel**: Dashboard → Project → Deployments → View function logs

### Verify URLs
- Backend API docs: `https://your-backend.railway.app/docs`
- Frontend: `https://your-app.vercel.app`
- Test endpoint: `https://your-backend.railway.app/tasks`

### Contact Support
If still stuck after following all steps:
1. Copy error message from browser console
2. Check Railway deployment logs
3. Check Vercel build/function logs
4. Verify all environment variables