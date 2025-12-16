from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from routers import employees
from config import settings
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="Employee Directory API",
    description="API for searching and managing employee information",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


@app.on_event("startup")
async def startup_event():
    """Initialize database on startup."""
    try:
        from database import engine, Base, SessionLocal
        from models import Employee
        import random
        from datetime import date, timedelta
        
        logger.info("Initializing database...")
        
        # Create tables if they don't exist
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database tables ready")
        
        # Check if database has data
        db = SessionLocal()
        try:
            employee_count = db.query(Employee).count()
            
            if employee_count == 0:
                logger.info("No employees found. Seeding database with 50 sample employees...")
                
                # Sample data arrays
                first_names = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Neha", 
                              "Arjun", "Pooja", "Karan", "Divya", "Sanjay", "Riya", "Aditya", "Kavya",
                              "Rajesh", "Meera", "Suresh", "Ananya", "Nikhil", "Shreya", "Varun", "Ishita"]
                
                last_names = ["Kumar", "Sharma", "Singh", "Patel", "Gupta", "Reddy", "Rao", "Verma",
                             "Mehta", "Joshi", "Shah", "Desai", "Nair", "Iyer", "Agarwal", "Chopra"]
                
                departments = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", 
                              "Finance", "Operations", "Customer Success", "Data Science"]
                
                designations = {
                    "Engineering": ["Software Engineer", "Senior Software Engineer", "Tech Lead", "Engineering Manager"],
                    "Product": ["Product Manager", "Senior Product Manager", "Product Owner"],
                    "Design": ["UI/UX Designer", "Senior Designer", "Design Lead"],
                    "Marketing": ["Marketing Manager", "Content Writer", "SEO Specialist"],
                    "Sales": ["Sales Executive", "Account Manager", "Sales Manager"],
                    "HR": ["HR Manager", "HR Executive", "Recruiter"],
                    "Finance": ["Accountant", "Finance Manager", "Financial Analyst"],
                    "Operations": ["Operations Manager", "Operations Executive"],
                    "Customer Success": ["Customer Success Manager", "Support Engineer"],
                    "Data Science": ["Data Scientist", "Data Analyst", "ML Engineer"]
                }
                
                # Generate 50 employees
                employees_data = []
                used_emails = set()
                
                for i in range(50):
                    first_name = random.choice(first_names)
                    last_name = random.choice(last_names)
                    name = f"{first_name} {last_name}"
                    
                    # Generate unique email
                    email_base = f"{first_name.lower()}.{last_name.lower()}"
                    email = f"{email_base}@company.com"
                    counter = 1
                    while email in used_emails:
                        email = f"{email_base}{counter}@company.com"
                        counter += 1
                    used_emails.add(email)
                    
                    department = random.choice(departments)
                    designation = random.choice(designations[department])
                    
                    # Random date in the last 5 years
                    days_ago = random.randint(0, 365 * 5)
                    date_of_joining = date.today() - timedelta(days=days_ago)
                    
                    employees_data.append({
                        "name": name,
                        "email": email,
                        "department": department,
                        "designation": designation,
                        "date_of_joining": date_of_joining
                    })
                
                # Insert all employees
                for emp_data in employees_data:
                    employee = Employee(**emp_data)
                    db.add(employee)
                
                db.commit()
                logger.info(f"✓ Added {len(employees_data)} sample employees")
            else:
                logger.info(f"✓ Database already has {employee_count} employees")
                
        finally:
            db.close()
            
    except Exception as e:
        logger.error(f"Database initialization failed: {str(e)}")
        # Don't crash the app, just log the error

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(employees.router)


@app.get("/", tags=["root"])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Employee Directory API",
        "version": "1.0.0",
        "docs": "/docs",
        "health": "/health"
    }


@app.get("/health", tags=["health"])
async def health_check():
    """Health check endpoint."""
    try:
        # Try to import database to verify configuration
        from database import engine
        
        # Test database connection
        with engine.connect() as connection:
            connection.execute("SELECT 1")
        
        return {
            "status": "healthy",
            "database": "connected"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return JSONResponse(
            status_code=503,
            content={
                "status": "unhealthy",
                "database": "disconnected",
                "error": str(e)
            }
        )


@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """Custom HTTP exception handler."""
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )


@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """General exception handler for unexpected errors."""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected error occurred. Please try again later."}
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
