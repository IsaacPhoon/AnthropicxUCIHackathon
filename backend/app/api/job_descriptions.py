"""Job description API endpoints."""
import logging
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.job_description import JobDescription, JobDescriptionStatus
from app.models.question import Question
from app.schemas.job_description import JobDescriptionResponse, JobDescriptionListResponse
from app.schemas.question import QuestionResponse
from app.services.storage_service import storage_service
from app.services.claude_service import claude_service

router = APIRouter(prefix="/api/job-descriptions", tags=["Job Descriptions"])
logger = logging.getLogger(__name__)


@router.post("", response_model=JobDescriptionResponse, status_code=status.HTTP_201_CREATED)
async def upload_job_description(
    file: UploadFile = File(...),
    company_name: str = Form(...),
    job_title: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Upload a job description PDF and generate interview questions.

    Args:
        file: PDF file upload
        company_name: Name of the company
        job_title: Job title/position
        current_user: Authenticated user
        db: Database session

    Returns:
        Created job description with status

    Raises:
        HTTPException: If file is invalid or processing fails
    """
    # Validate file type
    if not file.filename.lower().endswith('.pdf'):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File must be a PDF"
        )

    # Validate file size (max 10MB from settings)
    content = await file.read()
    await file.seek(0)  # Reset file pointer

    if len(content) > 10 * 1024 * 1024:  # 10MB
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="File size must be less than 10MB"
        )

    try:
        # Save PDF and extract text
        file_path, extracted_text = await storage_service.save_pdf(file.file, file.filename)

        # Create job description record
        job_description = JobDescription(
            user_id=current_user.id,
            company_name=company_name,
            job_title=job_title,
            file_path=file_path,
            extracted_text=extracted_text,
            status=JobDescriptionStatus.PENDING
        )

        db.add(job_description)
        db.commit()
        db.refresh(job_description)

        # Generate questions using Claude
        try:
            questions_list = claude_service.generate_questions(
                extracted_text,
                company_name,
                job_title
            )

            # Save questions to database
            for question_text in questions_list:
                question = Question(
                    job_description_id=job_description.id,
                    user_id=current_user.id,
                    question_text=question_text
                )
                db.add(question)

            # Update status to success
            job_description.status = JobDescriptionStatus.QUESTIONS_GENERATED
            db.commit()
            db.refresh(job_description)

            logger.info(f"Successfully generated {len(questions_list)} questions for job description {job_description.id}")

        except Exception as e:
            # Update status to error
            job_description.status = JobDescriptionStatus.ERROR
            job_description.error_message = str(e)
            db.commit()
            db.refresh(job_description)

            logger.error(f"Failed to generate questions: {e}")

        return job_description

    except Exception as e:
        logger.error(f"Error uploading job description: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Failed to process job description"
        )


@router.get("", response_model=List[JobDescriptionListResponse])
def list_job_descriptions(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    List all job descriptions for the authenticated user.

    Args:
        current_user: Authenticated user
        db: Database session

    Returns:
        List of user's job descriptions
    """
    job_descriptions = db.query(JobDescription).filter(
        JobDescription.user_id == current_user.id
    ).order_by(JobDescription.created_at.desc()).all()

    return job_descriptions


@router.get("/{job_description_id}/questions", response_model=List[QuestionResponse])
def get_questions(
    job_description_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Get all questions for a specific job description.

    Args:
        job_description_id: ID of the job description
        current_user: Authenticated user
        db: Database session

    Returns:
        List of questions

    Raises:
        HTTPException: If job description not found or unauthorized
    """
    # Verify job description belongs to user
    job_description = db.query(JobDescription).filter(
        JobDescription.id == job_description_id,
        JobDescription.user_id == current_user.id
    ).first()

    if not job_description:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Job description not found"
        )

    # Get questions
    questions = db.query(Question).filter(
        Question.job_description_id == job_description_id
    ).all()

    return questions
