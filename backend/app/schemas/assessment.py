from pydantic import BaseModel
from datetime import datetime
from typing import Any
from app.models.assessment import AssessmentStatus


class SymptomsInput(BaseModel):
    memory_issues: bool = False
    tremors: bool = False
    balance_problems: bool = False
    speech_difficulties: bool = False
    muscle_weakness: bool = False
    cognitive_decline: bool = False
    mood_changes: bool = False
    sleep_disturbances: bool = False
    additional_notes: str | None = None


class AssessmentBase(BaseModel):
    patient_id: int
    symptoms: SymptomsInput | None = None
    uploaded_files: dict[str, Any] | None = None
    notes: str | None = None


class AssessmentCreate(AssessmentBase):
    pass


class AssessmentUpdate(BaseModel):
    symptoms: SymptomsInput | None = None
    uploaded_files: dict[str, Any] | None = None
    notes: str | None = None


class AssessmentRead(BaseModel):
    id: int
    patient_id: int
    symptoms: dict[str, Any] | None
    uploaded_files: dict[str, Any] | None
    alzheimer_risk: float | None
    parkinson_risk: float | None
    als_risk: float | None
    status: AssessmentStatus
    notes: str | None
    created_at: datetime
    completed_at: datetime | None

    class Config:
        from_attributes = True


class AssessmentList(BaseModel):
    items: list[AssessmentRead]
    total: int
    page: int
    page_size: int


class PredictionResult(BaseModel):
    alzheimer_risk: float
    parkinson_risk: float
    als_risk: float
    confidence: float
    risk_level: str  # "low", "moderate", "high"
    recommendations: list[str]
