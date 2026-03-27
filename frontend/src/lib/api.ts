import {
  User,
  Patient,
  PatientCreate,
  PatientList,
  Assessment,
  AssessmentCreate,
  AssessmentList,
  PredictionResult,
} from "@/types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.detail || `API Error: ${response.status}`);
  }

  return response.json();
}

// Users API
export const usersApi = {
  getMe: () => fetchApi<User>("/users/me"),
  list: () => fetchApi<User[]>("/users"),
};

// Patients API
export const patientsApi = {
  list: (page = 1, pageSize = 10, search?: string) => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (search) params.set("search", search);
    return fetchApi<PatientList>(`/patients?${params}`);
  },

  get: (id: number) => fetchApi<Patient>(`/patients/${id}`),

  create: (data: PatientCreate) =>
    fetchApi<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  update: (id: number, data: Partial<PatientCreate>) =>
    fetchApi<Patient>(`/patients/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: (id: number) =>
    fetchApi<{ message: string }>(`/patients/${id}`, { method: "DELETE" }),
};

// Assessments API
export const assessmentsApi = {
  list: (page = 1, pageSize = 10, patientId?: number) => {
    const params = new URLSearchParams({
      page: String(page),
      page_size: String(pageSize),
    });
    if (patientId) params.set("patient_id", String(patientId));
    return fetchApi<AssessmentList>(`/assessments?${params}`);
  },

  get: (id: number) => fetchApi<Assessment>(`/assessments/${id}`),

  create: (data: AssessmentCreate) =>
    fetchApi<Assessment>("/assessments", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  predict: (id: number) =>
    fetchApi<PredictionResult>(`/assessments/${id}/predict`, {
      method: "POST",
    }),

  delete: (id: number) =>
    fetchApi<{ message: string }>(`/assessments/${id}`, { method: "DELETE" }),
};

// Direct Predictions API
export const predictionsApi = {
  predictAll: (symptoms?: Record<string, boolean>) =>
    fetchApi<PredictionResult>("/predict/all", {
      method: "POST",
      body: JSON.stringify({ symptoms }),
    }),
};
