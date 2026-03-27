# PreNeuro — Documentation

> **AI-Powered Predictive Screening for Neurodegenerative Diseases**
>
> Last Updated: March 28, 2026

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture](#2-architecture)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Getting Started](#5-getting-started)
6. [Backend (API)](#6-backend-api)
7. [Frontend (UI)](#7-frontend-ui)
8. [Database Schema](#8-database-schema)
9. [API Reference](#9-api-reference)
10. [ML Prediction Engine](#10-ml-prediction-engine)
11. [Design System](#11-design-system)
12. [Deployment](#12-deployment)
13. [Environment Variables](#13-environment-variables)
14. [Contributing](#14-contributing)

---

## 1. Overview

**PreNeuro** is a full-stack web application designed for clinicians to perform early predictive screening of neurodegenerative diseases. It provides:

- **Patient Management** — Register and manage patient records with demographics, contact info, and medical history.
- **Symptom-Based Assessment** — Conduct multi-symptom assessments from a predefined list of neurological indicators.
- **AI-Powered Risk Prediction** — Generate risk scores for **Alzheimer's Disease**, **Parkinson's Disease**, and **ALS** using a symptom-weighted prediction engine.
- **Interactive Dashboard** — Visualize risk data with bar and pie charts, track recent assessments, and monitor patient statistics.
- **Theme Support** — Toggle between dark and light modes, with full design fidelity in both themes.

### Who Is This For?

- Neurologists and clinicians performing early-stage screening
- Medical researchers studying neurodegenerative disease patterns
- Healthcare organizations integrating predictive tools into clinical workflows

---

## 2. Architecture

PreNeuro follows a **decoupled client-server architecture**:

```
┌──────────────────────────┐         ┌──────────────────────────┐
│                          │  HTTP   │                          │
│     Next.js Frontend     │◄───────►│     FastAPI Backend      │
│     (React 19, TS)       │  REST   │     (Python 3.11+)       │
│                          │         │                          │
│  ┌────────────────────┐  │         │  ┌────────────────────┐  │
│  │ TanStack Query      │  │         │  │ SQLAlchemy ORM     │  │
│  │ (Server State)      │  │         │  │ (Async Sessions)   │  │
│  └────────────────────┘  │         │  └─────────┬──────────┘  │
│                          │         │            │              │
│  ┌────────────────────┐  │         │  ┌─────────▼──────────┐  │
│  │ Recharts            │  │         │  │ ML Predictor       │  │
│  │ (Data Viz)          │  │         │  │ (Symptom Weights)  │  │
│  └────────────────────┘  │         │  └────────────────────┘  │
└──────────────────────────┘         └──────────┬───────────────┘
                                                │
                                     ┌──────────▼───────────────┐
                                     │     PostgreSQL 15        │
                                     │     (Neon Serverless /   │
                                     │      Docker Local)       │
                                     └──────────────────────────┘
```

### Data Flow

1. **User Action** → Clinician interacts with the Next.js frontend (e.g., creates an assessment).
2. **API Call** → Frontend sends a REST request to the FastAPI backend via `fetchApi()`.
3. **Business Logic** → Backend validates input, queries the database, and performs operations.
4. **ML Prediction** → When prediction is triggered, the backend runs the symptom-weighted algorithm.
5. **Response** → Risk scores, recommendations, and status are returned to the frontend.
6. **UI Update** → TanStack Query invalidates stale data and re-renders the UI.

---

## 3. Tech Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| Next.js | 16.2.1 | React framework (App Router) |
| React | 19.2.4 | UI library |
| TypeScript | 5.x | Type safety |
| Tailwind CSS | 4.x | Utility-first styling |
| Recharts | 3.8.1 | Charts and data visualization |
| TanStack Query | 5.95.2 | Server state management |
| Lucide React | 1.7.0 | Icon library |
| React Hook Form | 7.72.0 | Form management |
| Zod | 4.3.6 | Schema validation |
| Framer Motion | — | Animations (via tw-animate-css) |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| FastAPI | ≥0.115.0 | Async Python web framework |
| Uvicorn | ≥0.34.0 | ASGI server |
| SQLAlchemy | ≥2.0.36 | Async ORM with PostgreSQL |
| Psycopg | ≥3.2.0 | PostgreSQL driver |
| Pydantic | ≥2.10.0 | Data validation and serialization |
| Pydantic Settings | ≥2.6.0 | Configuration management |
| Alembic | ≥1.14.0 | Database migrations |

### Infrastructure

| Technology | Purpose |
|---|---|
| PostgreSQL 15 | Primary database |
| Docker Compose | Local development database |
| Render | Backend hosting (production) |
| Neon | Serverless PostgreSQL (production) |
| Vercel | Frontend hosting (production) |

---

## 4. Project Structure

```
preneuro/
├── .gitignore                  # Git ignore rules
├── docker-compose.yml          # Local PostgreSQL container
├── render.yaml                 # Render deployment config
├── README.md                   # Quick start guide
│
├── backend/                    # FastAPI application
│   ├── main.py                 # Application entry point
│   ├── requirements.txt        # Python dependencies
│   ├── Procfile                # Process file for Render
│   ├── .env.example            # Environment template
│   └── app/
│       ├── __init__.py
│       ├── config.py           # Settings (DB URL, CORS)
│       ├── database.py         # SQLAlchemy engine & session
│       ├── api/
│       │   └── routes/
│       │       ├── users.py        # User endpoints
│       │       ├── patients.py     # Patient CRUD
│       │       ├── assessments.py  # Assessment CRUD + predict
│       │       └── predictions.py  # Direct prediction endpoints
│       ├── models/
│       │   ├── user.py         # User ORM model
│       │   ├── patient.py      # Patient ORM model
│       │   └── assessment.py   # Assessment ORM model
│       ├── schemas/
│       │   ├── user.py         # User Pydantic schemas
│       │   ├── patient.py      # Patient Pydantic schemas
│       │   └── assessment.py   # Assessment Pydantic schemas
│       ├── ml/
│       │   └── predictor.py    # Mock ML prediction engine
│       └── services/
│           └── __init__.py
│
├── frontend/                   # Next.js application
│   ├── package.json
│   ├── next.config.ts
│   ├── postcss.config.mjs
│   ├── components.json         # ShadCN UI config
│   └── src/
│       ├── app/
│       │   ├── layout.tsx          # Root layout
│       │   ├── globals.css         # Design system & tokens
│       │   ├── page.tsx            # Dashboard (home)
│       │   ├── patients/
│       │   │   ├── page.tsx        # Patient list
│       │   │   └── [id]/page.tsx   # Patient detail
│       │   └── assessments/
│       │       ├── page.tsx        # Assessment list
│       │       ├── new/page.tsx    # New assessment form
│       │       └── [id]/page.tsx   # Assessment detail + charts
│       ├── components/
│       │   ├── sidebar.tsx         # Navigation sidebar
│       │   ├── theme-toggle.tsx    # Dark/light mode toggle
│       │   ├── providers.tsx       # TanStack Query provider
│       │   ├── dashboard/
│       │   │   ├── stats.tsx           # Stat cards
│       │   │   ├── recent-assessments.tsx  # Recent list
│       │   │   └── risk-chart.tsx      # Bar chart
│       │   └── ui/                 # ShadCN UI primitives
│       │       ├── button.tsx
│       │       ├── card.tsx
│       │       ├── input.tsx
│       │       ├── select.tsx
│       │       ├── table.tsx
│       │       └── ... (12 components)
│       ├── lib/
│       │   ├── api.ts          # API client functions
│       │   └── utils.ts        # Utility helpers (cn)
│       └── types/
│           └── index.ts        # TypeScript interfaces
│
└── docs/                       # Documentation
    ├── PRENEURO_DOCUMENTATION.md   # ← This file
    ├── Architecture.md
    ├── PRD.md
    ├── Tech_Stack.md
    └── DEPLOYMENT_GUIDE_FREE.md
```

---

## 5. Getting Started

### Prerequisites

- **Node.js** 18+ and npm
- **Python** 3.11+
- **Docker** and Docker Compose (for local database)
- **Git**

### Step 1: Clone the Repository

```bash
git clone https://github.com/sammyyakk/preneuro.git
cd preneuro
```

### Step 2: Start the Local Database

```bash
docker-compose up -d
```

This starts a PostgreSQL 15 container on **port 5433** (mapped from container's 5432).

**Connection Details:**
| Parameter | Value |
|---|---|
| Host | localhost |
| Port | 5433 |
| Database | preneuro |
| User | preneuro |
| Password | preneuro_dev |

### Step 3: Set Up the Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate        # macOS/Linux
# venv\Scripts\activate          # Windows

pip install -r requirements.txt
```

Create the `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with:

```env
DATABASE_URL=postgresql+psycopg://preneuro:preneuro_dev@localhost:5433/preneuro
CORS_ORIGINS=["http://localhost:3000"]
```

Start the backend:

```bash
uvicorn main:app --reload
```

The API starts at **http://localhost:8000**. Auto-generated docs at **http://localhost:8000/docs** (Swagger UI).

> **Note:** On first startup, the database tables are automatically created and a mock user (`Dr. Sarah Chen`, `doctor@preneuro.com`) is seeded.

### Step 4: Set Up the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend starts at **http://localhost:3000**.

> The frontend uses `NEXT_PUBLIC_API_URL` to connect to the backend. It defaults to `http://localhost:8000/api`. To point to the production API, set:
>
> ```env
> NEXT_PUBLIC_API_URL=https://preneuro-api.onrender.com/api
> ```

---

## 6. Backend (API)

### Application Setup (`main.py`)

The FastAPI application is configured with:

- **CORS Middleware** — Allows cross-origin requests from the frontend (configurable via `CORS_ORIGINS`).
- **Lifespan Events** — On startup, `init_db()` creates all database tables and seeds a mock user.
- **Route Prefixes:**
  - `/api/users` — User management
  - `/api/patients` — Patient CRUD
  - `/api/assessments` — Assessment CRUD and prediction trigger
  - `/api/predict` — Direct prediction endpoints
  - `/api/health` — Health check

### Authentication

The backend uses a **mock authentication system**. All requests are authenticated as user ID `1` (the seeded doctor). The `get_current_user()` dependency in each route returns:

```python
{"id": 1, "role": "doctor"}
```

This keeps the API functional for development and demonstrations without requiring a full auth system. In production, replace this with JWT-based authentication.

### Database (`database.py`)

- Uses **async SQLAlchemy** with `psycopg` driver.
- `init_db()` creates tables on startup via `Base.metadata.create_all`.
- Sessions are managed via `async_sessionmaker` with `get_db()` dependency injection.

---

## 7. Frontend (UI)

### Pages

| Route | Page | Description |
|---|---|---|
| `/` | Dashboard | Welcome message, stat cards (total patients, assessments, pending, completed), recent assessments list, risk analysis chart |
| `/patients` | Patient List | Paginated table of all patients with search, add button |
| `/patients/[id]` | Patient Detail | Individual patient profile, linked assessments |
| `/assessments` | Assessment List | Paginated table of all assessments with status filters |
| `/assessments/new` | New Assessment | Form: select patient → check symptoms → optional notes → generate report |
| `/assessments/[id]` | Assessment Detail | Symptoms reported, risk comparison bar chart, disease risk score donut charts, overall risk level, recommendations |

### Key Components

- **`Sidebar`** — Fixed left navigation with links, user profile (Dr. Arjun Mehta), and theme toggle.
- **`ThemeToggle`** — Persists light/dark preference to `localStorage`.
- **`DashboardStats`** — Four stat cards fetching from `/api/assessments` and `/api/patients`.
- **`RecentAssessments`** — Last 5 assessments with patient name and risk badge.
- **`RiskChart`** — Recharts `BarChart` showing risk scores across the last 10 assessments.
- **`Providers`** — Wraps the app in `QueryClientProvider` for TanStack Query.

### State Management

- **Server State**: All API data is managed by TanStack Query (`useQuery`, `useMutation`, `queryClient.invalidateQueries`).
- **Client State**: Theme toggle uses `localStorage` and React state. No global state manager (Zustand, Redux) is needed.

### API Client (`lib/api.ts`)

A generic `fetchApi<T>()` wrapper handles:
- Base URL resolution from `NEXT_PUBLIC_API_URL`
- JSON serialization/deserialization
- Error handling with readable messages

Exports four API modules: `usersApi`, `patientsApi`, `assessmentsApi`, `predictionsApi`.

---

## 8. Database Schema

### Entity Relationship Diagram

```
┌──────────────┐       ┌────────────────┐       ┌─────────────────┐
│    users     │       │    patients    │       │   assessments   │
├──────────────┤       ├────────────────┤       ├─────────────────┤
│ id (PK)      │──┐    │ id (PK)        │──┐    │ id (PK)         │
│ email        │  │    │ name           │  │    │ patient_id (FK) │
│ name         │  │    │ date_of_birth  │  │    │ symptoms (JSONB)│
│ role         │  └───►│ gender         │  └───►│ uploaded_files  │
│ created_at   │       │ email          │       │ alzheimer_risk  │
└──────────────┘       │ phone          │       │ parkinson_risk  │
                       │ medical_history│       │ als_risk        │
                       │ notes          │       │ status          │
                       │ created_by(FK) │       │ notes           │
                       │ created_at     │       │ created_at      │
                       │ updated_at     │       │ completed_at    │
                       └────────────────┘       └─────────────────┘
```

### Table: `users`

| Column | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary Key, Auto-increment |
| `email` | String(255) | Unique, Indexed |
| `name` | String(255) | Not Null |
| `role` | Enum(`doctor`, `admin`) | Default: `doctor` |
| `created_at` | DateTime | Default: UTC now |

### Table: `patients`

| Column | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary Key, Auto-increment |
| `name` | String(255) | Not Null |
| `date_of_birth` | Date | Not Null |
| `gender` | Enum(`male`, `female`, `other`) | Not Null |
| `email` | String(255) | Nullable |
| `phone` | String(50) | Nullable |
| `medical_history` | JSONB | Nullable |
| `notes` | Text | Nullable |
| `created_by` | Integer | Foreign Key → `users.id` |
| `created_at` | DateTime | Default: UTC now |
| `updated_at` | DateTime | Default: UTC now, auto-updated |

### Table: `assessments`

| Column | Type | Constraints |
|---|---|---|
| `id` | Integer | Primary Key, Auto-increment |
| `patient_id` | Integer | Foreign Key → `patients.id` |
| `symptoms` | JSONB | Nullable |
| `uploaded_files` | JSONB | Nullable |
| `alzheimer_risk` | Float | Nullable (set after prediction) |
| `parkinson_risk` | Float | Nullable (set after prediction) |
| `als_risk` | Float | Nullable (set after prediction) |
| `status` | Enum(`pending`, `processing`, `completed`, `failed`) | Default: `pending` |
| `notes` | String(1000) | Nullable |
| `created_at` | DateTime | Default: UTC now |
| `completed_at` | DateTime | Nullable (set on completion) |

### Symptoms JSONB Structure

```json
{
  "memory_issues": true,
  "tremors": false,
  "balance_problems": true,
  "speech_difficulties": false,
  "muscle_weakness": false,
  "cognitive_decline": true,
  "mood_changes": false,
  "sleep_disturbances": true,
  "additional_notes": "Patient reports occasional disorientation."
}
```

---

## 9. API Reference

**Base URL:** `https://preneuro-api.onrender.com/api` (production) or `http://localhost:8000/api` (local)

### Health Check

```
GET /api/health
```

**Response:** `{ "status": "healthy" }`

---

### Patients

#### List Patients

```
GET /api/patients?page=1&page_size=10&search=sharma
```

**Response:**

```json
{
  "items": [
    {
      "id": 1,
      "name": "Aarav Sharma",
      "date_of_birth": "1985-03-15",
      "gender": "male",
      "email": "aarav.sharma@gmail.com",
      "phone": "+919876543210",
      "medical_history": null,
      "notes": null,
      "created_by": 1,
      "created_at": "2026-03-27T21:37:22.367579",
      "updated_at": "2026-03-27T21:37:22.367583"
    }
  ],
  "total": 1,
  "page": 1,
  "page_size": 10
}
```

#### Get Patient

```
GET /api/patients/{id}
```

#### Create Patient

```
POST /api/patients
Content-Type: application/json

{
  "name": "Priya Patel",
  "date_of_birth": "1972-07-22",
  "gender": "female",
  "email": "priya.patel@gmail.com",
  "phone": "+919812345678"
}
```

#### Update Patient

```
PUT /api/patients/{id}
Content-Type: application/json

{
  "notes": "Updated medical notes"
}
```

#### Delete Patient

```
DELETE /api/patients/{id}
```

---

### Assessments

#### List Assessments

```
GET /api/assessments?page=1&page_size=10&patient_id=1&status=completed
```

#### Get Assessment

```
GET /api/assessments/{id}
```

#### Create Assessment

```
POST /api/assessments
Content-Type: application/json

{
  "patient_id": 1,
  "symptoms": {
    "memory_issues": true,
    "tremors": false,
    "balance_problems": true,
    "speech_difficulties": false,
    "muscle_weakness": false,
    "cognitive_decline": true,
    "mood_changes": false,
    "sleep_disturbances": true
  },
  "notes": "Initial screening for cognitive concerns"
}
```

#### Run AI Prediction

```
POST /api/assessments/{id}/predict
```

**Response:**

```json
{
  "alzheimer_risk": 0.65,
  "parkinson_risk": 0.12,
  "als_risk": 0.08,
  "confidence": 0.80,
  "risk_level": "high",
  "recommendations": [
    "Urgent referral to neurology specialist",
    "Comprehensive diagnostic workup recommended",
    "Consider advanced imaging (PET, detailed MRI)",
    "Evaluate for clinical trial eligibility",
    "Schedule immediate follow-up within 2-4 weeks"
  ]
}
```

#### Delete Assessment

```
DELETE /api/assessments/{id}
```

---

### Direct Predictions

These endpoints allow running predictions without creating an assessment record.

#### Predict All Diseases

```
POST /api/predict/all
Content-Type: application/json

{
  "symptoms": {
    "memory_issues": true,
    "cognitive_decline": true
  }
}
```

#### Predict Single Disease

```
POST /api/predict/alzheimer
POST /api/predict/parkinson
POST /api/predict/als
```

Same request body as above. Returns single disease result with `risk`, `confidence`, `risk_level`, and `recommendations`.

---

## 10. ML Prediction Engine

### Current Implementation (Mock)

The prediction engine (`backend/app/ml/predictor.py`) uses a **symptom-weighted scoring algorithm** to simulate AI predictions. This is designed as a placeholder to be replaced by trained models in production.

### Symptom Weights

Each disease has a unique weight mapping for the 8 assessed symptoms:

| Symptom | Alzheimer's | Parkinson's | ALS |
|---|---|---|---|
| Memory Issues | **0.35** | — | — |
| Cognitive Decline | **0.30** | — | 0.10 |
| Mood Changes | 0.15 | — | — |
| Speech Difficulties | 0.10 | 0.15 | **0.25** |
| Sleep Disturbances | 0.10 | 0.10 | — |
| Tremors | — | **0.35** | 0.10 |
| Balance Problems | — | 0.25 | 0.15 |
| Muscle Weakness | — | 0.15 | **0.40** |

### Risk Calculation

```
Base Risk = Σ (symptom_present × weight)
Noise = random(-0.10, +0.15)        # Simulates model uncertainty
Final Risk = clamp(Base Risk + Noise, 0.0, 1.0)
```

### Risk Levels

| Score Range | Level | Action |
|---|---|---|
| 0.00 – 0.29 | **Low** | Routine monitoring, 12-month follow-up |
| 0.30 – 0.59 | **Moderate** | Neurological evaluation, 3-6 month follow-up |
| 0.60 – 1.00 | **High** | Urgent specialist referral, advanced imaging, 2-4 week follow-up |

### Confidence Score

```
Confidence = min(0.95, 0.60 + (symptom_count × 0.05) + file_bonus)
```

Where `file_bonus = 0.05` if diagnostic files are uploaded.

### Upgrading to Real Models

To integrate trained models, replace the `predict_risks()` function in `predictor.py`:

```python
def predict_risks(symptoms, uploaded_files):
    # 1. Preprocess symptoms into feature tensor
    # 2. Load MRI/EEG files if provided
    # 3. Run inference on trained PyTorch/TF models
    # 4. Calibrate and return PredictionResult
    pass
```

---

## 11. Design System

### Philosophy

PreNeuro uses a **minimal, futuristic, monochrome** design with strategic color accents for medical data. The visual language is:

- **Monochrome base** — Deep black backgrounds with subtle gray borders
- **Color-coded risks** — Purple (Alzheimer's), Blue (Parkinson's), Rose (ALS)
- **130% font scale** — All fonts are 30% larger than default for clinical readability
- **Micro-grid background** — Subtle animated mesh for depth

### Theme System

CSS variables are defined in `globals.css` using HSL values in two modes:

- **Dark mode** (default) — AMOLED-black backgrounds, white text
- **Light mode** — Clean white backgrounds, dark text

Theme toggle persists to `localStorage` via `ThemeToggle` component.

### Key Design Tokens (Dark Mode)

```css
--background: 0 0% 2%;           /* Near-black */
--foreground: 0 0% 95%;          /* Near-white */
--card: 0 0% 5%;                 /* Card surfaces */
--border: 0 0% 12%;              /* Subtle borders */
--primary: 0 0% 90%;             /* Primary actions */
--muted-foreground: 0 0% 50%;    /* Secondary text */
```

### Typography

- **Font Family:** `var(--font-geist-sans)` for body, `var(--font-geist-mono)` for labels
- **Root Scale:** `html { font-size: 130% }` — All `rem` values are globally increased by 30%
- **Hardcoded sizes** converted to rem: `text-[10px]` → `text-[0.625rem]`, `text-[11px]` → `text-[0.6875rem]`

### Chart Colors

| Disease | Color | Hex |
|---|---|---|
| Alzheimer's | Purple | `#a78bfa` |
| Parkinson's | Blue | `#60a5fa` |
| ALS | Rose | `#fb7185` |

---

## 12. Deployment

### Production URLs

| Service | URL |
|---|---|
| **Backend API** | https://preneuro-api.onrender.com/api |
| **API Docs (Swagger)** | https://preneuro-api.onrender.com/docs |
| **Database** | Neon Serverless PostgreSQL |

### Backend on Render

The backend is deployed on Render using the `render.yaml` blueprint:

```yaml
services:
  - type: web
    name: preneuro-backend
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    healthCheckPath: /api/health
```

**Required Environment Variables on Render:**

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `CORS_ORIGINS` | JSON array of allowed frontend origins |
| `PORT` | Auto-set by Render |

> **Note:** Render's free tier spins down the service after 15 minutes of inactivity. The first request after downtime may take 30-60 seconds.

### Frontend on Vercel

Deploy the `frontend/` directory to Vercel:

```bash
cd frontend
npx vercel --prod
```

Set the environment variable:

```
NEXT_PUBLIC_API_URL=https://preneuro-api.onrender.com/api
```

### Database on Neon

The production database uses Neon Serverless PostgreSQL. Tables are auto-created on backend startup via `init_db()`.

---

## 13. Environment Variables

### Root (`.env.example`)

```env
DATABASE_URL=postgresql+psycopg://preneuro:preneuro_dev@localhost:5433/preneuro
BACKEND_CORS_ORIGINS=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### Backend (`backend/.env.example`)

```env
DATABASE_URL=postgresql+psycopg://user:password@host:5432/dbname
CORS_ORIGINS=["http://localhost:3000"]
```

### Frontend

Set via `.env.local` (not committed):

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

For production:

```env
NEXT_PUBLIC_API_URL=https://preneuro-api.onrender.com/api
```

---

## 14. Contributing

### Development Workflow

1. **Fork** the repository
2. **Create a feature branch**: `git checkout -b feature/your-feature`
3. **Make changes** and test locally
4. **Commit**: `git commit -m "feat: description of change"`
5. **Push**: `git push origin feature/your-feature`
6. **Open a Pull Request** against `main`

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Usage |
|---|---|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation updates |
| `style:` | Formatting, no logic change |
| `refactor:` | Code restructuring |
| `test:` | Adding/updating tests |
| `chore:` | Maintenance tasks |

### Running Locally

```bash
# Terminal 1: Database
docker-compose up -d

# Terminal 2: Backend
cd backend && source venv/bin/activate && uvicorn main:app --reload

# Terminal 3: Frontend
cd frontend && npm run dev
```

### Code Style

- **Python:** Follow PEP 8, use async/await consistently
- **TypeScript:** Strict mode, use interfaces over types for objects
- **CSS:** Use Tailwind utilities; define custom tokens in `globals.css`

---

*Built by [Samyak Jain](https://github.com/sammyyakk) — PreNeuro v1.0.0*
