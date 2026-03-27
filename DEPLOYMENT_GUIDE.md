# PreNeuro Deployment Guide

## Overview

PreNeuro consists of three components that need to be deployed:
1. **Frontend** (Next.js) → Vercel
2. **Backend** (FastAPI) → Railway/Render
3. **Database** (PostgreSQL) → Neon/Supabase/Railway

---

## ✅ Recommended: Vercel + Railway + Neon (Easiest & Free)

### Architecture
```
Frontend (Vercel) → Backend (Railway) → Database (Neon)
```

---

## Step-by-Step Deployment

### Step 1: Deploy Database (Neon - Free PostgreSQL)

1. Go to [neon.tech](https://neon.tech) and sign up
2. Click "Create Project"
   - Name: `preneuro`
   - Region: Choose closest to you
3. Copy the connection string from the dashboard
   - Format: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/preneuro?sslmode=require`
4. **Important**: Keep this URL safe for Step 2

---

### Step 2: Deploy Backend (Railway)

#### Option A: Using Railway Dashboard (Recommended)

1. **Sign up** at [railway.app](https://railway.app)

2. **Push code to GitHub first**:
   ```bash
   cd /home/sammyyakk/projects/preneuro
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/preneuro.git
   git push -u origin main
   ```

3. **Create Railway Project**:
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose your `preneuro` repository
   - Click "Deploy Now"

4. **Configure Build Settings**:
   - Go to Settings → Root Directory
   - Set to: `backend`
   - Railway auto-detects Python and installs dependencies

5. **Add Environment Variables**:
   - Go to Variables tab
   - Click "New Variable" and add:
     ```env
     DATABASE_URL=postgresql+psycopg://[YOUR_NEON_CONNECTION_STRING]
     CORS_ORIGINS=["https://preneuro.vercel.app"]
     PORT=8000
     ```
   - **Important**: Change the protocol from `postgresql://` to `postgresql+psycopg://` for your Neon URL
   - Replace `preneuro.vercel.app` with your actual Vercel domain (or use wildcard first: `["*"]`)

6. **Wait for deployment** (~2-3 minutes)

7. **Copy your Railway URL**:
   - Should look like: `https://preneuro-production-xxxx.up.railway.app`
   - Test it: Visit `https://your-railway-url/api/health` - should return `{"status":"healthy"}`

#### Option B: Using Railway CLI

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# Initialize project in backend directory
cd /home/sammyyakk/projects/preneuro/backend
railway init

# Add environment variables
railway variables set DATABASE_URL="postgresql+psycopg://your-neon-url"
railway variables set CORS_ORIGINS='["*"]'

# Deploy
railway up
```

---

### Step 3: Deploy Frontend (Vercel)

1. **Go to** [vercel.com](https://vercel.com) and sign in with GitHub

2. **Import Project**:
   - Click "Add New..." → "Project"
   - Select your `preneuro` repository from GitHub

3. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: Click "Edit" → Select `frontend`
   - **Build Command**: `pnpm build` (or leave default)
   - **Output Directory**: Leave default
   - **Install Command**: `pnpm install` (or leave default)

4. **Add Environment Variables**:
   - Expand "Environment Variables" section
   - Add:
     ```
     Key: NEXT_PUBLIC_API_URL
     Value: https://your-railway-url.up.railway.app/api
     ```
   - Replace with your actual Railway backend URL from Step 2

5. **Deploy**:
   - Click "Deploy"
   - Wait ~2-3 minutes for build to complete

6. **Copy Your Vercel URL**:
   - After deployment: `https://preneuro.vercel.app` (or similar)
   - Visit the URL to test!

---

### Step 4: Update CORS Settings

Now that you have your Vercel URL, update the backend CORS configuration:

1. Go back to **Railway Dashboard**
2. Navigate to your backend project → **Variables**
3. Edit `CORS_ORIGINS`:
   ```env
   CORS_ORIGINS=["https://preneuro.vercel.app","https://preneuro-*.vercel.app"]
   ```
   - First URL: your production domain
   - Second URL (with `*`): allows Vercel preview deployments to work

4. Railway will automatically redeploy (~1 minute)

---

### Step 5: Test Your Deployment! 🎉

1. Visit your Vercel URL: `https://preneuro.vercel.app`
2. Open browser DevTools (F12) → Console (to see any errors)
3. Try these actions:
   - ✅ View dashboard
   - ✅ Create a new patient
   - ✅ Create an assessment
   - ✅ Run AI prediction
   - ✅ View results

If everything works - **congratulations!** Your app is live! 🚀

---

## Troubleshooting

### Issue: CORS Error
**Symptom**: Browser console shows `CORS policy: No 'Access-Control-Allow-Origin' header`

**Solution**:
- Verify `CORS_ORIGINS` in Railway includes your Vercel domain
- Make sure it's an array: `["https://your-domain.vercel.app"]`
- Redeploy backend after changing

### Issue: API calls fail with 404
**Symptom**: Network tab shows 404 for API calls

**Solution**:
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Should be: `https://your-railway-url.up.railway.app/api` (with `/api` at the end)
- Redeploy frontend after fixing

### Issue: Database connection error
**Symptom**: Backend logs show connection errors

**Solution**:
- Verify `DATABASE_URL` format: `postgresql+psycopg://...` (note the `+psycopg`)
- Check Neon database is active (not paused)
- Ensure connection string includes `?sslmode=require` at the end

### Issue: Railway deployment fails
**Symptom**: Build error during Railway deployment

**Solution**:
- Verify Root Directory is set to `backend`
- Check `requirements.txt` has all dependencies
- View build logs in Railway for specific error

### Issue: Vercel build fails
**Symptom**: Build error during Vercel deployment

**Solution**:
- Verify Root Directory is set to `frontend`
- Check `NEXT_PUBLIC_API_URL` is set in environment variables
- Try deploying with npm instead: change install command to `npm install`

---

## Alternative: Render (All-in-One Free Hosting)

If you prefer a single platform for everything:

### Quick Deploy to Render

1. **Database**:
   - Go to [render.com](https://render.com)
   - New → PostgreSQL
   - Name: `preneuro-db`, Plan: Free
   - Copy Internal Database URL

2. **Backend**:
   - New → Web Service
   - Connect GitHub repo
   - Root Directory: `backend`
   - Build: `pip install -r requirements.txt`
   - Start: `uvicorn main:app --host 0.0.0.0 --port $PORT`
   - Add Environment Variables:
     ```
     DATABASE_URL=<internal-database-url>
     CORS_ORIGINS=["https://preneuro.onrender.com"]
     ```

3. **Frontend**:
   - New → Static Site
   - Root Directory: `frontend`
   - Build: `npm install -g pnpm && pnpm install && pnpm build`
   - Publish: `.next` or configure for static export
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=https://preneuro-api.onrender.com/api
     NODE_VERSION=20
     ```

⚠️ **Note**: Render free tier has cold starts (30s delay after inactivity)

---

## Cost Breakdown

| Service | Tier | Cost | Limits |
|---------|------|------|--------|
| **Neon** | Free | $0 | 3 GB storage, 1 database |
| **Railway** | Free | $0 | $5 credit/month (~500 hours) |
| **Vercel** | Hobby | $0 | 100 GB bandwidth |
| **Total** | | **$0/month** | Perfect for MVP/Demo |

### When to Upgrade

- **Neon**: Upgrade when you need >3GB or multiple databases ($19/mo)
- **Railway**: Upgrade when free credit runs out ($5/mo resource-based)
- **Vercel**: Upgrade for team features or custom domains ($20/mo)

---

## Production Checklist

Before going live with real users:

- [ ] Set up custom domain in Vercel
- [ ] Enable HTTPS (automatic with Vercel/Railway)
- [ ] Replace mock authentication with real JWT auth
- [ ] Set up error monitoring (Sentry)
- [ ] Enable database backups (Neon automated backups)
- [ ] Add rate limiting to API
- [ ] Review HIPAA compliance requirements
- [ ] Set up CI/CD with GitHub Actions
- [ ] Configure environment-specific settings (staging vs production)
- [ ] Add analytics (PostHog, Google Analytics)

---

## Useful Links

- **Railway Docs**: https://docs.railway.app
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/
- **Next.js Deployment**: https://nextjs.org/docs/deployment

---

## Quick Command Reference

```bash
# Check backend logs in Railway
railway logs

# Redeploy frontend on Vercel
vercel --prod

# Test backend locally
cd backend && uvicorn main:app --reload

# Test frontend locally
cd frontend && pnpm dev

# Check database connection
psql "your-neon-connection-string"
```

---

## Need Help?

Common commands to debug:

```bash
# Test backend API
curl https://your-railway-url.up.railway.app/api/health

# Test CORS
curl -H "Origin: https://your-vercel-url.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -X OPTIONS https://your-railway-url.up.railway.app/api/patients

# View Railway logs
railway logs --tail

# Rebuild Vercel deployment
vercel --force
```

---

**You're all set!** 🎉 Your PreNeuro app should now be live and accessible worldwide.
