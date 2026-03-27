from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from sqlalchemy.orm import selectinload
from datetime import datetime
from app.database import get_db
from app.models.assessment import Assessment, AssessmentStatus
from app.models.patient import Patient
from app.schemas.assessment import AssessmentCreate, AssessmentRead, AssessmentUpdate, AssessmentList, PredictionResult
from app.api.routes.users import get_current_user
from app.ml.predictor import predict_risks

router = APIRouter()


@router.get("", response_model=AssessmentList)
async def list_assessments(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    patient_id: int | None = None,
    status: AssessmentStatus | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List assessments with pagination and filters."""
    # Join with patient to filter by created_by
    query = (
        select(Assessment)
        .join(Patient)
        .where(Patient.created_by == current_user["id"])
    )

    if patient_id:
        query = query.where(Assessment.patient_id == patient_id)
    if status:
        query = query.where(Assessment.status == status)

    query = query.order_by(Assessment.created_at.desc())

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Get paginated results
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    assessments = result.scalars().all()

    return AssessmentList(
        items=assessments,
        total=total or 0,
        page=page,
        page_size=page_size,
    )


@router.get("/{assessment_id}", response_model=AssessmentRead)
async def get_assessment(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get a specific assessment."""
    result = await db.execute(
        select(Assessment)
        .join(Patient)
        .where(
            Assessment.id == assessment_id,
            Patient.created_by == current_user["id"],
        )
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    return assessment


@router.post("", response_model=AssessmentRead)
async def create_assessment(
    assessment_in: AssessmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new assessment."""
    # Verify patient belongs to current user
    result = await db.execute(
        select(Patient).where(
            Patient.id == assessment_in.patient_id,
            Patient.created_by == current_user["id"],
        )
    )
    if not result.scalar_one_or_none():
        raise HTTPException(status_code=404, detail="Patient not found")

    symptoms_dict = None
    if assessment_in.symptoms:
        symptoms_dict = assessment_in.symptoms.model_dump()

    assessment = Assessment(
        patient_id=assessment_in.patient_id,
        symptoms=symptoms_dict,
        uploaded_files=assessment_in.uploaded_files,
        notes=assessment_in.notes,
        status=AssessmentStatus.PENDING,
    )
    db.add(assessment)
    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.put("/{assessment_id}", response_model=AssessmentRead)
async def update_assessment(
    assessment_id: int,
    assessment_in: AssessmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update an assessment."""
    result = await db.execute(
        select(Assessment)
        .join(Patient)
        .where(
            Assessment.id == assessment_id,
            Patient.created_by == current_user["id"],
        )
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    if assessment.status == AssessmentStatus.COMPLETED:
        raise HTTPException(status_code=400, detail="Cannot modify completed assessment")

    update_data = assessment_in.model_dump(exclude_unset=True)
    if "symptoms" in update_data and update_data["symptoms"]:
        update_data["symptoms"] = update_data["symptoms"].model_dump()

    for field, value in update_data.items():
        setattr(assessment, field, value)

    await db.commit()
    await db.refresh(assessment)
    return assessment


@router.post("/{assessment_id}/predict", response_model=PredictionResult)
async def run_prediction(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Run AI prediction on an assessment."""
    result = await db.execute(
        select(Assessment)
        .join(Patient)
        .where(
            Assessment.id == assessment_id,
            Patient.created_by == current_user["id"],
        )
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Update status to processing
    assessment.status = AssessmentStatus.PROCESSING
    await db.commit()

    # Run mock prediction
    prediction = predict_risks(assessment.symptoms, assessment.uploaded_files)

    # Update assessment with results
    assessment.alzheimer_risk = prediction.alzheimer_risk
    assessment.parkinson_risk = prediction.parkinson_risk
    assessment.als_risk = prediction.als_risk
    assessment.status = AssessmentStatus.COMPLETED
    assessment.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(assessment)

    return prediction


@router.delete("/{assessment_id}")
async def delete_assessment(
    assessment_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete an assessment."""
    result = await db.execute(
        select(Assessment)
        .join(Patient)
        .where(
            Assessment.id == assessment_id,
            Patient.created_by == current_user["id"],
        )
    )
    assessment = result.scalar_one_or_none()

    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    await db.delete(assessment)
    await db.commit()
    return {"message": "Assessment deleted successfully"}
