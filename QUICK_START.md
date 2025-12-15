# 🚀 Quick Start Guide

## Running the Application

You need to run **BOTH backend and frontend** in **separate terminals**.

### Option 1: Using Helper Scripts (Easiest)

#### Terminal 1 - Start Backend
```bash
chmod +x start-backend.sh
./start-backend.sh
```

#### Terminal 2 - Start Frontend
```bash
chmod +x start-frontend.sh
./start-frontend.sh
```

### Option 2: Manual Commands

#### Terminal 1 - Start Backend (Python/FastAPI)
```bash
cd backend
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate   # On Windows
uvicorn main:app --reload --port 8000
```

Backend runs at: **http://localhost:8000**

#### Terminal 2 - Start Frontend (React/Vite)
```bash
cd frontend
npm run dev
```

Frontend runs at: **http://localhost:5173**

## Important Notes

- ⚠️ **Backend is Python** (not Node.js) - use `uvicorn`, not `npm`
- ⚠️ **Frontend is React** - use `npm run dev` (not `npm start`)
- ⚠️ **Both must run simultaneously** for the app to work
- ⚠️ Keep both terminals running while using the application

## First Time Setup

If this is your first time running:

1. **Setup Backend**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   cp .env.example .env
   # Edit .env with your MySQL credentials
   python init_db.py
   python seed_data.py
   ```

2. **Setup Frontend**
   ```bash
   cd frontend
   npm install
   cp .env.example .env
   ```

3. **Start MySQL**
   ```bash
   # Create database first
   mysql -u root -p
   CREATE DATABASE employee_directory;
   EXIT;
   ```

## Stopping the Application

Press `Ctrl+C` in each terminal to stop the servers.

## Quick Reference

| Component | Directory | Command | URL |
|-----------|-----------|---------|-----|
| Backend | `backend/` | `uvicorn main:app --reload` | http://localhost:8000 |
| Frontend | `frontend/` | `npm run dev` | http://localhost:5173 |
| API Docs | - | - | http://localhost:8000/docs |

## Troubleshooting

**Q: Can I run both with one command?**  
A: Not by default. Backend is Python, frontend is Node.js. They need separate processes.

**Q: Frontend shows "Failed to fetch"?**  
A: Make sure backend is running first at http://localhost:8000

**Q: Port already in use?**  
A: Kill existing process or use different port:
```bash
# Backend different port
uvicorn main:app --reload --port 8001

# Frontend will auto-select next port
npm run dev
```

For detailed setup instructions, see [SETUP_GUIDE.md](SETUP_GUIDE.md)
