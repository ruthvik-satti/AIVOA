# AIVOA – Pharma QA Complaint Management System

AIVOA is an AI-powered pharmaceutical customer complaint management system designed to help QA operators extract structured complaint information, perform initial risk assessment, and manage complaint corrections.

## Features

* AI-powered complaint information extraction
* Natural-language complaint intake
* Pharmaceutical product and batch information extraction
* AI-assisted risk assessment
* Severity classification: Low / Medium / High
* Suggested next action
* Complaint correction using `/complaint/edit`
* Read-only QA audit record
* PDF complaint report generation
* Redux-based state management
* React frontend
* FastAPI backend
* Groq Llama 3.3 70B Versatile

## Architecture

```text
QA Operator
     │
     ▼
React Frontend
     │
    Axios
     ▼
FastAPI Backend
     │
     ▼
Groq API
(Llama 3.3 70B)
     │
     ▼
Structured JSON
     │
     ▼
Redux Store
     │
     ▼
Read-Only QA Complaint Record
```

## How to Run

### Backend

First, make sure you are inside the `backend` folder.

```bash
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### Frontend

Open a **new terminal** and make sure you are inside the `frontend` folder.

```bash
cd frontend
npm install
npm run dev
```

Run the **backend and frontend in separate terminals**.
