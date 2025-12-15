# Vercel Deployment Configuration

## Frontend Deployment

**Platform:** Vercel  
**Repository:** https://github.com/Muskaan786/Employee-Directory

### Build Settings

- **Framework Preset:** Vite
- **Root Directory:** `frontend`
- **Build Command:** `npm run build`
- **Output Directory:** `dist`
- **Install Command:** `npm install`
- **Node Version:** 18.x

### Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
VITE_API_BASE_URL=https://your-backend-app.onrender.com
```

**Note:** Replace with your actual Render backend URL after deployment.

---

## Backend Deployment

**Platform:** Render  
**Repository:** https://github.com/Muskaan786/Employee-Directory

### Service Settings

- **Type:** Web Service
- **Name:** `employee-directory-api`
- **Root Directory:** `backend`
- **Runtime:** Python 3
- **Build Command:** `pip install -r requirements.txt`
- **Start Command:** `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Environment Variables

Add these in Render Dashboard → Environment Variables:

```
DATABASE_URL=<your-mysql-connection-string>
CORS_ORIGINS=https://your-vercel-app.vercel.app
```

### Database Options

**Option 1: Render PostgreSQL (Free)**
- Use Render's built-in PostgreSQL
- Update code to use PostgreSQL instead of MySQL

**Option 2: External MySQL**
- Use PlanetScale (free MySQL)
- Use Railway (has MySQL)
- Use Aiven (free tier MySQL)

**Option 3: SQLite for Demo**
- Simple file-based database
- Good for assignment demo
- No external service needed

---

## 🎯 Recommended Approach for Assignment

Since this is for assignment submission, I recommend:

### ✅ Quick Demo Setup (Easiest)

1. **Frontend on Vercel** ✓
2. **Backend on Render** ✓
3. **Database: Render PostgreSQL (Free)**

This gives you:
- Live working demo
- No database hosting costs
- Easy to set up

---

## 📋 Deployment Checklist

### Before Deploying:

- [ ] Update CORS origins to include Vercel URL
- [ ] Test locally one more time
- [ ] Commit and push all changes
- [ ] Have database ready (or use Render PostgreSQL)

### After Deploying Backend:

- [ ] Copy Render backend URL
- [ ] Add to Vercel environment variables
- [ ] Redeploy frontend on Vercel

### After Deploying Frontend:

- [ ] Copy Vercel frontend URL
- [ ] Update CORS_ORIGINS in Render
- [ ] Test the live application

---

## 🔗 Final URLs

After deployment, you'll have:

- **Frontend:** `https://employee-directory-[random].vercel.app`
- **Backend:** `https://employee-directory-api.onrender.com`
- **GitHub:** `https://github.com/Muskaan786/Employee-Directory`

Include all three URLs in your assignment submission!

---

## ⚠️ Important Notes

1. **Free Tier Limitations:**
   - Render free tier sleeps after 15 mins inactivity
   - First request after sleep takes ~30 seconds
   - Mention this in submission

2. **CORS Configuration:**
   - Must update CORS_ORIGINS with Vercel URL
   - Backend won't work without proper CORS

3. **Database:**
   - If using Render PostgreSQL, update SQLAlchemy connection
   - Or use SQLite for simple demo

---

## 🎁 Brownie Points

Hosting the application shows:
- ✅ DevOps knowledge
- ✅ Full-stack deployment experience
- ✅ Production-ready code
- ✅ Going beyond requirements

This will definitely impress the company! 🌟
