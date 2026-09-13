"""
SQLAlchemy database models for Authentication and User Data Persistence.
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Float, ForeignKey, Text
from sqlalchemy.orm import relationship
from backend.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=True)  # Nullable for Google-only users
    google_sub = Column(String(255), unique=True, index=True, nullable=True)  # Google OAuth sub identifier
    auth_provider = Column(String(50), nullable=False, default="local")  # "local", "google", or "google_local"
    role = Column(String(100), nullable=False, default="Agronomist")
    farm_name = Column(String(255), nullable=False, default="AgriSmart Experimental Farm")
    location = Column(String(255), nullable=True, default="Greenhouse 4B, Sector 7")
    phone = Column(String(50), nullable=True, default="+91 98765 43210")
    bio = Column(Text, nullable=True, default="Agricultural AI evaluator testing computer vision foliar diagnostics.")
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    predictions = relationship("PredictionRecord", back_populates="user", cascade="all, delete-orphan")


class PredictionRecord(Base):
    __tablename__ = "prediction_records"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop = Column(String(100), nullable=False)
    prediction = Column(String(255), nullable=False)
    pathogen = Column(String(255), nullable=True)
    severity = Column(String(50), nullable=True)
    confidence = Column(Float, nullable=False)
    is_placeholder = Column(Boolean, default=False, nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="predictions")
