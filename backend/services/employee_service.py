from sqlalchemy.orm import Session
from repositories.employee_repository import EmployeeRepository
from schemas import EmployeeCreate, EmployeeResponse
from typing import List, Optional
from fastapi import HTTPException, status


class EmployeeService:
    """
    Service layer for employee business logic.
    Orchestrates between API routes and data repositories.
    """
    
    def __init__(self, db: Session):
        self.repository = EmployeeRepository(db)
    
    def search_employees(
        self, 
        search: Optional[str] = None, 
        limit: int = 50, 
        offset: int = 0
    ) -> dict:
        """
        Search employees with validation and business logic.
        
        Args:
            search: Search term (optional)
            limit: Max results (1-100)
            offset: Pagination offset
            
        Returns:
            Dict with employees list, total count, limit, and offset
            
        Raises:
            HTTPException: If validation fails
        """
        # Validate pagination parameters
        if limit < 1 or limit > 100:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Limit must be between 1 and 100"
            )
        
        if offset < 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Offset must be non-negative"
            )
        
        # Validate search term length if provided
        if search is not None and len(search.strip()) > 0:
            if len(search.strip()) < 2:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Search term must be at least 2 characters"
                )
            if len(search.strip()) > 100:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Search term must be less than 100 characters"
                )
        
        # Perform search
        try:
            employees, total = self.repository.search_employees(search, limit, offset)
            
            return {
                "employees": employees,
                "total": total,
                "limit": limit,
                "offset": offset
            }
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Database error: {str(e)}"
            )
    
    def get_employee_by_id(self, employee_id: int) -> EmployeeResponse:
        """Get employee by ID."""
        if employee_id < 1:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Invalid employee ID"
            )
        
        employee = self.repository.get_employee_by_id(employee_id)
        
        if not employee:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Employee with ID {employee_id} not found"
            )
        
        return employee
    
    def create_employee(self, employee_data: EmployeeCreate) -> EmployeeResponse:
        """Create a new employee."""
        # Check if email already exists
        existing_employee = self.repository.get_employee_by_email(employee_data.email)
        if existing_employee:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Employee with email {employee_data.email} already exists"
            )
        
        try:
            employee = self.repository.create_employee(employee_data.model_dump())
            return employee
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create employee: {str(e)}"
            )
