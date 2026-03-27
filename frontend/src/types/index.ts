export type UserRole = "doctor" | "admin";

export interface User {
  id: number;
  email: string;
  name: string;
  role: UserRole;
  created_at: string;
}

export type Gender = "male" | "female" | "other";

export interface Patient {
  id: number;
  name: string;
  date_of_birth: string;
  gender: Gender;
  email?: string;
  phone?: string;
  medical_history?: Record<string, unknown>;
  notes?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface PatientCreate {
  name: string;
  date_of_birth: string;
  gender: Gender;
  email?: string;
  phone?: string;
  medical_history?: Record<string, unknown>;
  notes?: string;
}

export interface PatientList {
  items: Patient[];
  total: number;
  page: number;
  page_size: number;
}

export type AssessmentStatus = "pending" | "processing" | "completed" | "failed";

export interface Symptoms {
  memory_issues: boolean;
  tremors: boolean;
  balance_problems: boolean;
  speech_difficulties: boolean;
  muscle_weakness: boolean;
  cognitive_decline: boolean;
  mood_changes: boolean;
  sleep_disturbances: boolean;
  additional_notes?: string;
}

export interface Assessment {
  id: number;
  patient_id: number;
  symptoms?: Symptoms;
  uploaded_files?: Record<string, unknown>;
  alzheimer_risk?: number;
  parkinson_risk?: number;
  als_risk?: number;
  status: AssessmentStatus;
  notes?: string;
  created_at: string;
  completed_at?: string;
}

export interface AssessmentCreate {
  patient_id: number;
  symptoms?: Symptoms;
  uploaded_files?: Record<string, unknown>;
  notes?: string;
}

export interface AssessmentList {
  items: Assessment[];
  total: number;
  page: number;
  page_size: number;
}

export interface PredictionResult {
  alzheimer_risk: number;
  parkinson_risk: number;
  als_risk: number;
  confidence: number;
  risk_level: "low" | "moderate" | "high";
  recommendations: string[];
}
