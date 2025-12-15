# 📋 Employee Directory Search System - Setup Guide

## Project Overview
A full-stack Employee Directory application with optimized search functionality built with:
- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Python + FastAPI
- **Database**: MySQL 8.0

---

## 🚀 Quick Start Guide

### Prerequisites
Before you begin, ensure you have installed:
- **Node.js** 18+ ([Download](https://nodejs.org/))
- **Python** 3.9+ ([Download](https://www.python.org/downloads/))
- **MySQL** 8.0+ ([Download](https://dev.mysql.com/downloads/mysql/))
- **Git** ([Download](https://git-scm.com/downloads))

### Verify Installations
```bash
node --version    # Should be v18.0.0 or higher
python --version  # Should be 3.9.0 or higher
mysql --version   # Should be 8.0.0 or higher
```

---

## 📦 Installation Steps

### Step 1: Clone the Repository
```bash
git clone <your-github-repository-url>
cd employee-directory-search
```

### Step 2: Database Setup

#### 2.1 Start MySQL Server
```bash
# On macOS (using Homebrew)
brew services start mysql

# On Linux
sudo systemctl start mysql

# On Windows
# Start MySQL from Services or MySQL Workbench
```

#### 2.2 Create Database and User
```bash
# Login to MySQL
mysql -u root -p
# Enter your MySQL root password
```

```sql
-- Create database
CREATE DATABASE employee_directory;

-- Create dedicated user (recommended for security)
CREATE USER 'emp_user'@'localhost' IDENTIFIED BY 'emp_password_123';

-- Grant privileges
GRANT ALL PRIVILEGES ON employee_directory.* TO 'emp_user'@'localhost';
FLUSH PRIVILEGES;

-- Verify
SHOW DATABASES;
EXIT;
```

### Step 3: Backend Setup

#### 3.1 Navigate to Backend Directory
```bash
cd backend
```

#### 3.2 Create Virtual Environment
```bash
# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate

# You should see (venv) in your terminal prompt
```

#### 3.3 Install Dependencies
```bash
pip install --upgrade pip
pip install -r requirements.txt
```

#### 3.4 Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env

# Edit .env file with your credentials
# Use nano, vim, or any text editor
nano .env
```

Update `.env` with your database credentials:
```env
DATABASE_URL=mysql+pymysql://emp_user:emp_password_123@localhost:3306/employee_directory
CORS_ORIGINS=http://localhost:5173
```

#### 3.5 Initialize Database Tables
```bash
python init_db.py
```

Expected output:
```
INFO:__main__:Creating database tables...
INFO:__main__:✓ Database tables created successfully!
INFO:__main__:✓ Indexes created for optimized search performance
```

#### 3.6 Seed Sample Data (Optional)
```bash
# Add 50 sample employees
python seed_data.py

# Or specify custom count
python seed_data.py 100
```

#### 3.7 Start Backend Server
```bash
uvicorn main:app --reload --port 8000
```

Expected output:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Keep this terminal running!**

Test backend:
- API Docs: http://localhost:8000/docs
- Health Check: http://localhost:8000/health

### Step 4: Frontend Setup

#### 4.1 Open New Terminal
Open a **new terminal window/tab** (keep backend running in the first one)

```bash
# Navigate to frontend directory from project root
cd frontend
```

#### 4.2 Install Dependencies
```bash
npm install
```

This will install:
- React 18
- TypeScript
- Vite
- All required dependencies

#### 4.3 Configure Environment Variables
```bash
# Copy example env file
cp .env.example .env
```

The default `.env` should work:
```env
VITE_API_BASE_URL=http://localhost:8000
```

#### 4.4 Start Development Server
```bash
npm run dev
```

Expected output:
```
  VITE v5.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

#### 4.5 Open Application
Open your browser and navigate to:
```
http://localhost:5173
```

You should see the **Employee Directory** application!

---

## ✅ Verification Checklist

### Backend is Running ✓
- [ ] Terminal shows "Application startup complete"
- [ ] http://localhost:8000/health returns status "healthy"
- [ ] http://localhost:8000/docs shows API documentation

### Frontend is Running ✓
- [ ] Terminal shows "ready in XXX ms"
- [ ] http://localhost:5173 displays the application
- [ ] Search bar is visible and responsive

### Database Connection ✓
- [ ] Backend logs show no database errors
- [ ] Health endpoint shows "database": "connected"
- [ ] Sample employees appear in the application

---

## 🔧 Troubleshooting

### Problem: "Connection refused" to MySQL
**Solution:**
```bash
# Check if MySQL is running
# macOS
brew services list

# Linux
sudo systemctl status mysql

# Start MySQL if not running
brew services start mysql  # macOS
sudo systemctl start mysql # Linux
```

### Problem: "Access denied for user"
**Solution:**
```bash
# Verify MySQL credentials
mysql -u emp_user -p
# Enter: emp_password_123

# If fails, recreate user
mysql -u root -p
DROP USER 'emp_user'@'localhost';
CREATE USER 'emp_user'@'localhost' IDENTIFIED BY 'emp_password_123';
GRANT ALL PRIVILEGES ON employee_directory.* TO 'emp_user'@'localhost';
FLUSH PRIVILEGES;
```

### Problem: Port 8000 already in use
**Solution:**
```bash
# Find process using port 8000
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Kill process
kill -9 <PID>  # macOS/Linux

# Or use different port
uvicorn main:app --reload --port 8001
# Update frontend .env: VITE_API_BASE_URL=http://localhost:8001
```

### Problem: Port 5173 already in use
**Solution:**
```bash
# Vite will automatically use next available port
# Or specify custom port
npm run dev -- --port 3000
```

### Problem: "Module not found" errors
**Solution:**
```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

### Problem: No employees showing
**Solution:**
```bash
# Check backend is running and accessible
curl http://localhost:8000/health

# Seed database with sample data
cd backend
source venv/bin/activate  # if not already activated
python seed_data.py

# Check browser console for errors
# Open DevTools (F12) > Console tab
```

---

## 🧪 Testing the Application

### 1. Test Search Functionality
- Type "Eng" in search bar
- Wait 300ms (debounce delay)
- Should see employees from Engineering department

### 2. Test Debouncing
- Open browser DevTools (F12) > Network tab
- Type "Rahul" character by character
- Should see only ONE API request (after you stop typing)

### 3. Test Empty State
- Clear search bar
- Should see all employees or empty message

### 4. Test Error Handling
- Stop backend server
- Try searching
- Should see error message with retry option

---

## 📊 Project Structure

```
employee-directory-search/
├── backend/
│   ├── main.py                 # FastAPI app entry
│   ├── config.py               # Configuration
│   ├── database.py             # DB connection
│   ├── models.py               # SQLAlchemy models
│   ├── schemas.py              # Pydantic schemas
│   ├── init_db.py              # Database initialization
│   ├── seed_data.py            # Sample data seeding
│   ├── routers/
│   │   └── employees.py        # API routes
│   ├── services/
│   │   └── employee_service.py # Business logic
│   ├── repositories/
│   │   └── employee_repository.py # Data access
│   ├── requirements.txt        # Python dependencies
│   ├── .env.example            # Environment template
│   └── .env                    # Your configuration
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── SearchBar.tsx
│   │   │   ├── EmployeeCard.tsx
│   │   │   └── EmployeeList.tsx
│   │   ├── services/
│   │   │   └── api.ts          # API client
│   │   ├── hooks/
│   │   │   └── useDebounce.ts  # Custom hook
│   │   ├── types/
│   │   │   └── employee.ts     # TypeScript types
│   │   ├── App.tsx             # Main component
│   │   └── main.tsx            # Entry point
│   ├── package.json            # Node dependencies
│   ├── .env.example            # Environment template
│   └── .env                    # Your configuration
│
└── README.md                   # Project documentation
```

---

## 🔑 Key Features Implemented

### Frontend ✨
- ✅ **Debounced Search** - 300ms delay prevents excessive API calls
- ✅ **Request Cancellation** - Pending requests cancelled on new search
- ✅ **State Management** - Loading, error, empty, success states
- ✅ **Reusable Components** - SearchBar, EmployeeCard, EmployeeList
- ✅ **Environment Variables** - No hardcoded URLs
- ✅ **TypeScript** - Full type safety
- ✅ **Responsive Design** - Mobile-friendly UI

### Backend ⚡
- ✅ **Clean Architecture** - Routers, Services, Repositories
- ✅ **Database Indexing** - Optimized search performance
- ✅ **Connection Pooling** - Efficient database connections
- ✅ **Input Validation** - Pydantic schemas
- ✅ **Error Handling** - Proper HTTP status codes
- ✅ **API Documentation** - Auto-generated OpenAPI docs
- ✅ **CORS Configuration** - Secure cross-origin requests

---

## 🌐 API Endpoints

### GET /api/employees
Search employees with pagination

**Query Parameters:**
- `search` (optional): Search term for name/department
- `limit` (optional, default: 50): Results per page
- `offset` (optional, default: 0): Pagination offset

**Example:**
```bash
curl "http://localhost:8000/api/employees?search=eng&limit=10"
```

**Response:**
```json
{
  "employees": [
    {
      "id": 1,
      "name": "Rahul Kumar",
      "email": "rahul.kumar@company.com",
      "department": "Engineering",
      "designation": "Senior Developer",
      "date_of_joining": "2022-01-15"
    }
  ],
  "total": 1,
  "limit": 10,
  "offset": 0
}
```

### GET /health
Health check endpoint

**Response:**
```json
{
  "status": "healthy",
  "database": "connected"
}
```

---

## 🚢 Building for Production

### Backend
```bash
cd backend
pip install -r requirements.txt

# Run with production settings
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend
```bash
cd frontend
npm run build

# Output will be in dist/ folder
# Serve with any static file server
npx serve -s dist
```

---

## 🐛 Common Issues

### Issue: TypeScript errors in VS Code
**Solution:** Reload VS Code window
```
Cmd+Shift+P (macOS) or Ctrl+Shift+P (Windows)
Type: "Reload Window"
```

### Issue: Hot Module Replacement not working
**Solution:** Restart Vite dev server
```bash
# Stop server (Ctrl+C)
npm run dev
```

### Issue: Database migrations needed
**Solution:** Drop and recreate tables
```bash
cd backend
python init_db.py
python seed_data.py
```

---

## 📝 Environment Variables Reference

### Backend (.env)
```env
# Required
DATABASE_URL=mysql+pymysql://username:password@host:port/database

# Optional
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Frontend (.env)
```env
# Required
VITE_API_BASE_URL=http://localhost:8000
```

---

## 🎯 Next Steps

Once everything is running:

1. **Test Search** - Try searching for employees
2. **Check Performance** - Monitor network tab for debouncing
3. **Explore API Docs** - Visit http://localhost:8000/docs
4. **Review Code** - Check component structure
5. **Read README** - Full project documentation

---

## 📞 Support

If you encounter issues:
1. Check this setup guide
2. Review troubleshooting section
3. Check backend logs for errors
4. Check browser console for frontend errors
5. Verify all prerequisites are installed

---

## ✨ Success!

If you see the Employee Directory application with searchable employees, **congratulations!** 🎉

You've successfully set up a full-stack application with:
- ✅ React frontend with optimized search
- ✅ FastAPI backend with clean architecture
- ✅ MySQL database with proper indexing
- ✅ Complete development environment

Happy coding! 🚀
