from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from app.config import get_settings
from app.database import init_db
from app.api.routes import users, patients, assessments, predictions

settings = get_settings()


@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield


app = FastAPI(
    title="PreNeuro API",
    description="AI-powered predictive screening for neurodegenerative diseases",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(patients.router, prefix="/api/patients", tags=["patients"])
app.include_router(assessments.router, prefix="/api/assessments", tags=["assessments"])
app.include_router(predictions.router, prefix="/api/predict", tags=["predictions"])


@app.get("/api/health")
async def health_check():
    return {"status": "healthy"}
