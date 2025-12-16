# 🚀 Deployment Instructions for Render (Backend)

## Step 1: Create Render Account
Go to https://render.com and sign up/login with GitHub

## Step 2: Create New Web Service

1. Click **"New +"** → **"Web Service"**
2. Connect your GitHub repository: **Muskaan786/Employee-Directory**
3. Click **"Connect"**

## Step 3: Configure Service

### Basic Settings:
- **Name:** `employee-directory-api`
- **Region:** Choose closest to you
- **Branch:** `main`
- **Root Directory:** `backend`
- **Runtime:** `Python 3`

### Build Settings:
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

## Step 4: Add Environment Variables

Click **"Advanced"** → **"Add Environment Variable"**

### For SQLite (Simplest - No External DB Needed):

```
DATABASE_URL=sqlite:///./employees.db
CORS_ORIGINS=https://employee-directory-nine-wheat.vercel.app
```

### OR For PostgreSQL (Render Free Tier):

1. Create a PostgreSQL database on Render first
2. Copy the Internal Database URL
3. Add these variables:

```
DATABASE_URL=postgresql://user:password@hostname/database
CORS_ORIGINS=https://employee-directory-nine-wheat.vercel.app
```

## Step 5: Update Code for SQLite (If using SQLite)

The code needs minor changes to work with SQLite instead of MySQL.

## Step 6: Deploy

1. Click **"Create Web Service"**
2. Wait for deployment (takes 2-3 minutes)
3. Copy your backend URL: `https://employee-directory-api.onrender.com`

## Step 7: Update Vercel Environment Variable

1. Go to Vercel Dashboard
2. Select your project: **employee-directory**
3. Settings → Environment Variables
4. Add/Update:
   - **Key:** `VITE_API_BASE_URL`
   - **Value:** `https://employee-directory-api.onrender.com`
5. Redeploy frontend

## Step 8: Test

Visit: https://employee-directory-nine-wheat.vercel.app

It should now connect to your backend!

---

## ⚠️ Important Notes

### Free Tier Limitations:
- Render free tier **sleeps after 15 minutes** of inactivity
- First request after sleep takes **~30-50 seconds** to wake up
- Mention this in your submission

### Database Initialization:
After first deployment, you need to initialize the database:

1. Go to Render Dashboard → Your Service → Shell
2. Run:
```bash
python init_db.py
python seed_data.py
```

---

## 🎯 Quick Setup (SQLite - Easiest)

If you want the fastest deployment, use SQLite. I'll help you configure that!

**Pros:**
- ✅ No external database needed
- ✅ Free
- ✅ Works immediately
- ✅ Perfect for demo

**Cons:**
- ⚠️ Data resets on redeployment
- ⚠️ Not suitable for production

For an assignment demo, SQLite is perfect!
