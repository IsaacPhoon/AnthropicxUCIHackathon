"""Response model."""
from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.core.database import Base


class Response(Base):
    """User response to an interview question."""

    __tablename__ = "responses"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    question_id = Column(UUID(as_uuid=True), ForeignKey("questions.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    audio_path = Column(String, nullable=False)
    transcript = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    question = relationship("Question", back_populates="responses")
    user = relationship("User", back_populates="responses")
    score = relationship("ResponseScore", back_populates="response", uselist=False, cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Response(id={self.id}, question_id={self.question_id})>"
