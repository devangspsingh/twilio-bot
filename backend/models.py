import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

from dotenv import load_dotenv
load_dotenv(".env.local")

# --- Configuration ---
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./test.db")

# --- Database Setup ---
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    contact_number = Column(String, index=True)
    user_name = Column(String)
    product_name = Column(String)
    product_review = Column(Text)
    status = Column(String, default="pending")  # New status column
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables (Run this once or use Alembic in production)
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
