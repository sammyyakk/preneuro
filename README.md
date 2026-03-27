# PreNeuro

AI-powered predictive screening platform for early detection of neurodegenerative diseases.

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 18+
- Python 3.11+

### 1. Start Database
```bash
docker-compose up -d
```

### 2. Setup Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```
Backend runs at: http://localhost:8000
API docs: http://localhost:8000/docs

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend runs at: http://localhost:3000

## Features
- Patient management
- Multi-symptom assessment
- AI-powered risk prediction for:
  - Alzheimer's Disease
  - Parkinson's Disease
  - ALS
- Risk visualization dashboard
- Assessment history tracking

## Tech Stack
- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS, ShadCN UI
- **Backend**: FastAPI, SQLAlchemy, PostgreSQL
- **ML**: Mock predictions (ready for real model integration)
