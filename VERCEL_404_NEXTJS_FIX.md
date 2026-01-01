# Fix Vercel 404: NOT_FOUND Error

## 🔴 The Problem
You're seeing "404: NOT_FOUND" on your Vercel deployment. This is a **Next.js routing error**, not an API error.

**Root Cause**: The `vercel.json` configuration was overriding Vercel's automatic Next.js detection.

---

## ✅ The Fix (3 Steps)

### Step 1: Updated vercel.json (DONE ✓)
I've already updated your `frontend/vercel.json` to remove the problematic `buildCommand` and `outputDirectory` fields that were preventing Vercel from properly detecting your Next.js app.

### Step 2: Commit and Push
```powershell
git add frontend/vercel.json
git commit -m "Fix: Remove build config to let Vercel auto-detect Next.js"
git push origin main
```

### Step 3: Verify Vercel Settings
1. Go to https://vercel.com/dashboard
2. Click your project **"taskflow-xs"**
3. Go to **Settings** → **General**
4. Verify these settings:
   - **Framework Preset**: Next.js ✓
   - **Root Directory**: `frontend` ✓
   - **Build Command**: (leave empty - auto-detected) ✓
   - **Output Directory**: (leave empty - auto-detected) ✓
   - **Install Command**: (leave empty - auto-detected) ✓

### Step 4: Redeploy
After pushing the changes:
1. Go to **Deployments** tab in Vercel
2. Vercel will auto-deploy from your git push
3. Wait 1-2 minutes for build to complete

OR manually trigger:
1. Click **"..."** on latest deployment
2. Click **"Redeploy"**

---

## ✅ Also Check: Environment Variables

Make sure this is set in Vercel:
1. **Settings** → **Environment Variables**
2. Variable should exist:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://todo-app-ph2-production.up.railway.app`
   - **Environments**: All (Production, Preview, Development)
3. If missing, add it and redeploy

---

## 🧪 Test After Redeployment

Once Vercel redeploys:

1. **Visit**: https://taskflow-xs.vercel.app
2. **Expected**: You should see your Todo app (not 404)
3. **Test functionality**:
   - Add a task
   - View tasks
   - Mark as complete
   - Edit task
   - Delete task

---

## 📋 What Changed

### Before (Causing 404):
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rewrites": [...]
}
```
**Problem**: These fields override Vercel's Next.js auto-detection

### After (Fixed):
```json
{
  "rewrites": [...]
}
```
**Solution**: Let Vercel auto-detect Next.js build settings

---

## 🚨 If Still Getting 404 After Fix

### Issue 1: Build Failed
1. Check Vercel **Deployments** tab
2. Look for red X (failed build)
3. Click deployment → View build logs
4. Look for error messages

Common build errors:
- TypeScript errors
- Missing dependencies
- CSS/Tailwind errors

### Issue 2: Wrong Root Directory
1. Vercel Settings → General
2. Root Directory should be: `frontend`
3. If wrong, update it and redeploy

### Issue 3: Cache Issues
1. Vercel Deployments tab
2. Click **"..."** → **"Redeploy"**
3. Check **"Use existing build cache"** → **UNCHECK** it
4. Click **"Redeploy"**

---

## 📊 Expected Build Output

In Vercel build logs, you should see:
```
✓ Collecting page data
✓ Generating static pages (3/3)
✓ Collecting build traces
✓ Finalizing page optimization

Route (app)                              Size
┌ ○ /                                    XX kB
└ ○ /api                                 0 B

○  (Static)  prerendered as static content
```

---

## 🎯 Complete Checklist

Before testing:
- [ ] Updated `frontend/vercel.json` (removed buildCommand/outputDirectory)
- [ ] Committed and pushed changes
- [ ] Verified Root Directory = `frontend` in Vercel settings
- [ ] Verified `NEXT_PUBLIC_API_URL` exists in Vercel env vars
- [ ] Vercel build completed successfully (green checkmark)

After redeployment:
- [ ] Can see Todo app (not 404)
- [ ] Can create tasks
- [ ] Can view tasks
- [ ] Can edit tasks
- [ ] Can delete tasks
- [ ] No errors in browser console

---

## 🔍 Debugging Commands

### Check Vercel Build Logs
1. Vercel Dashboard → Your Project
2. Deployments tab
3. Click latest deployment
4. View "Building" and "Functions" logs

### Check Browser Console
1. Open https://taskflow-xs.vercel.app
2. Press F12 (DevTools)
3. Console tab - look for errors
4. Network tab - check failed requests

### Test Backend Directly
```bash
# In browser or command line
curl https://todo-app-ph2-production.up.railway.app/tasks
```
Should return: `[]` or list of tasks

---

## 💡 Why This Happened

Next.js 14+ (App Router) has specific build requirements that Vercel automatically configures. When you manually specify `buildCommand` and `outputDirectory` in `vercel.json`, it overrides Vercel's smart detection and can cause routing issues.

The fix is to **only** keep the `rewrites` configuration in `vercel.json` and let Vercel handle the rest automatically.

---

## ✅ Summary

**What was wrong**: `vercel.json` had manual build configuration
**What I fixed**: Removed `buildCommand` and `outputDirectory`
**What you need to do**: Commit, push, and wait for Vercel to redeploy
**Expected result**: App loads successfully at https://taskflow-xs.vercel.app

That's it! The fix is simple but critical. 🚀