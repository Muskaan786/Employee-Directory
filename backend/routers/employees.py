from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from database import get_db
from services.employee_service import EmployeeService
from schemas import EmployeeListResponse, EmployeeResponse, EmployeeCreate, ErrorResponse

router = APIRouter(prefix="/api", tags=["employees"])


@router.get(
    "/employees",
    response_model=EmployeeListResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid request parameters"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Search Employees",
    description="""
    Search for employees by name or department with pagination support.
    
    - **search**: Optional search term (min 2 chars, searches name and department)
    - **limit**: Number of results per page (1-100, default: 50)
    - **offset**: Number of results to skip (default: 0)
    
    Returns a list of employees matching the search criteria with pagination metadata.
    """
)
async def search_employees(
    search: Optional[str] = Query(
        None, 
        description="Search term for name or department (case-insensitive)",
        min_length=2,
        max_length=100
    ),
    limit: int = Query(
        50, 
        ge=1, 
        le=100, 
        description="Maximum number of results to return"
    ),
    offset: int = Query(
        0, 
        ge=0, 
        description="Number of results to skip for pagination"
    ),
    db: Session = Depends(get_db)
):
    """
    Search employees endpoint.
    
    Performance optimizations:
    - Database indexes on name and department columns
    - Pagination to limit data transfer
    - Connection pooling for efficient database access
    """
    service = EmployeeService(db)
    return service.search_employees(search=search, limit=limit, offset=offset)


@router.get(
    "/employees/{employee_id}",
    response_model=EmployeeResponse,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid employee ID"},
        404: {"model": ErrorResponse, "description": "Employee not found"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Get Employee by ID",
    description="Retrieve a single employee by their ID."
)
async def get_employee(
    employee_id: int,
    db: Session = Depends(get_db)
):
    """Get employee by ID endpoint."""
    service = EmployeeService(db)
    return service.get_employee_by_id(employee_id)


@router.post(
    "/employees",
    response_model=EmployeeResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        400: {"model": ErrorResponse, "description": "Invalid employee data or duplicate email"},
        500: {"model": ErrorResponse, "description": "Internal server error"}
    },
    summary="Create Employee",
    description="Create a new employee. Email must be unique."
)
async def create_employee(
    employee: EmployeeCreate,
    db: Session = Depends(get_db)
):
    """Create employee endpoint."""
    service = EmployeeService(db)
    return service.create_employee(employee)
