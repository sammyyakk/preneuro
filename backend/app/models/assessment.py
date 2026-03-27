from sqlalchemy import String, DateTime, ForeignKey, Float, Enum as SQLEnum
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from app.database import Base


class AssessmentStatus(str, enum.Enum):
    PENDING = "pending"
    PROCESSING = "processing"
    COMPLETED = "completed"
    FAILED = "failed"


class Assessment(Base):
    __tablename__ = "assessments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    patient_id: Mapped[int] = mapped_column(ForeignKey("patients.id"))

    symptoms: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    uploaded_files: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    alzheimer_risk: Mapped[float | None] = mapped_column(Float, nullable=True)
    parkinson_risk: Mapped[float | None] = mapped_column(Float, nullable=True)
    als_risk: Mapped[float | None] = mapped_column(Float, nullable=True)

    status: Mapped[AssessmentStatus] = mapped_column(SQLEnum(AssessmentStatus), default=AssessmentStatus.PENDING)
    notes: Mapped[str | None] = mapped_column(String(1000), nullable=True)

    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    completed_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    patient: Mapped["Patient"] = relationship(back_populates="assessments")
