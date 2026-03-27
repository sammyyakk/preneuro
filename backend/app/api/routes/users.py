from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import get_db
from app.models.user import User, UserRole
from app.schemas.user import UserCreate, UserRead, UserUpdate

router = APIRouter()

# Mock current user for development
MOCK_USER = {
    "id": 1,
    "email": "doctor@preneuro.com",
    "name": "Dr. Sarah Chen",
    "role": UserRole.DOCTOR,
}


async def get_current_user():
    """Mock authentication - returns hardcoded user for development."""
    return MOCK_USER


@router.get("/me", response_model=UserRead)
async def get_current_user_info(
    db: AsyncSession = Depends(get_db),
):
    """Get current user info (mock auth)."""
    result = await db.execute(select(User).where(User.id == MOCK_USER["id"]))
    user = result.scalar_one_or_none()

    if not user:
        # Create mock user if doesn't exist
        user = User(**MOCK_USER)
        db.add(user)
        await db.commit()
        await db.refresh(user)

    return user


@router.get("", response_model=list[UserRead])
async def list_users(
    db: AsyncSession = Depends(get_db),
):
    """List all users (admin only in production)."""
    result = await db.execute(select(User))
    return result.scalars().all()


@router.post("", response_model=UserRead)
async def create_user(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db),
):
    """Create a new user."""
    result = await db.execute(select(User).where(User.email == user_in.email))
    if result.scalar_one_or_none():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(**user_in.model_dump())
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user
