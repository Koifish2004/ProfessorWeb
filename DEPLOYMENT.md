# GradeMyProf - Railway + Vercel Deployment Guide

## Overview
- **grademyprofAuth** → Railway (Go/Gin auth service)
- **grademyprofAPI** → Railway (Go/Fiber API service)
- **grademyprofUI** → Vercel (React/Vite frontend)
- **Database** → Supabase (already hosted)
- **Auth** → Firebase (already configured)

## Step 1: Deploy Auth Service to Railway

1. Go to [Railway](https://railway.app) and create a new project
2. Click "New" → "GitHub Repo" → Select `ProfessorWeb` repository
3. Configure service:
   - **Service Name**: `grademyprofAuth`
   - **Root Directory**: `grademyprofAuth`
   - Railway should auto-detect the `nixpacks.toml` and build correctly
4. Add environment variables (Settings → Variables):
   ```
   JWT_SECRET=<generate with: openssl rand -base64 32>
   PORT=8080
   FIREBASE_SERVICE_ACCOUNT_KEY=<Firebase service account JSON as string>
   ```
5. For Firebase credentials:
   - Go to Firebase Console → Project Settings → Service Accounts
   - Click "Generate New Private Key" - downloads JSON file
   - Copy entire JSON content and paste as single-line string
   - Or stringify it: `cat serviceAccountKey.json | jq -c`
6. Deploy and copy the service URL (e.g., `https://grademyprofauth-production.up.railway.app`)

## Step 2: Deploy API Service to Railway

1. In same Railway project, click "New" → "GitHub Repo" → Select `ProfessorWeb` again
2. Configure service:
   - **Service Name**: `grademyprofAPI`
   - **Root Directory**: `grademyprofAPI`
3. Add environment variables:
   ```
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   JWT_SECRET=<same value as grademyprofAuth>
   PORT=4000
   ```
   **IMPORTANT**: `JWT_SECRET` must be identical in both services
4. Deploy and copy the service URL (e.g., `https://grademyprofapi-production.up.railway.app`)

## Step 3: Update CORS Origins

Update CORS in both Go services to include your Vercel domain:

**grademyprofAuth/main.go** and **grademyprofAPI/main.go**:
```go
AllowOrigins: []string{
    "http://localhost:5173", 
    "https://grademyprof.vercel.app",  // Add your Vercel domain
},
```

Commit and push changes - Railway will auto-redeploy.

## Step 4: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com) and import your GitHub repo
2. Configure project:
   - **Framework Preset**: Vite
   - **Root Directory**: `grademyprofUI` (or leave empty, vercel.json handles it)
   - **Build Command**: `cd grademyprofUI && npm install && npm run build`
   - **Output Directory**: `grademyprofUI/dist`
3. Add environment variables (Settings → Environment Variables):
   ```
   VITE_API_URL=https://grademyprofapi-production.up.railway.app/api
   VITE_AUTH_URL=https://grademyprofauth-production.up.railway.app/login
   
   VITE_FIREBASE_API_KEY=<from Firebase Console>
   VITE_FIREBASE_AUTH_DOMAIN=<from Firebase Console>
   VITE_FIREBASE_PROJECT_ID=<from Firebase Console>
   VITE_FIREBASE_STORAGE_BUCKET=<from Firebase Console>
   VITE_FIREBASE_MESSAGING_SENDER_ID=<from Firebase Console>
   VITE_FIREBASE_APP_ID=<from Firebase Console>
   VITE_FIREBASE_MEASUREMENT_ID=<from Firebase Console>
   ```
4. Deploy! Vercel will give you a URL like `https://grademyprof.vercel.app`

## Step 5: Update Firebase Authorized Domains

1. Go to Firebase Console → Authentication → Settings
2. Under "Authorized domains", add:
   - `grademyprof.vercel.app` (or your custom Vercel domain)
   - `grademyprofauth-production.up.railway.app` (your Railway auth domain)

## Step 6: Custom Domain (Optional)

### For Vercel:
1. Go to Vercel project → Settings → Domains
2. Add `kaifn8n.online` and follow DNS instructions
3. Update CORS and Firebase authorized domains accordingly

### Update CORS after domain setup:
```go
AllowOrigins: []string{
    "http://localhost:5173",
    "https://kaifn8n.online",
},
```

## Environment Variable Checklist

### Railway - grademyprofAuth
- [ ] `JWT_SECRET` (must match API service)
- [ ] `PORT=8080`
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY` (JSON as string)

### Railway - grademyprofAPI
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `JWT_SECRET` (must match auth service)
- [ ] `PORT=4000`

### Vercel - grademyprofUI
- [ ] `VITE_API_URL` (Railway API URL + /api)
- [ ] `VITE_AUTH_URL` (Railway Auth URL + /login)
- [ ] All 7 Firebase config variables

## Testing Deployment

1. Visit your Vercel URL
2. Try browsing professors (should work without login)
3. Try Google sign-in with BITS email
4. Submit a review
5. Check Railway logs if anything fails

## Troubleshooting

**CORS errors**: Check AllowOrigins includes your Vercel domain  
**Auth fails**: Verify Firebase authorized domains and JWT_SECRET matches  
**API errors**: Check Railway logs and Supabase connection  
**Build fails**: Verify environment variables are set before build

## Cost Estimate

- **Railway**: Free tier = 500 hours/month ($5/month after)
- **Vercel**: Free tier = Unlimited hobby projects
- **Supabase**: Free tier = 500MB database, 2GB bandwidth
- **Firebase**: Free tier = 50K MAU

**Total**: $0/month (within free tiers for small usage)
