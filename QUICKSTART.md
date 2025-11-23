# Quick Start Guide

Get the AI Interview Prep Coach running in 10 minutes!

## Prerequisites

Make sure you have these installed:
- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **PostgreSQL 14+** ([Download](https://www.postgresql.org/download/))
- **Claude API Key** (Get from [Anthropic Console](https://console.anthropic.com/))

## Step 1: Clone the Repository

```bash
git clone <repository-url>
cd AnthropicxUCIHackathon
```

## Step 2: Database Setup

Create the PostgreSQL database:

```bash
createdb interview_prep
```

Or using psql:
```sql
CREATE DATABASE interview_prep;
```

## Step 3: Backend Setup

Open a terminal and run:

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
# venv\Scripts\activate

# Install dependencies (may take 2-3 minutes)
pip install -r requirements.txt

# Copy environment file
cp .env.example .env
```

Now edit the `.env` file with your configuration:

```env
DATABASE_URL=postgresql://your_username:your_password@localhost:5432/interview_prep
JWT_SECRET=your-super-secret-random-string-here
CLAUDE_API_KEY=your-claude-api-key-here
STORAGE_ROOT=./uploads
WHISPER_MODEL=base.en
WHISPER_DEVICE=cpu
```

**Important**: Replace:
- `your_username` and `your_password` with your PostgreSQL credentials
- `your-super-secret-random-string-here` with a random string (e.g., use `openssl rand -hex 32`)
- `your-claude-api-key-here` with your actual Claude API key

Run database migrations:

```bash
alembic upgrade head
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```

**Leave this terminal running** and open a new one for the frontend.

## Step 4: Frontend Setup

In a **new terminal**:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (may take 1-2 minutes)
npm install

# Copy environment file
cp .env.example .env
```

The `.env` file should contain:
```env
VITE_API_URL=http://localhost:8000
```

Start the development server:

```bash
npm run dev
```

You should see:
```
  VITE v6.0.2  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

## Step 5: Open the Application

Open your browser and go to:
**[http://localhost:5173](http://localhost:5173)**

You should see the login page!

## Step 6: Test the Application

### 1. Create an Account

1. Click "Register" on the login page
2. Enter an email (e.g., `test@example.com`)
3. Enter a password (min 6 characters)
4. Click "Create account"

You'll be redirected to the dashboard.

### 2. Upload a Job Description

1. Click "Upload New Job Description"
2. Fill in:
   - Company Name: e.g., "Google"
   - Job Title: e.g., "Senior Software Engineer"
   - Upload a PDF job description file
3. Click "Upload & Generate Questions"
4. Wait 10-30 seconds for questions to generate
5. You'll be redirected to the dashboard

### 3. Practice Interview Questions

1. Click "Start Practice" on your uploaded job
2. Read the interview question
3. Click the microphone button to start recording
4. Answer the question (speak for 30-60 seconds)
5. Click the button again to stop recording
6. Listen to your recording (optional)
7. Click "Submit Response"
8. Wait 10-30 seconds for transcription and evaluation
9. Review your scores and feedback!

## Troubleshooting

### Backend won't start

**Error: `ModuleNotFoundError`**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
# venv\Scripts\activate  # Windows

# Reinstall dependencies
pip install -r requirements.txt
```

**Error: `FATAL: database "interview_prep" does not exist`**
```bash
# Create the database
createdb interview_prep
```

**Error: `sqlalchemy.exc.OperationalError`**
- Check your DATABASE_URL in backend/.env
- Verify PostgreSQL is running
- Verify credentials are correct

### Frontend won't start

**Error: `npm: command not found`**
- Install Node.js from https://nodejs.org/

**Error: Module errors**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Audio Recording Not Working

**Error: "Failed to access microphone"**
- Grant microphone permissions in browser
- Check browser console for specific error
- Try refreshing the page
- Chrome/Edge: Settings → Privacy and security → Site Settings → Microphone

### Claude API Errors

**Error: `401 Unauthorized`**
- Verify your CLAUDE_API_KEY in backend/.env
- Check you have API credits in Anthropic Console

**Error: Rate limit**
- Claude API has rate limits
- Wait a few minutes and try again

### CORS Errors

**Error: `No 'Access-Control-Allow-Origin' header`**
- Ensure backend is running
- Check CORS_ORIGINS in backend/.env includes "http://localhost:5173"
- Restart backend after changing .env

## Next Steps

Once everything is working:

1. ✅ Try uploading different job descriptions
2. ✅ Practice answering multiple questions
3. ✅ Review your progress and improvement
4. ✅ Check the implementation guide for customization options

## Getting Help

If you encounter issues:

1. Check the error messages in terminal/browser console
2. Review [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) for detailed setup
3. Check [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md) for architecture overview
4. Verify all prerequisites are installed correctly

## API Documentation

Once backend is running, view interactive API docs at:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Sample Job Description

Don't have a job description PDF? Try these:

1. **Find a job posting** on LinkedIn, Indeed, or company career pages
2. **Save as PDF**: Most browsers have "Print to PDF" option
3. **Or use a text file**: Create a .txt file with job requirements and save as PDF

Example job description content:
```
Senior Software Engineer
Company: Tech Startup Inc.

We are looking for an experienced software engineer to join our team.

Requirements:
- 5+ years of experience in software development
- Proficiency in Python, JavaScript, or Go
- Experience with cloud platforms (AWS, GCP, Azure)
- Strong problem-solving skills
- Excellent communication abilities

Responsibilities:
- Design and implement scalable systems
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews
```

## Configuration Tips

### Using GPU for faster transcription

If you have an NVIDIA GPU, edit backend/.env:

```env
WHISPER_DEVICE=cuda
```

Then install CUDA-enabled dependencies:
```bash
pip install faster-whisper[cuda]
```

### Increase file size limits

Edit backend/.env:
```env
MAX_PDF_SIZE_MB=20
MAX_AUDIO_SIZE_MB=100
```

---

**Happy interviewing! 🎯🎙️**
