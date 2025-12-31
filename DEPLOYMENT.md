# Deployment Guide - Vercel (100% Free)

This guide will help you deploy your Todo App to Vercel completely free.

## Prerequisites

1. GitHub account
2. Vercel account (sign up at [vercel.com](https://vercel.com))
3. PostgreSQL database (Neon provides free tier - [neon.tech](https://neon.tech))

## Step 1: Prepare Your Database

### Option A: Use Neon (Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech)
2. Sign up for a free account
3. Create a new project
4. Copy the connection string (looks like: `postgresql://user:password@host/database?sslmode=require`)

### Option B: Use Your Existing Database

Make sure you have a PostgreSQL connection string ready.

## Step 2: Push to GitHub

1. Initialize git repository (if not already done):
```bash
git init
git add .
git commit -m "Initial commit - Todo App"
```

2. Create a new repository on GitHub

3. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

## Step 3: Deploy to Vercel

### Method 1: Web Interface (Recommended for First Time)

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. **Import Git Repository:**
   - Select your GitHub repository
   - Click **"Import"**

4. **Configure Project:**
   - **Framework Preset:** Next.js (should be auto-detected)
   - **Root Directory:** `./` (leave as is)
   - **Build Command:** Leave default
   - **Output Directory:** Leave default

5. **Environment Variables:**
   Click "Add" and enter:
   - **Name:** `DATABASE_URL`
   - **Value:** Your PostgreSQL connection string
   - **Environment:** Production, Preview, Development (select all)

6. Click **"Deploy"**

Vercel will:
- ✅ Install dependencies
- ✅ Build the Next.js frontend
- ✅ Set up FastAPI backend as serverless functions
- ✅ Deploy everything

**Your app will be live in 1-2 minutes!** 🎉

### Method 2: Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

4. Follow the prompts:
   - Set up and deploy? **Y**
   - Which scope? Select your account
   - Link to existing project? **N**
   - What's your project's name? **todo-app** (or your choice)
   - In which directory is your code located? **./**
   - Override settings? **N**

5. Add environment variable:
```bash
vercel env add DATABASE_URL
```
   - Paste your database connection string
   - Select environments: **Production, Preview, Development**

6. Deploy to production:
```bash
vercel --prod
```

## Step 4: Verify Deployment

1. Vercel will provide you with a URL like: `https://your-app.vercel.app`
2. Open the URL in your browser
3. Test the app:
   - ✅ Create a task
   - ✅ Mark as complete
   - ✅ Delete a task
   - ✅ Filter and search

## Step 5: Custom Domain (Optional)

1. In Vercel dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow Vercel's instructions to configure DNS

## Troubleshooting

### Database Connection Issues

**Problem:** Tasks don't load or create

**Solution:**
1. Check environment variable in Vercel:
   - Go to Project → Settings → Environment Variables
   - Verify `DATABASE_URL` is set correctly
   - Make sure it includes `?sslmode=require` at the end

2. Redeploy after fixing:
```bash
vercel --prod
```

### CORS Errors

**Problem:** API calls failing with CORS error

**Solution:**
The app is configured to allow requests from `*.vercel.app` domains. If using a custom domain, update `backend/app/main.py`:

```python
allow_origins=[
    "http://localhost:3000",
    "https://*.vercel.app",
    "https://your-custom-domain.com"  # Add your domain
]
```

### Build Failures

**Problem:** Deployment fails during build

**Solution:**
1. Check build logs in Vercel dashboard
2. Common fixes:
   - Ensure all dependencies are in `package.json` and `requirements.txt`
   - Check for TypeScript errors locally: `npm run build` in frontend folder
   - Verify Python version compatibility

## Updating Your App

After making changes:

```bash
git add .
git commit -m "Your change description"
git push origin main
```

Vercel will automatically:
- ✅ Detect the push
- ✅ Build and deploy your changes
- ✅ Your app is updated in ~1 minute

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@host/db?sslmode=require` |

## Free Tier Limits

Vercel's free tier includes:
- ✅ Unlimited deployments
- ✅ 100GB bandwidth per month
- ✅ Serverless function execution
- ✅ Automatic HTTPS
- ✅ Global CDN

This is more than enough for a personal todo app!

## Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review this guide
3. Check [Vercel's documentation](https://vercel.com/docs)

## Success! 🎉

Your Todo App is now live and accessible worldwide!

**Next Steps:**
- Share your app URL with friends
- Add more features
- Customize the design
- Set up a custom domain