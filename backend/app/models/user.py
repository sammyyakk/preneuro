from sqlalchemy import String, DateTime, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from datetime import datetime
import enum
from app.database import Base


class UserRole(str, enum.Enum):
    DOCTOR = "doctor"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    name: Mapped[str] = mapped_column(String(255))
    role: Mapped[UserRole] = mapped_column(SQLEnum(UserRole), default=UserRole.DOCTOR)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    patients: Mapped[list["Patient"]] = relationship(back_populates="created_by_user")
