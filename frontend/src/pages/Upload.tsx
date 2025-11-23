import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { jobDescriptionsAPI } from '@/services/api';

export const Upload: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      if (!file) throw new Error('No file selected');
      return jobDescriptionsAPI.upload(file, companyName, jobTitle);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['jobDescriptions'] });
      navigate('/dashboard');
    },
    onError: (err: any) => {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (!selectedFile.name.toLowerCase().endsWith('.pdf')) {
        setError('Please select a PDF file');
        setFile(null);
        return;
      }
      if (selectedFile.size > 10 * 1024 * 1024) {
        setError('File size must be less than 10MB');
        setFile(null);
        return;
      }
      setFile(selectedFile);
      setError('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !companyName || !jobTitle) {
      setError('Please fill in all fields');
      return;
    }
    mutation.mutate();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 mb-4"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Upload Job Description
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Upload a PDF job description to generate tailored interview questions
          </p>
        </div>

        <form onSubmit={handleSubmit} className="card space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Company Name
            </label>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g., Google, Microsoft, Startup Inc."
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Title
            </label>
            <input
              type="text"
              required
              className="input"
              placeholder="e.g., Senior Software Engineer, Product Manager"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Job Description PDF
            </label>
            <input
              type="file"
              accept=".pdf"
              required
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100
                dark:file:bg-primary-900 dark:file:text-primary-200"
            />
            <p className="mt-1 text-sm text-gray-500">
              PDF file, max 10MB
            </p>
            {file && (
              <p className="mt-2 text-sm text-green-600">
                Selected: {file.name}
              </p>
            )}
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              className="btn btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={mutation.isPending || !file}
              className="btn btn-primary flex-1"
            >
              {mutation.isPending ? 'Uploading...' : 'Upload & Generate Questions'}
            </button>
          </div>

          {mutation.isPending && (
            <div className="text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Uploading and generating interview questions...</p>
              <p className="mt-1">This may take 10-30 seconds.</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
