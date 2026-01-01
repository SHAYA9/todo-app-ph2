# ✅ Vercel Deployment Checklist

Use this checklist to ensure smooth deployment.

## Before Deployment

- [ ] Code is pushed to GitHub
- [ ] Database connection string from Neon ready
- [ ] Vercel account created

## Vercel Configuration

- [ ] Root directory set to: `frontend`
- [ ] Framework preset: Next.js
- [ ] Build command: `npm run build`
- [ ] Output directory: `.next`
- [ ] Environment variable `DATABASE_URL` added
  - [ ] Production ✓
  - [ ] Preview ✓
  - [ ] Development ✓

## Post-Deployment Tests

- [ ] Homepage loads: `https://your-app.vercel.app`
- [ ] API responds: `https://your-app.vercel.app/api/`
- [ ] Create new task works
- [ ] Mark task complete works
- [ ] Delete task works
- [ ] Search/filter works
- [ ] Data persists after page refresh

## Common Issues Fixed

✅ Project structure organized for Vercel
✅ `requirements.txt` in frontend directory
✅ `vercel.json` properly configured
✅ API routing configured in `next.config.js`
✅ CORS configured for Vercel domains
✅ Database tables auto-created on first request
✅ Python runtime specified in vercel.json

## Need Help?

See detailed guide: [VERCEL_DEPLOYMENT_GUIDE.md](./VERCEL_DEPLOYMENT_GUIDE.md)