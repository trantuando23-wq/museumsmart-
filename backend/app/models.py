from sqlalchemy import Column, Integer, String, Text, Boolean, Float, JSON
from app.db import Base


class Artifact(Base):
    __tablename__ = "artifacts"

    id = Column(Integer, primary_key=True, index=True)
    code = Column(String(50), unique=True, index=True)
    name = Column(String(255), index=True, nullable=False)
    description = Column(Text, nullable=False)
    detailed_story = Column(Text, nullable=True)
    era = Column(String(100), nullable=False)
    year = Column(Integer, nullable=False)
    category = Column(String(100), index=True, nullable=False)
    location = Column(String(255), nullable=False)
    room_code = Column(String(50), index=True, nullable=False)
    node_id = Column(String(50), nullable=False)
    material = Column(String(255), nullable=True)
    dimensions = Column(String(255), nullable=True)
    image_url = Column(String(500), nullable=False)
    is_featured = Column(Boolean, default=False)
    suggested_questions = Column(JSON, default=list)
    model_type = Column(String(50), default="generic")


class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(Integer, primary_key=True, index=True)
    artifact_code = Column(String(50), index=True, nullable=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    keywords = Column(String(500), nullable=True)
    category = Column(String(100), nullable=True)
