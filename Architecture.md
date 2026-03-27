# PreNeuro — System Architecture

## 1. High-Level Architecture

Frontend → API Gateway → Backend → ML Models → Database

---

## 2. System Components

### 2.1 Frontend (Next.js)
- Dashboard
- Upload interface
- Visualization

---

### 2.2 API Gateway
- Routes requests
- Handles auth
- Rate limiting

---

### 2.3 Backend (FastAPI)

Modules:
- User Service
- Patient Service
- Prediction Service
- Report Service

---

### 2.4 ML Layer

(as per page 4: "Parallel Analysis")

- Alzheimer Model
- Parkinson Model
- ALS Model

Each model runs independently → outputs merged

---

### 2.5 Data Pipeline

Input Sources:
- MRI / CT
- EEG
- Genetics
- Clinical data

Pipeline:
1. Data ingestion
2. Preprocessing
3. Feature extraction
4. Model inference

---

### 2.6 Database Layer

#### PostgreSQL
- Users
- Patients
- Reports

#### Object Storage
- MRI images
- EEG files

---

### 2.7 Model Serving

- REST API endpoints:
  - /predict/alzheimer
  - /predict/parkinson
  - /predict/als

- Combined endpoint:
  - /predict/all

---

## 3. Detailed Flow

1. User uploads data
2. Backend validates input
3. Data sent to preprocessing pipeline
4. Parallel model inference
5. Results aggregated
6. Response returned to frontend

---

## 4. Scalability Strategy

- Horizontal scaling (containers)
- Load balancer
- Separate ML services

---

## 5. Security Architecture

- API authentication (JWT)
- Role-based access
- Encrypted storage

---

## 6. Deployment Architecture

Frontend:
- Vercel

Backend:
- AWS EC2 / GCP

ML Services:
- Docker containers

Storage:
- S3

---

## 7. Future Architecture Improvements

- Microservices split
- Event-driven architecture (Kafka)
- Real-time streaming predictions
- Edge inference for faster response

---

## 8. Key Design Decisions

- Multimodal inputs (page 9)
- Parallel model architecture (page 4)
- Probabilistic outputs (not diagnostic)

---

## 9. Reliability

- Auto-retries
- Logging
- Monitoring

---

## 10. Observability

- Logs (ELK stack)
- Metrics (Prometheus)
- Alerts (PagerDuty)