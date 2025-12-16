# Employee Directory Search System

A full-stack application for searching and viewing employee information with optimized search performance.

## Live Demo

- **Frontend:** https://employee-directory-nine-wheat.vercel.app
- **Backend:** https://employee-directory-tf4x.onrender.com
- **Repository:** https://github.com/Muskaan786/Employee-Directory

---

## Quick Start - Running Locally

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.9+
- **MySQL** 8.0+

### Step 1: Clone the Repository

```bash
git clone https://github.com/Muskaan786/Employee-Directory.git
cd Employee-Directory
```

### Step 2: Setup MySQL Database

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE employee_directory;
EXIT;
```

### Step 3: Setup and Run Backend

```bash
# Navigate to backend folder
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
source venv/bin/activate  # On macOS/Linux
# venv\Scripts\activate   # On Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
echo "DATABASE_URL=mysql+pymysql://root@localhost:3306/employee_directory" > .env
echo "CORS_ORIGINS=http://localhost:5173" >> .env

# Initialize database (creates tables)
python init_db.py

# Seed sample data (50 employees)
python seed_data.py

# Start backend server
uvicorn main:app --reload
```

**Backend is now running at:** http://localhost:8000  
**API Docs:** http://localhost:8000/docs

### Step 4: Setup and Run Frontend

Open a **new terminal** window:

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Create .env file
echo "VITE_API_BASE_URL=http://localhost:8000" > .env

# Start frontend development server
npm run dev
```

**Frontend is now running at:** http://localhost:5173

### Access the Application

Open your browser and navigate to http://localhost:5173

---

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Backend**: Python 3.9+ + FastAPI
- **Database**: MySQL 8.0

## Project Structure

```
.
├── frontend/          # React + Vite frontend application
├── backend/           # FastAPI backend application
├── README.md          # This file
└── .gitignore         # Git ignore file
```

## Database Design

### Why MySQL?

1. **Structured Data**: Employee data has a fixed schema, making relational databases ideal
2. **ACID Compliance**: Ensures data consistency and reliability
3. **Indexing**: MySQL's B-tree indexes enable fast text searches on name and department
4. **Scalability**: Handles millions of records efficiently with proper indexing
5. **Connection Pooling**: Supports multiple concurrent connections efficiently

### Database Schema

```sql
CREATE TABLE employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    department VARCHAR(100) NOT NULL,
    designation VARCHAR(100) NOT NULL,
    date_of_joining DATE NOT NULL,
    INDEX idx_name (name),
    INDEX idx_department (department),
    INDEX idx_name_department (name, department)
);
```

**Indexes Explanation**:
- `idx_name`: Speeds up searches by employee name
- `idx_department`: Speeds up searches by department
- `idx_name_department`: Composite index for searches involving both fields

## Search Performance Optimization

### Frontend Optimizations

1. **Debouncing**: Search API calls are debounced by 300ms to avoid excessive requests
2. **Request Cancellation**: Previous pending requests are cancelled when a new search is initiated
3. **Minimum Query Length**: API calls only trigger when search query is at least 2 characters
4. **Loading States**: Clear visual feedback during API requests

### Backend Optimizations

1. **Database Indexing**: Composite indexes on searchable columns
2. **Efficient Queries**: Uses `LIKE` with indexes or Full-Text Search for larger datasets
3. **Connection Pooling**: Reuses database connections instead of creating new ones
4. **Query Limits**: Prevents fetching excessive data with pagination support
5. **Prepared Statements**: Protects against SQL injection and improves performance

### Scalability Considerations

For very large datasets (100K+ employees), consider:
- Full-Text Search indexes in MySQL
- Elasticsearch for advanced search capabilities
- Redis caching for frequently searched terms
- Database read replicas for distributed load

## Setup Instructions

### Prerequisites

- Node.js 18+ and npm/yarn
- Python 3.9+
- MySQL 8.0+
- Git

## Common Commands

### Backend Commands

```bash
# Activate virtual environment
source backend/venv/bin/activate  # macOS/Linux
backend\venv\Scripts\activate     # Windows

# Run backend server
cd backend && uvicorn main:app --reload

# Initialize database
cd backend && python init_db.py

# Seed sample data
cd backend && python seed_data.py

# View API docs
# Open http://localhost:8000/docs
```

### Frontend Commands

```bash
# Run frontend dev server
cd frontend && npm run dev

# Build for production
cd frontend && npm run build

# Preview production build
cd frontend && npm run preview
```

### Convenience Scripts

For easier local development, use the provided scripts:

```bash
# Start backend (from project root)
./start-backend.sh

# Start frontend (from project root)
./start-frontend.sh
```

## API Endpoints

### Get Employees

```http
GET /api/employees?search=rahul&limit=50&offset=0
```

**Query Parameters**:
- `search` (optional): Search term for name or department
- `limit` (optional, default: 50): Maximum number of results
- `offset` (optional, default: 0): Pagination offset

**Response**:
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
  "limit": 50,
  "offset": 0
}
```

### Health Check

```http
GET /health
```

## Environment Variables

### Local Development

**Backend (.env)** - See `backend/.env.example`:

```env
DATABASE_URL=mysql+pymysql://username:password@localhost:3306/employee_directory
CORS_ORIGINS=http://localhost:5173
```

**Frontend (.env)** - See `frontend/.env.example`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Production Configuration

**Frontend (Vercel)**:
- Set in Vercel Dashboard → Settings → Environment Variables
- `VITE_API_BASE_URL=https://employee-directory-tf4x.onrender.com`

**Backend (Render)**:
- Set in Render Dashboard → Environment tab
- `DATABASE_URL=mysql+pymysql://user:password@yamabiko.proxy.rlwy.net:45576/railway`
- `CORS_ORIGINS=https://employee-directory-nine-wheat.vercel.app`

**Database (Railway)**:
- MySQL database hosted on Railway
- Connection string configured in Render backend

## Running Tests

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Building for Production

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm run build
# Output will be in dist/ folder
```

## Architecture

### Backend Architecture

```
backend/
├── main.py                 # FastAPI app entry point
├── config.py               # Configuration management
├── database.py             # Database connection and session management
├── models.py               # SQLAlchemy ORM models
├── routers/
│   └── employees.py        # Employee routes
├── services/
│   └── employee_service.py # Business logic
├── repositories/
│   └── employee_repository.py # Database operations
├── schemas.py              # Pydantic models for validation
└── init_db.py              # Database initialization
```

**Separation of Concerns**:
- **Routers**: Handle HTTP requests/responses, validation
- **Services**: Business logic, orchestration
- **Repositories**: Database queries, data access
- **Models**: Database schema definition
- **Schemas**: Request/response validation

### Frontend Architecture

```
frontend/
├── src/
│   ├── components/
│   │   ├── SearchBar.tsx       # Search input with debouncing
│   │   ├── EmployeeCard.tsx    # Individual employee display
│   │   └── EmployeeList.tsx    # List of employee cards
│   ├── services/
│   │   └── api.ts              # API client with error handling
│   ├── hooks/
│   │   └── useDebounce.ts      # Custom debounce hook
│   ├── types/
│   │   └── employee.ts         # TypeScript interfaces
│   ├── App.tsx                 # Main app component
│   └── main.tsx                # Entry point
```

**Component Design**:
- **Reusable Components**: Each component has a single responsibility
- **Props Pattern**: Data flows down via props
- **Custom Hooks**: Shared logic extracted into hooks
- **Type Safety**: Full TypeScript coverage

## Features Implemented

### Frontend ✅

- [x] Debounced search (300ms delay)
- [x] API state handling (loading, success, error, empty)
- [x] Reusable components (SearchBar, EmployeeCard, EmployeeList)
- [x] Environment variable configuration
- [x] Request cancellation for pending searches
- [x] Responsive design
- [x] TypeScript for type safety

### Backend ✅

- [x] MySQL database with proper schema
- [x] Indexed columns for fast search
- [x] Clean architecture (routers, services, repositories)
- [x] Input validation with Pydantic
- [x] Error handling with proper HTTP status codes
- [x] CORS configuration
- [x] Connection pooling
- [x] API documentation (OpenAPI/Swagger)

## Troubleshooting

### Database Connection Issues

```bash
# Test MySQL connection
mysql -u your_username -p

# Check if database exists
SHOW DATABASES;
```

### Port Already in Use

```bash
# Backend (port 8000)
lsof -ti:8000 | xargs kill -9

# Frontend (port 5173)
lsof -ti:5173 | xargs kill -9
```

### Module Not Found Errors

```bash
# Backend
cd backend
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is created as an assignment submission.

## Contact

For questions or issues, please open an issue on GitHub.

---

**Note**: This is a demonstration project. For production use, implement additional features like:
- Authentication and authorization
- Rate limiting
- Comprehensive logging
- Monitoring and alerting
- Automated testing
- CI/CD pipeline
- Database backups
- SSL/TLS encryption
