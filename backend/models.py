from sqlalchemy import Column, Integer, String, Date, Index
from database import Base


class Employee(Base):
    """
    Employee ORM model representing the employees table.
    
    Indexes:
    - idx_name: For fast name searches
    - idx_department: For fast department searches
    - idx_name_department: Composite index for searches on both fields
    """
    __tablename__ = "employees"
    
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False, index=True)
    department = Column(String(100), nullable=False)
    designation = Column(String(100), nullable=False)
    date_of_joining = Column(Date, nullable=False)
    
    # Define indexes for optimized search performance
    __table_args__ = (
        Index('idx_name', 'name'),
        Index('idx_department', 'department'),
        Index('idx_name_department', 'name', 'department'),
    )
    
    def to_dict(self):
        """Convert model instance to dictionary."""
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "department": self.department,
            "designation": self.designation,
            "date_of_joining": self.date_of_joining.isoformat() if self.date_of_joining else None
        }
