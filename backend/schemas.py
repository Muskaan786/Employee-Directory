from pydantic import BaseModel, EmailStr, Field
from datetime import date
from typing import List, Optional


class EmployeeBase(BaseModel):
    """Base schema for employee data."""
    name: str = Field(..., min_length=1, max_length=100, description="Employee name")
    email: EmailStr = Field(..., description="Employee email address")
    department: str = Field(..., min_length=1, max_length=100, description="Department name")
    designation: str = Field(..., min_length=1, max_length=100, description="Job designation")
    date_of_joining: date = Field(..., description="Date of joining in YYYY-MM-DD format")


class EmployeeCreate(EmployeeBase):
    """Schema for creating a new employee."""
    pass


class EmployeeResponse(EmployeeBase):
    """Schema for employee response."""
    id: int
    
    class Config:
        from_attributes = True


class EmployeeListResponse(BaseModel):
    """Schema for paginated employee list response."""
    employees: List[EmployeeResponse]
    total: int = Field(..., description="Total number of employees matching the search")
    limit: int = Field(..., description="Number of results per page")
    offset: int = Field(..., description="Offset for pagination")


class ErrorResponse(BaseModel):
    """Schema for error responses."""
    detail: str = Field(..., description="Error message")
