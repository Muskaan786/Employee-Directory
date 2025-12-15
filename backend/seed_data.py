"""
Script to seed the database with sample employee data.
Run this after init_db.py to populate the database with test data.
"""
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from models import Employee, Base
from datetime import date, timedelta
import random
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Sample data
FIRST_NAMES = ["Rahul", "Priya", "Amit", "Sneha", "Vikram", "Anjali", "Rohan", "Neha", 
               "Arjun", "Pooja", "Karan", "Divya", "Sanjay", "Riya", "Aditya", "Kavya",
               "Rajesh", "Meera", "Suresh", "Ananya", "Nikhil", "Shreya", "Varun", "Ishita"]

LAST_NAMES = ["Kumar", "Sharma", "Singh", "Patel", "Gupta", "Reddy", "Rao", "Verma",
              "Mehta", "Joshi", "Shah", "Desai", "Nair", "Iyer", "Agarwal", "Chopra"]

DEPARTMENTS = ["Engineering", "Product", "Design", "Marketing", "Sales", "HR", 
               "Finance", "Operations", "Customer Success", "Data Science"]

DESIGNATIONS = {
    "Engineering": ["Software Engineer", "Senior Software Engineer", "Tech Lead", "Engineering Manager", "DevOps Engineer"],
    "Product": ["Product Manager", "Senior Product Manager", "Product Owner", "Associate Product Manager"],
    "Design": ["UI/UX Designer", "Senior Designer", "Design Lead", "Product Designer"],
    "Marketing": ["Marketing Manager", "Content Writer", "SEO Specialist", "Marketing Executive"],
    "Sales": ["Sales Executive", "Account Manager", "Sales Manager", "Business Development Manager"],
    "HR": ["HR Manager", "HR Executive", "Recruiter", "HR Business Partner"],
    "Finance": ["Accountant", "Finance Manager", "Financial Analyst", "CFO"],
    "Operations": ["Operations Manager", "Operations Executive", "Operations Lead"],
    "Customer Success": ["Customer Success Manager", "Support Engineer", "Customer Success Executive"],
    "Data Science": ["Data Scientist", "Data Analyst", "ML Engineer", "Data Engineer"]
}


def generate_sample_employees(count: int = 50) -> list:
    """Generate sample employee data."""
    employees = []
    used_emails = set()
    
    for i in range(count):
        first_name = random.choice(FIRST_NAMES)
        last_name = random.choice(LAST_NAMES)
        name = f"{first_name} {last_name}"
        
        # Generate unique email
        email_base = f"{first_name.lower()}.{last_name.lower()}"
        email = f"{email_base}@company.com"
        counter = 1
        while email in used_emails:
            email = f"{email_base}{counter}@restaverse.com"
            counter += 1
        used_emails.add(email)
        
        department = random.choice(DEPARTMENTS)
        designation = random.choice(DESIGNATIONS[department])
        
        # Random date in the last 5 years
        days_ago = random.randint(0, 365 * 5)
        date_of_joining = date.today() - timedelta(days=days_ago)
        
        employees.append({
            "name": name,
            "email": email,
            "department": department,
            "designation": designation,
            "date_of_joining": date_of_joining
        })
    
    return employees


def seed_database(count: int = 50):
    """Seed the database with sample data."""
    db = SessionLocal()
    
    try:
        # Check if data already exists
        existing_count = db.query(Employee).count()
        if existing_count > 0:
            logger.info(f"Database already has {existing_count} employees.")
            response = input("Do you want to add more sample data? (yes/no): ")
            if response.lower() != "yes":
                logger.info("Skipping data seeding.")
                return
        
        logger.info(f"Generating {count} sample employees...")
        employees_data = generate_sample_employees(count)
        
        logger.info("Inserting employees into database...")
        for emp_data in employees_data:
            employee = Employee(**emp_data)
            db.add(employee)
        
        db.commit()
        logger.info(f"✓ Successfully added {count} employees to the database!")
        
        # Show some stats
        total = db.query(Employee).count()
        departments = db.query(Employee.department).distinct().count()
        logger.info(f"✓ Total employees in database: {total}")
        logger.info(f"✓ Total departments: {departments}")
        
    except Exception as e:
        db.rollback()
        logger.error(f"✗ Failed to seed database: {str(e)}")
    finally:
        db.close()


if __name__ == "__main__":
    import sys
    
    count = 50
    if len(sys.argv) > 1:
        try:
            count = int(sys.argv[1])
        except ValueError:
            logger.warning(f"Invalid count argument. Using default: {count}")
    
    seed_database(count)
