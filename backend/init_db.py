"""
Database initialization script.
Creates all tables defined in models.py
"""
from database import engine, Base
from models import Employee
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def init_db():
    """Create all database tables."""
    try:
        logger.info("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        logger.info("✓ Database tables created successfully!")
        logger.info("✓ Indexes created for optimized search performance")
        return True
    except Exception as e:
        logger.error(f"✗ Failed to create database tables: {str(e)}")
        return False


if __name__ == "__main__":
    init_db()
