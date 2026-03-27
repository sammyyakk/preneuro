from pydantic import BaseModel, EmailStr
from datetime import datetime, date
from typing import Any
from app.models.patient import Gender


class PatientBase(BaseModel):
    name: str
    date_of_birth: date
    gender: Gender
    email: EmailStr | None = None
    phone: str | None = None
    medical_history: dict[str, Any] | None = None
    notes: str | None = None


class PatientCreate(PatientBase):
    pass


class PatientUpdate(BaseModel):
    name: str | None = None
    date_of_birth: date | None = None
    gender: Gender | None = None
    email: EmailStr | None = None
    phone: str | None = None
    medical_history: dict[str, Any] | None = None
    notes: str | None = None


class PatientRead(PatientBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class PatientList(BaseModel):
    items: list[PatientRead]
    total: int
    page: int
    page_size: int
