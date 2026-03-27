# PreNeuro Deployment Guide (100% FREE)

## Overview

PreNeuro consists of three components:
1. **Frontend** (Next.js) → **Vercel** (Free Forever)
2. **Backend** (FastAPI) → **Render** (Free Tier)
3. **Database** (PostgreSQL) → **Neon** (Free Tier)

**Total Cost: $0/month** ✅

---

## 🚀 Complete Free Deployment

### Architecture
```
Frontend (Vercel) → Backend (Render) → Database (Neon)
     FREE              FREE               FREE
```

---

## Step 1: Deploy Database (Neon - Free PostgreSQL)

1. **Go to** [neon.tech](https://neon.tech)

2. **Sign up** with GitHub/Google

3. **Create Project**:
   - Click "Create a project"
   - Name: `preneuro`
   - Region: Choose closest to you (e.g., US East, EU West)

4. **Copy Connection String**:
   - After creation, you'll see the connection details
   - Click "Show password" and copy the full connection string
   - Format: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/preneuro?sslmode=require`
   - **Save this!** You'll need it in Step 2

---

## Step 2: Deploy Backend (Render - Free Tier)

### 2.1 Push Code to GitHub

```bash
cd /home/sammyyakk/projects/preneuro

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - PreNeuro MVP"

# Create repo on GitHub and push
git remote add origin https://github.com/YOUR_USERNAME/preneuro.git
git branch -M main
git push -u origin main
```

### 2.2 Deploy to Render

1. **Go to** [render.com](https://render.com)

2. **Sign up** with GitHub

3. **Create Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub account
   - Select your `preneuro` repository

4. **Configure Service**:
   - **Name**: `preneuro-api`
   - **Region**: Choose closest to you
   - **Branch**: `main`
   - **Root Directory**: `backend`
   - **Runtime**: `Python 3`
   - **Build Command**:
     ```bash
     pip install -r requirements.txt
     ```
   - **Start Command**:
     ```bash
     uvicorn main:app --host 0.0.0.0 --port $PORT
     ```
   - **Instance Type**: Select **FREE**

5. **Add Environment Variables**:
   - Scroll down to "Environment Variables"
   - Click "Add Environment Variable"
   - Add these:

   | Key | Value |
   |-----|-------|
   | `DATABASE_URL` | `postgresql+psycopg://YOUR_NEON_CONNECTION_STRING` |
   | `CORS_ORIGINS` | `["*"]` |
   | `PORT` | `10000` |

   **Important Notes**:
   - Replace `YOUR_NEON_CONNECTION_STRING` with the string from Step 1
   - Change `postgresql://` to `postgresql+psycopg://` (add `+psycopg`)
   - Keep the `?sslmode=require` at the end
   - For now, use `["*"]` for CORS (we'll update this after getting Vercel URL)

6. **Deploy**:
   - Click "Create Web Service"
   - Wait 3-5 minutes for deployment
   - You'll see build logs in real-time

7. **Copy Your Backend URL**:
   - After successful deployment, you'll see your URL at the top
   - Format: `https://preneuro-api.onrender.com`
   - Test it: Visit `https://preneuro-api.onrender.com/api/health`
   - Should return: `{"status":"healthy"}`

⚠️ **Note**: Render free tier "spins down" after 15 minutes of inactivity. First request after idle takes ~30 seconds to wake up.

---

## Step 3: Deploy Frontend (Vercel - Free)

### 3.1 Deploy to Vercel

1. **Go to** [vercel.com](https://vercel.com)

2. **Sign up** with GitHub

3. **Import Project**:
   - Click "Add New..." → "Project"
   - You'll see your GitHub repositories
   - Click "Import" next to your `preneuro` repository

4. **Configure Project**:
   - **Framework Preset**: Next.js (auto-detected ✓)
   - **Root Directory**: Click "Edit" → Select `frontend` folder
   - **Build Command**: Leave default (`pnpm build` or `npm run build`)
   - **Output Directory**: Leave default (`.next`)
   - **Install Command**: Leave default

5. **Add Environment Variable**:
   - Expand "Environment Variables" section
   - Add:
     ```
     Name: NEXT_PUBLIC_API_URL
     Value: https://preneuro-api.onrender.com/api
     ```
   - Replace `preneuro-api.onrender.com` with your actual Render backend URL from Step 2

6. **Deploy**:
   - Click "Deploy"
   - Wait 2-3 minutes for build
   - Watch the build logs (usually completes successfully)

7. **Get Your Live URL**:
   - After deployment: `https://preneuro-xxxx.vercel.app`
   - Click "Visit" to open your live site!

---

## Step 4: Update CORS (Important!)

Now that you have your Vercel URL, secure your backend:

1. **Go back to Render Dashboard**
2. Click on your `preneuro-api` service
3. Go to "Environment" tab
4. Click "Edit" on `CORS_ORIGINS`
5. Change from `["*"]` to:
   ```json
   ["https://preneuro-xxxx.vercel.app"]
   ```
   Replace with your actual Vercel URL

6. Click "Save Changes"
7. Render will automatically redeploy (~1-2 minutes)

---

## Step 5: Test Everything! 🎉

1. **Open your Vercel URL** in browser
2. **Open DevTools** (F12) → Console tab
3. **Test functionality**:
   - ✅ Dashboard loads
   - ✅ Create a patient
   - ✅ Create an assessment
   - ✅ Run AI prediction
   - ✅ View charts and results

**If everything works - you're live!** 🚀

---

## Alternative: All on Render (Single Platform)

If you want everything on one platform:

### Quick Setup

1. **Database**:
   - Render Dashboard → New → PostgreSQL
   - Name: `preneuro-db`
   - Instance Type: **Free**
   - Copy **Internal Database URL**

2. **Backend**:
   - Follow Step 2 above
   - Use Render's Internal Database URL
   - Format already includes `postgresql://` (change to `postgresql+psycopg://`)

3. **Frontend** (Static Site):
   - New → Static Site
   - Root Directory: `frontend`
   - Build Command:
     ```bash
     npm install -g pnpm && pnpm install && pnpm build
     ```
   - Publish Directory: `.next`
   - Add environment variable:
     ```
     NEXT_PUBLIC_API_URL=https://preneuro-api.onrender.com/api
     ```

---

## Troubleshooting

### ❌ Backend shows "Build failed"

**Check build logs** in Render:
- Ensure `requirements.txt` is in the `backend` folder
- Verify Root Directory is set to `backend`
- Common fix: Build command should be `pip install -r requirements.txt`

### ❌ Database connection error

**Solution**:
- Check `DATABASE_URL` format: `postgresql+psycopg://...` (note `+psycopg`)
- Ensure Neon connection string ends with `?sslmode=require`
- Test connection: Copy URL and try in a PostgreSQL client

### ❌ CORS error in browser console

**Symptoms**: `Access-Control-Allow-Origin` error in console

**Solution**:
- Verify `CORS_ORIGINS` in Render matches your Vercel URL exactly
- Format: `["https://your-exact-url.vercel.app"]` (must be an array with quotes)
- After changing, wait for Render to redeploy

### ❌ Frontend API calls return 404

**Solution**:
- Check `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Must end with `/api`: `https://your-backend.onrender.com/api`
- After fixing, redeploy: Vercel Dashboard → Deployments → Click ⋯ → Redeploy

### ❌ "Service Unavailable" or slow response

**This is normal for Render free tier!**
- Free tier "sleeps" after 15 mins of inactivity
- First request after sleep takes ~30 seconds
- Subsequent requests are fast
- **Fix**: Upgrade to paid tier ($7/mo) for 24/7 uptime

### ❌ Frontend build fails on Vercel

**Check build logs**:
- Common issue: Missing environment variable
- Ensure `NEXT_PUBLIC_API_URL` is set
- Try changing install command to: `npm install`

---

## Free Tier Limits

| Service | Tier | Limits | Perfect For |
|---------|------|--------|-------------|
| **Neon** | Free | 3 GB storage, 1 database, 100 hours compute/month | ✅ MVP/Demo |
| **Render** | Free | 750 hours/month, sleeps after 15min idle | ✅ Hackathon/Portfolio |
| **Vercel** | Hobby | 100 GB bandwidth, 100 deployments/day | ✅ Personal projects |

### When to Upgrade

Upgrade when you need:
- **Render** ($7/mo): No sleep, faster spin-up, custom domain
- **Neon** ($19/mo): More storage, multiple databases, better performance
- **Vercel** ($20/mo): Team features, more bandwidth, analytics

---

## Other 100% Free Alternatives

### Option B: Netlify + Render + Neon

- **Frontend**: [Netlify](https://netlify.com) instead of Vercel
- **Backend**: Render (same as above)
- **Database**: Neon (same as above)

**Netlify Deploy**:
1. Go to netlify.com
2. New site from Git → Select repo
3. Base directory: `frontend`
4. Build command: `pnpm build`
5. Publish directory: `.next`
6. Environment variable: `NEXT_PUBLIC_API_URL`

### Option C: Fly.io (Backend Alternative)

**Fly.io** offers free tier for backend:
- 3 VMs with 256MB RAM (always on!)
- No cold starts like Render

**Deploy to Fly.io**:
```bash
# Install flyctl
curl -L https://fly.io/install.sh | sh

# Login
fly auth login

# Launch app (in backend directory)
cd backend
fly launch

# Set environment variables
fly secrets set DATABASE_URL="postgresql+psycopg://..."
fly secrets set CORS_ORIGINS='["https://your-vercel-url.vercel.app"]'

# Deploy
fly deploy
```

---

## Production Checklist

- [ ] Custom domain (optional, costs $10-15/year)
- [ ] Update CORS to specific domain (remove `["*"]`)
- [ ] Enable Neon autoscaling
- [ ] Set up Sentry for error monitoring (free tier available)
- [ ] Add basic rate limiting
- [ ] Create staging environment
- [ ] Enable database backups in Neon

---

## Quick Commands

```bash
# Test backend health
curl https://your-backend.onrender.com/api/health

# Test patient endpoint
curl https://your-backend.onrender.com/api/patients

# Redeploy Vercel (if needed)
npm install -g vercel
cd frontend
vercel --prod

# Check Neon database connection
psql "your-neon-connection-string"
```

---

## Support Links

- **Render Help**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **Neon Docs**: https://neon.tech/docs/introduction
- **FastAPI Deployment**: https://fastapi.tiangolo.com/deployment/

---

## Summary

✅ **Database**: Neon (Free PostgreSQL)
✅ **Backend**: Render (Free with cold starts)
✅ **Frontend**: Vercel (Free, fast CDN)
✅ **Total Cost**: $0/month
✅ **Deployment Time**: ~20 minutes

**Your app is now live and accessible worldwide for FREE!** 🌍

For hackathons and demos, this setup is perfect. When you get real users, consider upgrading Render to paid tier ($7/mo) to remove cold starts.
