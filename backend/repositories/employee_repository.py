from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from models import Employee
from typing import List, Tuple, Optional


class EmployeeRepository:
    """
    Repository layer for employee database operations.
    Separates data access logic from business logic.
    """
    
    def __init__(self, db: Session):
        self.db = db
    
    def search_employees(
        self, 
        search_term: Optional[str] = None, 
        limit: int = 50, 
        offset: int = 0
    ) -> Tuple[List[Employee], int]:
        """
        Search employees by name or department with pagination.
        
        Args:
            search_term: Search query for name or department (case-insensitive)
            limit: Maximum number of results to return
            offset: Number of results to skip (for pagination)
            
        Returns:
            Tuple of (list of employees, total count)
            
        Performance:
        - Uses LIKE with indexes for fast searches
        - For very large datasets (100K+), consider Full-Text Search
        - Composite index on (name, department) optimizes OR queries
        """
        query = self.db.query(Employee)
        
        # Apply search filter if provided
        if search_term and search_term.strip():
            search_pattern = f"%{search_term.strip()}%"
            query = query.filter(
                or_(
                    Employee.name.ilike(search_pattern),
                    Employee.department.ilike(search_pattern)
                )
            )
        
        # Get total count before pagination
        total = query.count()
        
        # Apply pagination and ordering
        employees = query.order_by(Employee.name).limit(limit).offset(offset).all()
        
        return employees, total
    
    def get_employee_by_id(self, employee_id: int) -> Optional[Employee]:
        """Get a single employee by ID."""
        return self.db.query(Employee).filter(Employee.id == employee_id).first()
    
    def get_employee_by_email(self, email: str) -> Optional[Employee]:
        """Get a single employee by email."""
        return self.db.query(Employee).filter(Employee.email == email).first()
    
    def create_employee(self, employee_data: dict) -> Employee:
        """Create a new employee."""
        employee = Employee(**employee_data)
        self.db.add(employee)
        self.db.commit()
        self.db.refresh(employee)
        return employee
    
    def get_all_employees(self, limit: int = 100, offset: int = 0) -> Tuple[List[Employee], int]:
        """Get all employees with pagination."""
        query = self.db.query(Employee)
        total = query.count()
        employees = query.order_by(Employee.name).limit(limit).offset(offset).all()
        return employees, total
