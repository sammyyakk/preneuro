# PreNeuro

> AI-Powered Predictive Screening for Neurodegenerative Diseases

[![Backend](https://img.shields.io/badge/API-Live-brightgreen)](https://preneuro-api.onrender.com/docs)
[![Tech](https://img.shields.io/badge/Stack-Next.js%20%2B%20FastAPI-blue)]()

## What Is PreNeuro?

PreNeuro is a clinical screening tool that uses symptom-weighted prediction algorithms to assess risk levels for **Alzheimer's Disease**, **Parkinson's Disease**, and **ALS**. Built for neurologists and healthcare providers.

### Features

- 🧠 **AI Risk Prediction** — Automated risk scoring across three neurodegenerative diseases
- 👥 **Patient Management** — Full CRUD with search and pagination
- 📊 **Interactive Dashboard** — Live charts, stat cards, and recent activity
- 🔬 **Multi-Symptom Assessment** — 8 neurological indicators with clinical recommendations
- 🌗 **Dark/Light Theme** — Premium monochrome design with theme persistence
- 📱 **Responsive Design** — Works on desktop and tablet

## Quick Start

```bash
# 1. Clone
git clone https://github.com/sammyyakk/preneuro.git
cd preneuro

# 2. Start database
docker-compose up -d

# 3. Start backend
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload
# → http://localhost:8000/docs

# 4. Start frontend
cd ../frontend
npm install
npm run dev
# → http://localhost:3000
```

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 16, React 19, TypeScript, Tailwind CSS 4, Recharts, TanStack Query |
| **Backend** | FastAPI, SQLAlchemy (Async), Pydantic v2 |
| **Database** | PostgreSQL 15 (Docker local, Neon production) |
| **Deployment** | Render (API), Vercel (UI), Neon (DB) |

## Production

| Service | URL |
|---|---|
| API | https://preneuro-api.onrender.com/api |
| Swagger Docs | https://preneuro-api.onrender.com/docs |

## Documentation

Full documentation is available at [`docs/PRENEURO_DOCUMENTATION.md`](docs/PRENEURO_DOCUMENTATION.md), covering:

- Architecture and data flow
- Complete API reference with examples
- Database schema and relationships
- ML prediction engine details
- Design system and theming
- Deployment guides
- Environment variable reference

## License

MIT

---
