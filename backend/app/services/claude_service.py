"""Claude API service for question generation and response evaluation."""

from textwrap import dedent
from typing import Any, Dict, List

from anthropic import Anthropic
from app.core.config import settings
from pydantic import BaseModel, Field


# Pydantic models for structured outputs
class QuestionsList(BaseModel):
    """Schema for generated interview questions."""

    questions: List[str] = Field(
        ...,
        min_length=5,
        max_length=5,
        description='Exactly 5 behavioral interview questions',
    )


class Scores(BaseModel):
    """Schema for evaluation scores."""

    confidence: int = Field(..., ge=1, le=10, description='Confidence score 1-10')
    clarity_structure: int = Field(
        ..., ge=1, le=10, description='Clarity/Structure score 1-10'
    )
    technical_depth: int = Field(
        ..., ge=1, le=10, description='Technical depth score 1-10'
    )
    communication_skills: int = Field(
        ..., ge=1, le=10, description='Communication skills score 1-10'
    )
    relevance: int = Field(..., ge=1, le=10, description='Relevance score 1-10')


class Feedback(BaseModel):
    """Schema for evaluation feedback."""

    confidence: str = Field(..., description='Feedback on confidence')
    clarity_structure: str = Field(..., description='Feedback on clarity/structure')
    technical_depth: str = Field(..., description='Feedback on technical depth')
    communication_skills: str = Field(
        ..., description='Feedback on communication skills'
    )
    relevance: str = Field(..., description='Feedback on relevance')


class EvaluationResult(BaseModel):
    """Schema for complete evaluation result."""

    scores: Scores
    feedback: Feedback
    overall_comment: str = Field(
        ..., description='Overall assessment and improvement areas'
    )


class ClaudeService:
    """Service for interacting with Claude API."""

    def __init__(self):
        """Initialize Claude client."""
        self.client = Anthropic(api_key=settings.claude_api_key)
        self.model = settings.claude_model

    def generate_questions(
        self, job_description_text: str, company_name: str, job_title: str
    ) -> List[str]:
        """
        Generate 5 behavioral interview questions based on job description.

        Args:
            job_description_text: Extracted text from job description
            company_name: Name of the company
            job_title: Title of the job position

        Returns:
            List of 5 question strings

        Raises:
            Exception: If Claude API call fails
        """
        prompt = dedent(f"""\
            You are an expert interview coach. Based on the following job description, generate exactly 5 behavioral interview questions that are tailored to this specific role.

            Company: {company_name}
            Job Title: {job_title}

            Job Description:
            {job_description_text}

            Generate 5 behavioral interview questions that:
            1. Are specific to this role and company
            2. Follow the STAR method (Situation, Task, Action, Result)
            3. Test relevant competencies for this position
            4. Are clear and professionally worded
            5. Cover different aspects of the role
            """)

        response = self.client.beta.messages.parse(
            model=self.model,
            max_tokens=2000,
            betas=['structured-outputs-2025-11-13'],
            messages=[{'role': 'user', 'content': prompt}],
            output_format=QuestionsList,
        )

        if response.parsed_output is None:
            raise Exception('Failed to parse questions from Claude response')
        return response.parsed_output.questions

    def evaluate_response(
        self, job_description_text: str, question_text: str, transcript: str
    ) -> Dict[str, Any]:
        """
        Evaluate user's response using Claude API with structured outputs.

        Args:
            job_description_text: Original job description text
            question_text: The interview question
            transcript: User's transcribed response

        Returns:
            Dictionary containing scores and feedback

        Raises:
            Exception: If Claude API call fails
        """
        prompt = dedent(f"""\
            You are an expert interview coach evaluating a candidate's response to a behavioral interview question.

            Job Description:
            {job_description_text}

            Interview Question:
            {question_text}

            Candidate's Response:
            {transcript}

            Evaluate the response on the following criteria (score 1-10 for each):

            1. **Confidence**: How confident and self-assured does the candidate sound?
            2. **Clarity/Structure**: How well-structured and clear is the response? Does it follow STAR method?
            3. **Technical Depth**: How well does the response demonstrate relevant technical/domain knowledge?
            4. **Communication Skills**: How effectively does the candidate communicate their ideas?
            5. **Relevance/Alignment**: How well does the response align with the job requirements?

            For each category, provide:
            - A score from 1 to 10
            - Concise, actionable feedback (2-3 sentences)

            Also provide an overall comment summarizing the response quality and key areas for improvement.
            """)

        response = self.client.beta.messages.parse(
            model=self.model,
            max_tokens=3000,
            betas=['structured-outputs-2025-11-13'],
            messages=[{'role': 'user', 'content': prompt}],
            output_format=EvaluationResult,
        )

        if response.parsed_output is None:
            raise Exception('Failed to parse evaluation from Claude response')

        result = response.parsed_output

        # Convert to dictionary format expected by the API
        return {
            'scores': result.scores.model_dump(),
            'feedback': result.feedback.model_dump(),
            'overall_comment': result.overall_comment,
        }


# Global service instance
claude_service = ClaudeService()
