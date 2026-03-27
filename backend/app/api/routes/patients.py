from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.database import get_db
from app.models.patient import Patient
from app.schemas.patient import PatientCreate, PatientRead, PatientUpdate, PatientList
from app.api.routes.users import get_current_user

router = APIRouter()


@router.get("", response_model=PatientList)
async def list_patients(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=100),
    search: str | None = None,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """List patients with pagination and search."""
    query = select(Patient).where(Patient.created_by == current_user["id"])

    if search:
        query = query.where(Patient.name.ilike(f"%{search}%"))

    # Get total count
    count_query = select(func.count()).select_from(query.subquery())
    total = await db.scalar(count_query)

    # Get paginated results
    query = query.offset((page - 1) * page_size).limit(page_size)
    result = await db.execute(query)
    patients = result.scalars().all()

    return PatientList(
        items=patients,
        total=total or 0,
        page=page,
        page_size=page_size,
    )


@router.get("/{patient_id}", response_model=PatientRead)
async def get_patient(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Get a specific patient by ID."""
    result = await db.execute(
        select(Patient).where(
            Patient.id == patient_id,
            Patient.created_by == current_user["id"],
        )
    )
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    return patient


@router.post("", response_model=PatientRead)
async def create_patient(
    patient_in: PatientCreate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Create a new patient."""
    patient = Patient(
        **patient_in.model_dump(),
        created_by=current_user["id"],
    )
    db.add(patient)
    await db.commit()
    await db.refresh(patient)
    return patient


@router.put("/{patient_id}", response_model=PatientRead)
async def update_patient(
    patient_id: int,
    patient_in: PatientUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Update a patient."""
    result = await db.execute(
        select(Patient).where(
            Patient.id == patient_id,
            Patient.created_by == current_user["id"],
        )
    )
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    update_data = patient_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(patient, field, value)

    await db.commit()
    await db.refresh(patient)
    return patient


@router.delete("/{patient_id}")
async def delete_patient(
    patient_id: int,
    db: AsyncSession = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Delete a patient."""
    result = await db.execute(
        select(Patient).where(
            Patient.id == patient_id,
            Patient.created_by == current_user["id"],
        )
    )
    patient = result.scalar_one_or_none()

    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")

    await db.delete(patient)
    await db.commit()
    return {"message": "Patient deleted successfully"}
