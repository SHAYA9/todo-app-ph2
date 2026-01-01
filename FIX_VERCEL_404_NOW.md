# Fix Vercel 404 Error - Do This NOW

## 🔴 The Problem
Your `frontend/vercel.json` has placeholder text instead of your actual Railway backend URL.

---

## ✅ 3-Step Fix (Do This Now)

### Step 1: Get Your Railway URL
1. Open https://railway.app/dashboard
2. Click on your **backend service**
3. Go to **Settings** tab
4. Find **Networking** section
5. Copy the URL (example: `https://backend-production-1a2b.up.railway.app`)

### Step 2: Update frontend/vercel.json
Replace line 7 in `frontend/vercel.json`:

**BEFORE (Current - WRONG):**
```json
"destination": "https://your-backend-url.com/api/:path*"
```

**AFTER (Correct - use YOUR Railway URL):**
```json
"destination": "https://backend-production-1a2b.up.railway.app/:path*"
```

**Full file should look like:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://YOUR-ACTUAL-RAILWAY-URL.up.railway.app/:path*"
    }
  ]
}
```

⚠️ **IMPORTANT**: 
- Remove `/api` from the end of destination path
- Use YOUR actual Railway URL, not the example above

### Step 3: Commit and Push
```powershell
git add frontend/vercel.json
git commit -m "Fix: Update vercel.json with Railway backend URL"
git push origin main
```

Vercel will automatically redeploy in 1-2 minutes.

---

## ✅ Also Set Environment Variable in Vercel

1. Go to https://vercel.com/dashboard
2. Click your project
3. **Settings** → **Environment Variables**
4. Add or update:
   - **Key**: `NEXT_PUBLIC_API_URL`
   - **Value**: Your Railway URL (e.g., `https://backend-production-1a2b.up.railway.app`)
   - **Environments**: Select ALL (Production, Preview, Development)
5. Click **Save**

Then redeploy:
- Go to **Deployments** tab
- Click **"..."** on latest deployment
- Click **Redeploy**

---

## 🧪 Test It Works

After Vercel redeploys:

1. **Test Backend Directly:**
   - Open: `https://your-railway-url.up.railway.app/docs`
   - Should see FastAPI docs ✓

2. **Test Frontend:**
   - Open: `https://your-app.vercel.app`
   - Should see your todo app ✓

3. **Test API Connection:**
   - Open DevTools (F12) → Network tab
   - Try adding a task
   - Look for `/api/tasks` request
   - Status should be **200 OK** (not 404) ✓

---

## 🚨 Common Mistakes to Avoid

### ❌ WRONG: Including /api at the end
```json
"destination": "https://your-url.railway.app/api/:path*"
```
Backend routes are at root level (`/tasks`), not under `/api`

### ❌ WRONG: Using placeholder
```json
"destination": "https://your-backend-url.com/:path*"
```
This is not a real URL!

### ✅ CORRECT Format
```json
"destination": "https://backend-production-abc123.up.railway.app/:path*"
```

---

## 📋 Quick Checklist

Before pushing:
- [ ] Got Railway URL from Railway dashboard
- [ ] Updated `frontend/vercel.json` line 7
- [ ] Railway URL does NOT have `/api` at the end
- [ ] Committed and pushed changes

After Vercel redeploys:
- [ ] No 404 errors in browser
- [ ] Can see FastAPI docs at Railway URL
- [ ] Can create/view/edit/delete tasks
- [ ] API calls show 200 status in Network tab

---

## 🎯 Example of Correct Configuration

If your Railway URL is:
```
https://backend-production-1a2b3c.up.railway.app
```

Your `frontend/vercel.json` should be:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://backend-production-1a2b3c.up.railway.app/:path*"
    }
  ]
}
```

Your Vercel environment variable should be:
```
NEXT_PUBLIC_API_URL=https://backend-production-1a2b3c.up.railway.app
```

---

## Still Not Working?

### Check CORS
1. Go to Railway dashboard
2. Click your backend service
3. **Variables** tab
4. Find `CORS_ORIGINS`
5. Make sure it includes your Vercel URL:
   ```
   https://your-app.vercel.app,https://*.vercel.app
   ```

### Check Railway Logs
1. Railway dashboard → Your service
2. **Deployments** tab
3. Click latest deployment
4. Check logs for errors

### Check Vercel Logs
1. Vercel dashboard → Your project
2. **Deployments** tab
3. Click latest deployment
4. Check build logs for errors

---

That's it! Just update the URL in `vercel.json` and push. Vercel will auto-deploy and it should work! 🚀