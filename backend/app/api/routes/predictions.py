from fastapi import APIRouter
from pydantic import BaseModel
from app.ml.predictor import predict_risks, predict_single_disease
from app.schemas.assessment import PredictionResult, SymptomsInput

router = APIRouter()


class PredictionInput(BaseModel):
    symptoms: SymptomsInput | None = None
    uploaded_files: dict | None = None


class SingleDiseaseResult(BaseModel):
    risk: float
    confidence: float
    risk_level: str
    recommendations: list[str]


@router.post("/all", response_model=PredictionResult)
async def predict_all_diseases(data: PredictionInput):
    """Run prediction for all three diseases."""
    symptoms_dict = data.symptoms.model_dump() if data.symptoms else None
    return predict_risks(symptoms_dict, data.uploaded_files)


@router.post("/alzheimer", response_model=SingleDiseaseResult)
async def predict_alzheimer(data: PredictionInput):
    """Run Alzheimer's disease prediction."""
    symptoms_dict = data.symptoms.model_dump() if data.symptoms else None
    return predict_single_disease("alzheimer", symptoms_dict, data.uploaded_files)


@router.post("/parkinson", response_model=SingleDiseaseResult)
async def predict_parkinson(data: PredictionInput):
    """Run Parkinson's disease prediction."""
    symptoms_dict = data.symptoms.model_dump() if data.symptoms else None
    return predict_single_disease("parkinson", symptoms_dict, data.uploaded_files)


@router.post("/als", response_model=SingleDiseaseResult)
async def predict_als(data: PredictionInput):
    """Run ALS prediction."""
    symptoms_dict = data.symptoms.model_dump() if data.symptoms else None
    return predict_single_disease("als", symptoms_dict, data.uploaded_files)
