# AI Interview Prep Coach - Project Summary

## Project Overview

This is a full-stack web application built for the Anthropic x UCI Hackathon that helps users practice behavioral interviews using AI-powered question generation and response evaluation.

## ✅ Completed Implementation

### Backend (FastAPI + Python)

**Core Framework:**
- ✅ FastAPI application with CORS middleware
- ✅ PostgreSQL database with SQLAlchemy ORM
- ✅ Alembic for database migrations
- ✅ Pydantic for settings and validation
- ✅ JWT authentication with bcrypt password hashing

**Database Models:**
- ✅ User model with authentication
- ✅ JobDescription model with status tracking
- ✅ Question model for interview questions
- ✅ Response model for audio recordings and transcripts
- ✅ ResponseScore model for structured evaluations

**API Endpoints:**

*Authentication:*
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

*Job Descriptions:*
- `POST /api/job-descriptions` - Upload PDF and generate questions
- `GET /api/job-descriptions` - List user's job descriptions
- `GET /api/job-descriptions/:id/questions` - Get questions for a job

*Responses:*
- `POST /api/questions/:id/responses` - Submit audio and get evaluation
- `GET /api/questions/:id/responses` - List past attempts

**AI Integrations:**

*Claude API:*
- ✅ Question generation from job descriptions
- ✅ Response evaluation with structured outputs (JSON schema)
- ✅ Uses Claude Sonnet 4.5 with beta structured outputs feature
- ✅ Evaluates on 5 criteria: Confidence, Clarity/Structure, Technical Depth, Communication Skills, Relevance
- ✅ Returns scores (1-10) and detailed feedback per category

*faster-whisper:*
- ✅ Audio transcription using base English model
- ✅ VAD (Voice Activity Detection) enabled
- ✅ CPU/GPU support configuration
- ✅ Handles webm audio format from browser

**File Storage:**
- ✅ Local filesystem storage for PDFs and audio files
- ✅ Unique file naming with UUIDs
- ✅ PDF text extraction using pypdf
- ✅ File validation (type, size limits)

### Frontend (React + TypeScript + Vite)

**Core Setup:**
- ✅ React 18 with TypeScript
- ✅ Vite for build tooling
- ✅ TailwindCSS for styling
- ✅ React Router for navigation
- ✅ TanStack Query (React Query) for data fetching
- ✅ Axios for API communication

**Pages:**
- ✅ Login page with email/password authentication
- ✅ Register page with validation
- ✅ Dashboard page showing all job descriptions
- ✅ Upload page for job description PDFs
- ✅ Practice page with audio recording and evaluation display
- ✅ History page showing past attempts

**Key Features:**
- ✅ Authentication context with token management
- ✅ Protected routes requiring authentication
- ✅ Audio recording hook using MediaRecorder API
- ✅ Real-time audio capture and playback
- ✅ Form validation and error handling
- ✅ Loading states for async operations
- ✅ Responsive design with dark mode support

**Custom Hooks:**
- ✅ `useAuth` - Authentication state management
- ✅ `useAudioRecorder` - Audio recording with MediaRecorder

**Services:**
- ✅ API service layer with typed interfaces
- ✅ Axios interceptor for automatic token injection
- ✅ TypeScript types for all API responses

## File Structure

```
.
├── backend/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth.py                  # Authentication endpoints
│   │   │   ├── job_descriptions.py      # Job description endpoints
│   │   │   └── responses.py             # Response endpoints
│   │   ├── core/
│   │   │   ├── config.py                # Application configuration
│   │   │   ├── database.py              # Database setup
│   │   │   └── security.py              # Authentication utilities
│   │   ├── models/
│   │   │   ├── user.py                  # User model
│   │   │   ├── job_description.py       # JobDescription model
│   │   │   ├── question.py              # Question model
│   │   │   ├── response.py              # Response model
│   │   │   └── response_score.py        # ResponseScore model
│   │   ├── schemas/
│   │   │   ├── user.py                  # User Pydantic schemas
│   │   │   ├── job_description.py       # JobDescription schemas
│   │   │   ├── question.py              # Question schemas
│   │   │   └── response.py              # Response schemas
│   │   ├── services/
│   │   │   ├── claude_service.py        # Claude API integration
│   │   │   ├── whisper_service.py       # faster-whisper integration
│   │   │   └── storage_service.py       # File storage
│   │   └── main.py                      # FastAPI application
│   ├── alembic/                         # Database migrations
│   ├── uploads/                         # File storage
│   ├── requirements.txt                 # Python dependencies
│   ├── alembic.ini                      # Alembic configuration
│   └── .env.example                     # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.tsx                # Login page
│   │   │   ├── Register.tsx             # Registration page
│   │   │   ├── Dashboard.tsx            # Job descriptions list
│   │   │   ├── Upload.tsx               # Upload job description
│   │   │   ├── Practice.tsx             # Practice interview questions
│   │   │   └── History.tsx              # View past attempts
│   │   ├── context/
│   │   │   └── AuthContext.tsx          # Authentication context
│   │   ├── hooks/
│   │   │   └── useAudioRecorder.ts      # Audio recording hook
│   │   ├── services/
│   │   │   └── api.ts                   # API client
│   │   ├── types/
│   │   │   └── index.ts                 # TypeScript types
│   │   ├── App.tsx                      # Main app component
│   │   ├── main.tsx                     # Entry point
│   │   └── index.css                    # Global styles
│   ├── index.html                       # HTML template
│   ├── package.json                     # Node dependencies
│   ├── tsconfig.json                    # TypeScript config
│   ├── vite.config.ts                   # Vite config
│   ├── tailwind.config.js               # Tailwind config
│   ├── postcss.config.js                # PostCSS config
│   └── .env.example                     # Environment variables template
│
├── README.md                            # Project documentation
├── IMPLEMENTATION_GUIDE.md              # Detailed implementation guide
├── PROJECT_SUMMARY.md                   # This file
└── .gitignore                           # Git ignore rules
```

## Quick Start

### Backend Setup

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
createdb interview_prep
alembic upgrade head
uvicorn app.main:app --reload
```

Backend runs at [http://localhost:8000](http://localhost:8000)

### Frontend Setup

```bash
cd frontend
npm install
cp .env.example .env
# Edit .env if needed
npm run dev
```

Frontend runs at [http://localhost:5173](http://localhost:5173)

## Environment Variables

### Backend (.env)

```
DATABASE_URL=postgresql://user:password@localhost:5432/interview_prep
JWT_SECRET=your-super-secret-jwt-key
CLAUDE_API_KEY=your-claude-api-key
STORAGE_ROOT=./uploads
WHISPER_MODEL=base.en
WHISPER_DEVICE=cpu
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:8000
```

## Technology Stack Summary

| Component | Technology |
|-----------|------------|
| Frontend Framework | React 18 |
| Language (Frontend) | TypeScript |
| Build Tool | Vite |
| Styling | TailwindCSS |
| State Management | React Query (TanStack Query) |
| Routing | React Router v7 |
| Backend Framework | FastAPI |
| Language (Backend) | Python 3.10+ |
| Database | PostgreSQL |
| ORM | SQLAlchemy |
| Migrations | Alembic |
| Authentication | JWT (PyJWT) |
| Password Hashing | bcrypt (passlib) |
| AI - Questions | Claude API (Anthropic) |
| AI - Evaluation | Claude API with Structured Outputs |
| Transcription | faster-whisper |
| Audio Capture | MediaRecorder API |
| PDF Processing | pypdf |
| HTTP Client | Axios |

## Key Features

### 1. User Authentication
- Secure registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Token stored in localStorage
- Automatic token injection in API requests

### 2. Job Description Management
- Upload PDF job descriptions
- Extract text from PDFs
- Store metadata (company name, job title)
- Track processing status
- Generate tailored interview questions using Claude

### 3. Question Generation
- Claude API analyzes job descriptions
- Generates 5 behavioral interview questions
- Questions tailored to specific role and company
- STAR method focused
- Stored in database for reuse

### 4. Interview Practice
- Display questions one at a time
- Record audio responses using browser microphone
- Play back recordings before submission
- Real-time recording status
- Submit for evaluation

### 5. AI Evaluation
- Automatic transcription with faster-whisper
- Claude API evaluates responses
- Structured output with JSON schema
- 5 scoring criteria (1-10 each):
  - Confidence
  - Clarity/Structure
  - Technical Depth
  - Communication Skills
  - Relevance
- Detailed feedback per category
- Overall improvement suggestions

### 6. Progress Tracking
- View all past attempts
- See scores over time
- Review transcripts
- Track improvement

## API Documentation

When running, interactive API documentation is available at:
- Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
- ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password_hash VARCHAR NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);

-- Job descriptions table
CREATE TABLE job_descriptions (
    id UUID PRIMARY KEY,
    user_id UUID REFERENCES users(id),
    company_name VARCHAR NOT NULL,
    job_title VARCHAR NOT NULL,
    file_path VARCHAR NOT NULL,
    extracted_text TEXT,
    status VARCHAR NOT NULL,  -- pending, questions_generated, error
    error_message TEXT,
    created_at TIMESTAMP
);

-- Questions table
CREATE TABLE questions (
    id UUID PRIMARY KEY,
    job_description_id UUID REFERENCES job_descriptions(id),
    user_id UUID REFERENCES users(id),
    question_text TEXT NOT NULL,
    created_at TIMESTAMP
);

-- Responses table
CREATE TABLE responses (
    id UUID PRIMARY KEY,
    question_id UUID REFERENCES questions(id),
    user_id UUID REFERENCES users(id),
    audio_path VARCHAR NOT NULL,
    transcript TEXT NOT NULL,
    created_at TIMESTAMP
);

-- Response scores table
CREATE TABLE response_scores (
    id UUID PRIMARY KEY,
    response_id UUID REFERENCES responses(id) UNIQUE,
    scores_json JSONB NOT NULL,
    score_confidence INTEGER,
    score_clarity_structure INTEGER,
    score_technical_depth INTEGER,
    score_communication_skills INTEGER,
    score_relevance INTEGER,
    created_at TIMESTAMP
);
```

## Testing

### Manual Testing Workflow

1. **Register**: Create a new account
2. **Upload**: Upload a job description PDF
3. **Wait**: Questions generate (10-30 seconds)
4. **Practice**: Record answers to questions
5. **Evaluate**: Receive AI feedback
6. **Improve**: Review feedback and try again

### Sample Job Description

For testing, use any job description PDF. Example sources:
- LinkedIn job postings (download as PDF)
- Company career pages
- Indeed job listings

## Deployment Considerations

### Production Checklist

- [ ] Set strong JWT_SECRET
- [ ] Use production database (not development)
- [ ] Configure CORS for production domain
- [ ] Set up HTTPS for frontend and backend
- [ ] Configure S3 or similar for file storage
- [ ] Set up logging and monitoring
- [ ] Add rate limiting
- [ ] Set up database backups
- [ ] Configure CI/CD pipeline
- [ ] Add error tracking (e.g., Sentry)
- [ ] Optimize faster-whisper with GPU if available
- [ ] Set up CDN for frontend assets

## Known Limitations

1. **File Storage**: Uses local filesystem (not scalable)
2. **Audio Format**: Only supports webm (browser dependent)
3. **Synchronous Processing**: Transcription/evaluation blocks request
4. **No Background Jobs**: No job queue for async processing
5. **Basic Error Handling**: Could be more robust
6. **No Tests**: Unit/integration tests not implemented
7. **Single Model**: Only supports base.en whisper model
8. **No Analytics**: No usage tracking or analytics

## Future Enhancements

- [ ] Add job queue (Celery/RQ) for async processing
- [ ] Implement S3 storage for production
- [ ] Add progress indicators for long operations
- [ ] Support multiple whisper models
- [ ] Add practice session analytics
- [ ] Export results as PDF
- [ ] Add timed practice mode
- [ ] Multi-language support
- [ ] Mobile app version
- [ ] Social sharing features
- [ ] Resume parsing integration
- [ ] Mock interview scheduler

## Resources and References

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Claude API Documentation](https://docs.claude.com/)
- [Claude Structured Outputs](https://docs.claude.com/en/docs/build-with-claude/structured-outputs)
- [faster-whisper GitHub](https://github.com/SYSTRAN/faster-whisper)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)

## Credits

Built for the Anthropic x UCI Hackathon

Technologies:
- Anthropic Claude AI for question generation and evaluation
- OpenAI Whisper (via faster-whisper) for transcription
- FastAPI for backend
- React for frontend

## License

MIT License (see project requirements)

---

**For detailed implementation guidance, see [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)**
**For getting started, see [README.md](./README.md)**
