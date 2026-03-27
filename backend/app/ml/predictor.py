"""
Mock ML Prediction Service

This module simulates AI predictions for neurodegenerative diseases.
In production, this would be replaced with actual trained models
(PyTorch/TensorFlow) processing MRI, EEG, and clinical data.
"""

import random
from typing import Any
from app.schemas.assessment import PredictionResult


# Symptom weights for mock prediction algorithm
SYMPTOM_WEIGHTS = {
    "alzheimer": {
        "memory_issues": 0.35,
        "cognitive_decline": 0.30,
        "mood_changes": 0.15,
        "speech_difficulties": 0.10,
        "sleep_disturbances": 0.10,
    },
    "parkinson": {
        "tremors": 0.35,
        "balance_problems": 0.25,
        "muscle_weakness": 0.15,
        "speech_difficulties": 0.15,
        "sleep_disturbances": 0.10,
    },
    "als": {
        "muscle_weakness": 0.40,
        "speech_difficulties": 0.25,
        "balance_problems": 0.15,
        "tremors": 0.10,
        "cognitive_decline": 0.10,
    },
}


def calculate_base_risk(symptoms: dict | None, disease: str) -> float:
    """Calculate base risk score from symptoms."""
    if not symptoms:
        # Return random low risk if no symptoms provided
        return random.uniform(0.05, 0.20)

    weights = SYMPTOM_WEIGHTS.get(disease, {})
    risk = 0.0

    for symptom, weight in weights.items():
        if symptoms.get(symptom, False):
            risk += weight

    # Add randomness to simulate model uncertainty
    noise = random.uniform(-0.10, 0.15)
    risk = max(0.0, min(1.0, risk + noise))

    return round(risk, 3)


def get_risk_level(risk: float) -> str:
    """Determine risk level category."""
    if risk < 0.3:
        return "low"
    elif risk < 0.6:
        return "moderate"
    else:
        return "high"


def get_recommendations(disease: str, risk_level: str) -> list[str]:
    """Generate recommendations based on disease and risk level."""
    base_recommendations = {
        "low": [
            "Continue routine health monitoring",
            "Maintain healthy lifestyle habits",
            "Schedule follow-up in 12 months",
        ],
        "moderate": [
            "Recommend comprehensive neurological evaluation",
            "Consider additional diagnostic imaging",
            "Schedule follow-up in 3-6 months",
            "Discuss family history and genetic factors",
        ],
        "high": [
            "Urgent referral to neurology specialist",
            "Comprehensive diagnostic workup recommended",
            "Consider advanced imaging (PET, detailed MRI)",
            "Genetic counseling may be beneficial",
            "Schedule immediate follow-up within 2-4 weeks",
        ],
    }

    disease_specific = {
        "alzheimer": {
            "moderate": ["Cognitive assessment (MMSE/MoCA) recommended"],
            "high": ["Evaluate for clinical trial eligibility"],
        },
        "parkinson": {
            "moderate": ["Movement disorder evaluation recommended"],
            "high": ["Consider DAT-SPECT imaging"],
        },
        "als": {
            "moderate": ["EMG/nerve conduction study may be helpful"],
            "high": ["Multidisciplinary ALS clinic referral"],
        },
    }

    recommendations = base_recommendations.get(risk_level, []).copy()
    if disease in disease_specific and risk_level in disease_specific[disease]:
        recommendations.extend(disease_specific[disease][risk_level])

    return recommendations


def predict_risks(
    symptoms: dict | None,
    uploaded_files: dict | None = None,
) -> PredictionResult:
    """
    Run mock prediction for all three diseases.

    In production, this would:
    1. Preprocess uploaded files (MRI, EEG, etc.)
    2. Extract features using specialized pipelines
    3. Run inference on trained models
    4. Aggregate and calibrate predictions
    """
    # Calculate risk for each disease
    alzheimer_risk = calculate_base_risk(symptoms, "alzheimer")
    parkinson_risk = calculate_base_risk(symptoms, "parkinson")
    als_risk = calculate_base_risk(symptoms, "als")

    # If files are provided, slightly increase confidence (mock)
    file_bonus = 0.05 if uploaded_files else 0.0

    # Overall confidence (higher with more data)
    symptom_count = sum(1 for v in (symptoms or {}).values() if v is True)
    confidence = min(0.95, 0.60 + (symptom_count * 0.05) + file_bonus)

    # Determine overall risk level from max risk
    max_risk = max(alzheimer_risk, parkinson_risk, als_risk)
    risk_level = get_risk_level(max_risk)

    # Get combined recommendations
    recommendations = []
    for disease, risk in [
        ("alzheimer", alzheimer_risk),
        ("parkinson", parkinson_risk),
        ("als", als_risk),
    ]:
        if risk >= 0.3:  # Only include if moderate+ risk
            disease_recs = get_recommendations(disease, get_risk_level(risk))
            recommendations.extend(disease_recs)

    # Deduplicate while preserving order
    seen = set()
    unique_recs = []
    for rec in recommendations:
        if rec not in seen:
            seen.add(rec)
            unique_recs.append(rec)

    if not unique_recs:
        unique_recs = get_recommendations("", "low")

    return PredictionResult(
        alzheimer_risk=alzheimer_risk,
        parkinson_risk=parkinson_risk,
        als_risk=als_risk,
        confidence=round(confidence, 2),
        risk_level=risk_level,
        recommendations=unique_recs[:5],  # Limit to top 5
    )


def predict_single_disease(
    disease: str,
    symptoms: dict | None,
    uploaded_files: dict | None = None,
) -> dict:
    """Run prediction for a single disease."""
    risk = calculate_base_risk(symptoms, disease)
    risk_level = get_risk_level(risk)

    symptom_count = sum(1 for v in (symptoms or {}).values() if v is True)
    file_bonus = 0.05 if uploaded_files else 0.0
    confidence = min(0.95, 0.65 + (symptom_count * 0.05) + file_bonus)

    return {
        "risk": risk,
        "confidence": round(confidence, 2),
        "risk_level": risk_level,
        "recommendations": get_recommendations(disease, risk_level),
    }
