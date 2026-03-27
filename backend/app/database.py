from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import get_settings

settings = get_settings()

engine = create_async_engine(settings.database_url, echo=True)
async_session = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with async_session() as session:
        try:
            yield session
        finally:
            await session.close()


async def init_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    # Seed mock user for development
    from sqlalchemy import select
    from app.models.user import User

    async with async_session() as session:
        result = await session.execute(select(User).where(User.id == 1))
        existing_user = result.scalar_one_or_none()

        if not existing_user:
            mock_user = User(
                id=1,
                email="doctor@preneuro.com",
                name="Dr. Sarah Chen",
                role="DOCTOR"
            )
            session.add(mock_user)
            await session.commit()
