"""Cloudflare R2 storage service using boto3."""

import logging
import tempfile
import uuid
from pathlib import Path
from typing import BinaryIO

import boto3
import pypdf
from app.core.config import settings
from botocore.exceptions import ClientError

logger = logging.getLogger(__name__)


class R2StorageService:
    """Service for Cloudflare R2 storage operations using S3-compatible API."""

    def __init__(self):
        """Initialize R2 storage service with boto3 client."""
        self.bucket_name = settings.r2_bucket_name
        self.public_url = settings.r2_public_url

        # Initialize S3 client for R2
        self.s3_client = boto3.client(
            's3',
            endpoint_url=settings.r2_endpoint_url,
            aws_access_key_id=settings.r2_access_key_id,
            aws_secret_access_key=settings.r2_secret_access_key,
            region_name='auto',  # R2 uses 'auto' for region
        )

        logger.info(f'R2 storage initialized with bucket: {self.bucket_name}')

    async def save_pdf(self, file: BinaryIO, filename: str) -> tuple[str, str]:
        """
        Save PDF file to R2 and extract text.

        Args:
            file: File object to save
            filename: Original filename

        Returns:
            Tuple of (r2_key, extracted_text)

        Raises:
            Exception: If file save or text extraction fails
        """
        try:
            # Generate unique filename
            file_ext = Path(filename).suffix
            unique_filename = f'{uuid.uuid4()}{file_ext}'
            r2_key = f'pdfs/{unique_filename}'

            # Read file content
            content = file.read()

            # Upload to R2
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=r2_key,
                Body=content,
                ContentType='application/pdf',
            )

            logger.info(f'PDF saved to R2: {r2_key}')

            # Extract text from PDF (need to save temporarily for pypdf)
            with tempfile.NamedTemporaryFile(suffix='.pdf', delete=False) as temp_file:
                temp_file.write(content)
                temp_path = temp_file.name

            try:
                extracted_text = self.extract_pdf_text(temp_path)
            finally:
                # Clean up temporary file
                Path(temp_path).unlink(missing_ok=True)

            return r2_key, extracted_text

        except ClientError as e:
            logger.error(f'Error saving PDF to R2: {e}')
            raise Exception(f'Failed to save PDF to R2: {str(e)}')
        except Exception as e:
            logger.error(f'Error saving PDF: {e}')
            raise

    def extract_pdf_text(self, pdf_path: str) -> str:
        """
        Extract text from PDF file.

        Args:
            pdf_path: Path to PDF file

        Returns:
            Extracted text as string
        """
        try:
            reader = pypdf.PdfReader(pdf_path)
            text_parts = []

            for page in reader.pages:
                text = page.extract_text()
                if text:
                    text_parts.append(text)

            full_text = '\n'.join(text_parts).strip()

            logger.info(f'Extracted {len(full_text)} characters from PDF')
            return full_text

        except Exception as e:
            logger.error(f'Error extracting PDF text: {e}')
            raise Exception('Failed to extract text from PDF')

    async def save_audio(self, file: BinaryIO, filename: str) -> str:
        """
        Save audio file to R2.

        Args:
            file: File object to save
            filename: Original filename

        Returns:
            R2 key (path) to saved file

        Raises:
            Exception: If file save fails
        """
        try:
            # Generate unique filename
            file_ext = Path(filename).suffix or '.webm'
            unique_filename = f'{uuid.uuid4()}{file_ext}'
            r2_key = f'audio/{unique_filename}'

            # Read file content
            content = file.read()

            # Determine content type
            content_type = 'audio/webm'
            if file_ext == '.ogg':
                content_type = 'audio/ogg'
            elif file_ext == '.wav':
                content_type = 'audio/wav'

            # Upload to R2
            self.s3_client.put_object(
                Bucket=self.bucket_name,
                Key=r2_key,
                Body=content,
                ContentType=content_type,
            )

            logger.info(f'Audio saved to R2: {r2_key}')
            return r2_key

        except ClientError as e:
            logger.error(f'Error saving audio to R2: {e}')
            raise Exception(f'Failed to save audio to R2: {str(e)}')
        except Exception as e:
            logger.error(f'Error saving audio: {e}')
            raise

    def delete_file(self, r2_key: str) -> None:
        """
        Delete a file from R2 storage.

        Args:
            r2_key: R2 key (path) to file to delete
        """
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=r2_key)
            logger.info(f'Deleted file from R2: {r2_key}')
        except ClientError as e:
            logger.error(f'Error deleting file {r2_key} from R2: {e}')

    def get_file_url(self, r2_key: str) -> str:
        """
        Get public URL for a file in R2.

        Args:
            r2_key: R2 key (path) to file

        Returns:
            Public URL to the file
        """
        if self.public_url:
            return f'{self.public_url}/{r2_key}'
        else:
            # Generate presigned URL (valid for 1 hour)
            try:
                url = self.s3_client.generate_presigned_url(
                    'get_object',
                    Params={'Bucket': self.bucket_name, 'Key': r2_key},
                    ExpiresIn=3600,
                )
                return url
            except ClientError as e:
                logger.error(f'Error generating presigned URL: {e}')
                raise

    async def download_file(self, r2_key: str) -> bytes:
        """
        Download a file from R2.

        Args:
            r2_key: R2 key (path) to file

        Returns:
            File content as bytes
        """
        try:
            response = self.s3_client.get_object(Bucket=self.bucket_name, Key=r2_key)
            content = response['Body'].read()
            logger.info(f'Downloaded file from R2: {r2_key}')
            return content
        except ClientError as e:
            logger.error(f'Error downloading file {r2_key} from R2: {e}')
            raise Exception(f'Failed to download file from R2: {str(e)}')
