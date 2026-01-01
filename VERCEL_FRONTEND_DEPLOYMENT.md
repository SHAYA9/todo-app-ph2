# Vercel Frontend Deployment Guide

## Overview
This guide explains how to deploy the Next.js frontend to Vercel while connecting it to a separately deployed Python backend.

## Architecture
- **Frontend**: Next.js app deployed on Vercel
- **Backend**: FastAPI Python app deployed on Railway/Render/Back4app
- **Communication**: Frontend makes API calls to the deployed backend URL

## Prerequisites
1. Vercel account (connected to GitHub)
2. Backend deployed and accessible via HTTPS URL
3. Backend URL ready (e.g., `https://your-app.railway.app` or `https://your-app.onrender.com`)

## Step 1: Deploy Backend First

### Option A: Deploy to Railway
1. Go to [railway.app](https://railway.app)
2. Click "Start a New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Set root directory to `/backend`
5. Railway will auto-detect Python and use `requirements.txt`
6. Add environment variables:
   - `DATABASE_URL`: Your PostgreSQL connection string (Railway provides one)
   - `CORS_ORIGINS`: `https://your-vercel-app.vercel.app`
7. Deploy and note the generated URL (e.g., `https://your-app.railway.app`)

### Option B: Deploy to Render
1. Go to [render.com](https://render.com)
2. Create "New Web Service"
3. Connect GitHub repository
4. Configure:
   - **Root Directory**: `backend`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
5. Add environment variables:
   - `DATABASE_URL`: PostgreSQL connection string
   - `CORS_ORIGINS`: `https://your-vercel-app.vercel.app`
6. Deploy and note the URL

### Option B: Deploy to Back4app
Follow the comprehensive guide in `HUGGINGFACE_DEPLOYMENT.md` (works for Back4app too)

## Step 2: Configure Frontend for Deployed Backend

Update the API base URL in your frontend to point to the deployed backend:

1. Create/update `frontend/.env.production`:
```env
NEXT_PUBLIC_API_URL=https://your-backend-url.com
```

2. Update `frontend/src/services/api.ts` to use this environment variable:
```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
```

## Step 3: Update vercel.json

The `vercel.json` should proxy API requests to your deployed backend:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": ".next",
  "rewrites": [
    {
      "source": "/api/:path*",
      "destination": "https://your-backend-url.com/:path*"
    }
  ]
}
```

Replace `https://your-backend-url.com` with your actual backend URL.

## Step 4: Deploy to Vercel

### Option 1: Deploy via Vercel Dashboard (Recommended)
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
5. Add Environment Variable:
   - `NEXT_PUBLIC_API_URL`: `https://your-backend-url.com`
6. Click "Deploy"

### Option 2: Deploy via Vercel CLI
```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

## Step 5: Update Backend CORS

After deploying to Vercel, update your backend's CORS settings to allow requests from your Vercel domain:

In `backend/app/main.py`, update CORS origins:
```python
origins = [
    "http://localhost:3000",
    "https://your-app.vercel.app",  # Add your Vercel URL
    "https://your-app-*.vercel.app",  # Preview deployments
]
```

Redeploy your backend after this change.

## Step 6: Test Deployment

1. Visit your Vercel app URL: `https://your-app.vercel.app`
2. Test all functionality:
   - ✅ Add tasks
   - ✅ View tasks
   - ✅ Update tasks
   - ✅ Delete tasks
   - ✅ Check browser console for errors

## Troubleshooting

### Issue: CORS Errors
**Solution**: Ensure backend CORS_ORIGINS includes your Vercel domain

### Issue: API requests failing
**Solution**: 
1. Check if backend is running: Visit `https://your-backend-url.com/docs`
2. Verify `NEXT_PUBLIC_API_URL` environment variable in Vercel
3. Check vercel.json rewrites configuration

### Issue: 404 on API routes
**Solution**: Ensure vercel.json rewrites are correctly configured to proxy to backend

### Issue: Build fails on Vercel
**Solution**: 
1. Check that `frontend/package.json` has all dependencies
2. Verify Next.js version compatibility
3. Check build logs for specific errors

## Environment Variables Summary

### Backend (Railway/Render/Back4app)
- `DATABASE_URL`: PostgreSQL connection string
- `CORS_ORIGINS`: Comma-separated list including Vercel URL

### Frontend (Vercel)
- `NEXT_PUBLIC_API_URL`: Your deployed backend URL (e.g., `https://your-app.railway.app`)

## Deployment Architecture

```
[Browser] 
    ↓
[Vercel - Next.js Frontend]
    ↓ (API requests via /api/*)
[Railway/Render - FastAPI Backend]
    ↓
[PostgreSQL Database]
```

## Continuous Deployment

Once connected to GitHub:
- **Frontend**: Vercel automatically deploys on push to main branch
- **Backend**: Railway/Render automatically deploys on push to main branch

## Custom Domain (Optional)

1. In Vercel dashboard, go to your project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update backend CORS to include your custom domain

## Cost Estimates

- **Vercel**: Free tier suitable for development (100GB bandwidth, unlimited requests)
- **Railway**: $5/month credit on free tier
- **Render**: Free tier with limitations (spins down after inactivity)

## Next Steps

1. ✅ Deploy backend to Railway/Render
2. ✅ Note backend URL
3. ✅ Update `vercel.json` with backend URL
4. ✅ Add `NEXT_PUBLIC_API_URL` to Vercel environment variables
5. ✅ Deploy frontend to Vercel
6. ✅ Update backend CORS
7. ✅ Test complete application

## Support

For issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)
- Render: [render.com/docs](https://render.com/docs)