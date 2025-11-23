# AI Interview Prep Coach Web App

A full-stack web application that helps users practice behavioral interviews for specific jobs using AI-powered question generation and response evaluation.

## Overview

This application allows users to:
- Upload job descriptions (PDF format)
- Receive AI-generated tailored behavioral interview questions
- Practice answering questions with audio recordings
- Get detailed AI-driven feedback and scoring on their responses
- Track progress across multiple interview practice sessions

## Tech Stack

### Frontend
- **Framework**: React 18+
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **State Management**: React Query (TanStack Query)
- **Audio Recording**: Browser MediaRecorder API
- **HTTP Client**: Native fetch API

### Backend
- **Framework**: FastAPI (Python 3.10+)
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT (PyJWT)
- **AI Integrations**:
  - Claude API (Anthropic) - Question generation & evaluation with structured outputs
  - faster-whisper - Audio transcription (base English model)
- **File Storage**: Local filesystem (/uploads)

### DevOps
- **Environment Management**: .env files + Pydantic settings
- **Database Migrations**: Alembic
- **Linting**: Ruff (Python), ESLint (TypeScript)

## Project Structure

```
.
├── backend/
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── api/              # API endpoints
│   │   │   ├── auth.py
│   │   │   ├── job_descriptions.py
│   │   │   ├── questions.py
│   │   │   └── responses.py
│   │   ├── core/             # Core configuration
│   │   │   ├── config.py
│   │   │   ├── security.py
│   │   │   └── database.py
│   │   ├── models/           # SQLAlchemy models
│   │   │   ├── user.py
│   │   │   ├── job_description.py
│   │   │   ├── question.py
│   │   │   ├── response.py
│   │   │   └── response_score.py
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── services/         # Business logic
│   │   │   ├── claude_service.py
│   │   │   ├── whisper_service.py
│   │   │   └── storage_service.py
│   │   └── main.py           # FastAPI application
│   ├── uploads/              # Local file storage
│   ├── requirements.txt
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/            # Page components
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Upload.tsx
│   │   │   ├── Practice.tsx
│   │   │   └── History.tsx
│   │   ├── hooks/            # Custom React hooks
│   │   ├── services/         # API client
│   │   ├── types/            # TypeScript types
│   │   ├── utils/            # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
└── README.md
```

## Setup Instructions

### Prerequisites
- Python 3.10+
- Node.js 18+
- PostgreSQL 14+
- Claude API key (from Anthropic)

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create and activate a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Configure environment variables in `.env`:
```
DATABASE_URL=postgresql://user:password@localhost:5432/interview_prep
JWT_SECRET=your-super-secret-jwt-key-change-this
CLAUDE_API_KEY=your-claude-api-key
STORAGE_ROOT=./uploads
```

6. Run database migrations:
```bash
alembic upgrade head
```

7. Start the backend server:
```bash
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`
API documentation will be available at `http://localhost:8000/docs`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```
VITE_API_URL=http://localhost:8000
```

5. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Job Descriptions
- `POST /api/job-descriptions` - Upload job description PDF
- `GET /api/job-descriptions` - List user's job descriptions
- `GET /api/job-descriptions/:id/questions` - Get questions for a job description

### Responses & Evaluation
- `POST /api/questions/:id/responses` - Submit audio response
- `GET /api/questions/:id/responses` - List responses for a question

## Features

### 1. User Authentication
- Secure registration and login with JWT
- Password hashing with bcrypt
- Token-based authentication for all protected routes

### 2. Job Description Management
- Upload job descriptions as PDF files
- Automatic question generation via Claude API
- Track status of question generation

### 3. Interview Practice
- View AI-generated behavioral questions
- Record audio responses using browser's microrecorder
- Real-time audio capture and upload

### 4. AI-Powered Evaluation
- Automatic transcription with faster-whisper
- Structured evaluation via Claude API with scores (1-10) for:
  - Confidence
  - Clarity/Structure
  - Technical Depth
  - Communication Skills
  - Relevance/Alignment
- Detailed textual feedback per category

### 5. Progress Tracking
- View past attempts with scores
- Track improvement over time
- Review transcripts and feedback

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Code Formatting
```bash
# Backend (Ruff)
cd backend
ruff format .

# Frontend (ESLint)
cd frontend
npm run lint
```

## Technology Research Sources

- [FastAPI with PostgreSQL Best Practices](https://fastapi.tiangolo.com/tutorial/sql-databases/)
- [Building Scalable APIs with FastAPI and PostgreSQL 2025](https://medium.com/@gizmo.codes/building-a-scalable-api-with-fastapi-and-postgresql-a-2025-guide-ca5f3b9cb914)
- [faster-whisper GitHub Repository](https://github.com/SYSTRAN/faster-whisper)
- [Build Speech-to-Text Service with faster-whisper](https://medium.com/@johnidouglasmarangon/build-a-speech-to-text-service-in-python-with-faster-whisper-39ad3b1e2305)
- [Claude Structured Outputs Documentation](https://docs.claude.com/en/docs/build-with-claude/structured-outputs)
- [Claude API Structured Output Complete Guide](https://thomas-wiegold.com/blog/claude-api-structured-output/)
- [React Audio Recording with MediaRecorder](https://www.somethingsblog.com/2024/10/31/building-custom-audio-and-video-recorders-with-react-and-mediarecorder-api/)
- [Vite React TypeScript Audio Recorder](https://github.com/LuanEdCosta/vite-react-typescript-audio)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
