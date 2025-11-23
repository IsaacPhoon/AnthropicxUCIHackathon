# Implementation Guide

This document provides a comprehensive guide for completing the AI Interview Prep Coach application.

## Project Status

### ✅ Completed Backend
- FastAPI application with all endpoints
- PostgreSQL database models
- Alembic migrations
- Claude API integration for question generation and evaluation with structured outputs
- faster-whisper integration for transcription
- JWT authentication
- File storage service

### ✅ Completed Frontend Foundation
- React + TypeScript + Vite setup
- TailwindCSS configuration
- Authentication context and pages (Login/Register)
- API service layer
- Audio recording hook
- Type definitions

### 🚧 Frontend Pages to Complete

The following pages need to be implemented. I'll provide detailed structure below.

## Frontend Pages Implementation

### 1. Dashboard Page (src/pages/Dashboard.tsx)

**Purpose**: Display list of uploaded job descriptions

**Key Features**:
- List all user's job descriptions
- Show status (pending, questions_generated, error)
- Link to practice page for each job description
- Button to upload new job description

**React Query Integration**:
```typescript
import { useQuery } from '@tanstack/react-query';
import { jobDescriptionsAPI } from '@/services/api';

const { data: jobDescriptions, isLoading } = useQuery({
  queryKey: ['jobDescriptions'],
  queryFn: jobDescriptionsAPI.list
});
```

**UI Components**:
- Header with app title and logout button
- "Upload New Job Description" button
- Grid/List of job description cards
- Each card shows: company, title, status, date, "Practice" button

### 2. Upload Page (src/pages/Upload.tsx)

**Purpose**: Upload job description PDF with metadata

**Key Features**:
- File upload input (PDF only)
- Company name input
- Job title input
- Form validation
- Loading state during upload
- Success/error messages
- Auto-redirect to dashboard on success

**React Query Mutation**:
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();
const mutation = useMutation({
  mutationFn: ({ file, companyName, jobTitle }) =>
    jobDescriptionsAPI.upload(file, companyName, jobTitle),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['jobDescriptions'] });
    navigate('/dashboard');
  }
});
```

### 3. Practice Page (src/pages/Practice.tsx)

**Purpose**: Display questions and allow recording responses

**Key Features**:
- Fetch questions for selected job description
- Display one question at a time (carousel/stepper)
- Audio recording interface using `useAudioRecorder` hook
- Submit recording button
- Show loading during transcription/evaluation
- Display evaluation results
- Navigate between questions

**Implementation Steps**:

1. **Fetch Questions**:
```typescript
const { jobDescriptionId } = useParams();
const { data: questions } = useQuery({
  queryKey: ['questions', jobDescriptionId],
  queryFn: () => jobDescriptionsAPI.getQuestions(jobDescriptionId!)
});
```

2. **Audio Recording Component**:
```typescript
const {
  isRecording,
  audioBlob,
  startRecording,
  stopRecording,
  clearRecording
} = useAudioRecorder();
```

3. **Submit Response**:
```typescript
const submitMutation = useMutation({
  mutationFn: ({ questionId, audioFile }) =>
    responsesAPI.submit(questionId, audioFile),
  onSuccess: (evaluation) => {
    // Display evaluation results
  }
});
```

4. **UI Sections**:
- Question display
- Recording controls (Start/Stop button, timer)
- Audio playback (optional)
- Submit button
- Evaluation display (scores + feedback)
- Navigation (Previous/Next question)

### 4. History Page (src/pages/History.tsx)

**Purpose**: View past attempts for a question

**Key Features**:
- List all responses for a question
- Show dates and scores
- Click to expand and see full feedback
- Display transcript

**Implementation**:
```typescript
const { questionId } = useParams();
const { data: responses } = useQuery({
  queryKey: ['responses', questionId],
  queryFn: () => responsesAPI.list(questionId!)
});
```

## Components to Create

### 1. Layout Component (src/components/Layout.tsx)

Shared layout with navigation and header:
```typescript
interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        {/* Navigation bar */}
      </nav>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
};
```

### 2. EvaluationCard Component (src/components/EvaluationCard.tsx)

Display evaluation scores and feedback:
```typescript
interface EvaluationCardProps {
  evaluation: Response;
}

export const EvaluationCard: React.FC<EvaluationCardProps> = ({ evaluation }) => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = [
    { key: 'confidence', label: 'Confidence' },
    { key: 'clarity_structure', label: 'Clarity & Structure' },
    { key: 'technical_depth', label: 'Technical Depth' },
    { key: 'communication_skills', label: 'Communication Skills' },
    { key: 'relevance', label: 'Relevance' },
  ];

  return (
    <div className="card space-y-4">
      {/* Score bars and feedback accordion */}
    </div>
  );
};
```

### 3. AudioRecorder Component (src/components/AudioRecorder.tsx)

Reusable audio recording component:
```typescript
interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({ onRecordingComplete }) => {
  const { isRecording, audioBlob, startRecording, stopRecording, clearRecording } = useAudioRecorder();

  return (
    <div className="space-y-4">
      {/* Recording UI */}
    </div>
  );
};
```

## Setup and Running Instructions

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create PostgreSQL database:
```bash
createdb interview_prep
```

5. Create `.env` file from `.env.example` and fill in values:
```bash
cp .env.example .env
# Edit .env with your database URL, JWT secret, and Claude API key
```

6. Run migrations:
```bash
alembic upgrade head
```

7. Start server:
```bash
uvicorn app.main:app --reload
```

API will be available at [http://localhost:8000](http://localhost:8000)
API docs at [http://localhost:8000/docs](http://localhost:8000/docs)

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
# Should contain: VITE_API_URL=http://localhost:8000
```

4. Start development server:
```bash
npm run dev
```

Application will be available at [http://localhost:5173](http://localhost:5173)

## Testing the Application

### Manual Testing Flow

1. **Registration**:
   - Go to http://localhost:5173/register
   - Create a new account
   - Should auto-redirect to dashboard

2. **Upload Job Description**:
   - Click "Upload New Job Description"
   - Upload a PDF job description
   - Fill in company name and job title
   - Submit and wait for questions to generate

3. **Practice Interview**:
   - Click "Practice" on a job description
   - Read the question
   - Click "Start Recording"
   - Answer the question (speak for 30-60 seconds)
   - Click "Stop Recording"
   - Click "Submit Response"
   - Wait for transcription and evaluation (may take 10-30 seconds)
   - Review scores and feedback

4. **View History**:
   - Navigate to history for a question
   - See all past attempts with scores
   - Click to expand and see feedback

## Key Implementation Notes

### Authentication Flow
- Tokens stored in localStorage
- Added to API requests via Axios interceptor
- AuthContext provides global auth state

### Audio Recording
- Uses browser MediaRecorder API
- Saves as webm format
- Uploaded as multipart/form-data

### Claude Integration
- Structured outputs ensure consistent JSON responses
- Evaluation uses job description context for relevance
- Beta header required: `anthropic-beta: structured-outputs-2025-11-13`

### Database Migrations
- Use Alembic for schema changes
- Generate migration: `alembic revision --autogenerate -m "description"`
- Apply: `alembic upgrade head`

## Troubleshooting

### Backend Issues

1. **Database connection errors**:
   - Verify PostgreSQL is running
   - Check DATABASE_URL in .env

2. **Claude API errors**:
   - Verify CLAUDE_API_KEY is valid
   - Check you have API credits

3. **faster-whisper errors**:
   - First run downloads the model (~140MB)
   - May require additional dependencies on some systems

### Frontend Issues

1. **CORS errors**:
   - Ensure backend is running
   - Check CORS_ORIGINS in backend/.env includes frontend URL

2. **Audio recording not working**:
   - Browser must have microphone permissions
   - HTTPS required in production (localhost works in dev)

3. **API calls failing**:
   - Verify VITE_API_URL in frontend/.env
   - Check backend is running and accessible

## Next Steps

1. Implement remaining frontend pages (Dashboard, Upload, Practice, History)
2. Add loading states and error handling
3. Improve UI/UX with better styling
4. Add unit tests (pytest for backend, vitest for frontend)
5. Set up production deployment (Docker, nginx, PostgreSQL)
6. Add features like:
   - Multiple question sets per job description
   - Progress tracking
   - Performance analytics
   - Export results as PDF
   - Practice mode with timer

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Claude API Documentation](https://docs.claude.com/)
- [faster-whisper GitHub](https://github.com/SYSTRAN/faster-whisper)
- [React Query Documentation](https://tanstack.com/query/latest)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [MediaRecorder API](https://developer.mozilla.org/en-US/docs/Web/API/MediaRecorder)
