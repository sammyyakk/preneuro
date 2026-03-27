from pydantic import BaseModel, EmailStr
from datetime import datetime
from app.models.user import UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str
    role: UserRole = UserRole.DOCTOR


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    name: str | None = None
    role: UserRole | None = None


class UserRead(UserBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True
