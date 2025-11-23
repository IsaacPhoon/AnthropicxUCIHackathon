'use client';

import React, { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { jobDescriptionsAPI, responsesAPI } from "@/services/api";
import { useAudioRecorder } from "@/hooks/useAudioRecorder";
import type { Response as EvaluationResponse } from "@/types";
import { ProtectedRoute } from "@/components/ProtectedRoute";

function PracticeContent() {
  const params = useParams();
  const jobDescriptionId = params.jobDescriptionId as string;
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [initialIndexSet, setInitialIndexSet] = useState(false);
  const [isViewingHistory, setIsViewingHistory] = useState(false);
  const [selectedResponseId, setSelectedResponseId] = useState<string | null>(null);

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions", jobDescriptionId],
    queryFn: () => jobDescriptionsAPI.getQuestions(jobDescriptionId!),
    enabled: !!jobDescriptionId,
  });

  // Get current question
  const currentQuestion = questions?.[currentQuestionIndex];

  // Fetch all responses for current question if it has been answered
  const { data: previousResponses, isLoading: isLoadingResponse } = useQuery({
    queryKey: ["responses", currentQuestion?.id],
    queryFn: () => responsesAPI.list(currentQuestion!.id),
    enabled: !!currentQuestion && (currentQuestion.attempts_count ?? 0) > 0,
    retry: false,
  });

  // Set initial question index to first unanswered question
  useEffect(() => {
    if (questions && questions.length > 0 && !initialIndexSet) {
      const firstUnanswered = questions.findIndex(
        (q) => !q.attempts_count || q.attempts_count === 0
      );
      if (firstUnanswered !== -1) {
        setCurrentQuestionIndex(firstUnanswered);
      }
      setInitialIndexSet(true);
    }
  }, [questions, initialIndexSet]);

  // Load latest response when changing questions
  useEffect(() => {
    if (previousResponses && previousResponses.length > 0) {
      const latestResponse = previousResponses[0]; // Already sorted by created_at desc
      setSelectedResponseId(latestResponse.response_id);
      setEvaluation(latestResponse);
      setIsViewingHistory(true);
    } else {
      setSelectedResponseId(null);
      setEvaluation(null);
      setIsViewingHistory(false);
    }
    clearRecording();
  }, [currentQuestionIndex, previousResponses]);

  // Update evaluation when selected response changes
  useEffect(() => {
    if (selectedResponseId && previousResponses) {
      const selected = previousResponses.find(r => r.response_id === selectedResponseId);
      if (selected) {
        setEvaluation(selected);
        setIsViewingHistory(true);
      }
    }
  }, [selectedResponseId, previousResponses]);

  const {
    isRecording,
    isInitializing,
    audioBlob,
    audioURL,
    startRecording,
    stopRecording,
    clearRecording,
    error: recordingError,
  } = useAudioRecorder();

  const submitMutation = useMutation({
    mutationFn: ({
      questionId,
      audioFile,
    }: {
      questionId: string;
      audioFile: File;
    }) => responsesAPI.submit(questionId, audioFile),
    onSuccess: (data) => {
      setEvaluation(data);
      setIsViewingHistory(false);
      // Invalidate questions query to update attempts_count
      // This will refresh the data but won't change currentQuestionIndex
    },
  });

  const handleSubmit = () => {
    if (!audioBlob || !questions) return;

    const currentQuestion = questions[currentQuestionIndex];
    const audioFile = new File([audioBlob], "response.webm", {
      type: "audio/webm",
    });

    submitMutation.mutate({
      questionId: currentQuestion.id,
      audioFile,
    });
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleNextQuestion = () => {
    if (!questions) return;
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      router.push("/dashboard");
    }
  };

  const handleTryAgain = () => {
    setEvaluation(null);
    setIsViewingHistory(false);
    clearRecording();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading questions...</p>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mb-4">No questions found</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard")}
            className="text-primary-600 hover:text-primary-500 dark:text-primary-400 mb-4"
          >
            ← Back to Dashboard
          </button>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Interview Practice
            </h1>
            <span className="text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
          </div>
          {/* Question Navigation */}
          <div className="flex gap-2 justify-center">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ← Previous
            </button>
            <button
              onClick={handleNextQuestion}
              disabled={currentQuestionIndex === questions.length - 1}
              className="btn btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Question Card */}
        <div className="card mb-8">
          <div className="mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {currentQuestion.question_text}
            </h2>
            {previousResponses && previousResponses.length > 0 && (
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  View Response:
                </label>
                <select
                  value={selectedResponseId || ""}
                  onChange={(e) => setSelectedResponseId(e.target.value)}
                  className="form-select rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white text-sm"
                >
                  {previousResponses.map((response, index) => (
                    <option key={response.response_id} value={response.response_id}>
                      Attempt {previousResponses.length - index} - {new Date(response.created_at).toLocaleDateString()} {new Date(response.created_at).toLocaleTimeString()}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Recording Interface */}
          <div className="space-y-4">
            {recordingError && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {recordingError}
              </div>
            )}

            {!evaluation && !isLoadingResponse && (
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center">
                {!audioBlob ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <button
                        onClick={isRecording ? stopRecording : startRecording}
                        disabled={isInitializing}
                        className={`w-24 h-24 rounded-full flex items-center justify-center ${
                          isRecording
                            ? "bg-red-600 hover:bg-red-700 animate-pulse"
                            : isInitializing
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-primary-600 hover:bg-primary-700"
                        }`}
                      >
                        <div className="text-white text-3xl">
                          {isInitializing ? "⏳" : isRecording ? "⏸" : "🎙️"}
                        </div>
                      </button>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300">
                      {isInitializing
                        ? "Initializing microphone..."
                        : isRecording
                        ? "Recording... Click to stop"
                        : "Click to start recording"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <p className="text-green-600 dark:text-green-400">
                      ✓ Recording complete
                    </p>
                    {audioURL && (
                      <audio
                        src={audioURL}
                        controls
                        className="w-full"
                        preload="metadata"
                        onLoadedMetadata={(e) => {
                          // Force the audio player to update its display
                          const audio = e.currentTarget;
                          audio.currentTime = 0;
                        }}
                      />
                    )}
                    <div className="flex gap-4">
                      <button
                        onClick={clearRecording}
                        className="btn btn-secondary flex-1"
                      >
                        Record Again
                      </button>
                      <button
                        onClick={handleSubmit}
                        disabled={submitMutation.isPending}
                        className="btn btn-primary flex-1"
                      >
                        {submitMutation.isPending
                          ? "Submitting..."
                          : "Submit Response"}
                      </button>
                    </div>
                    {submitMutation.isPending && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Transcribing and evaluating... This may take 10-30
                        seconds.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Evaluation Results */}
        {evaluation && (
          <div className="space-y-6">
            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Your Response
              </h3>
              <p className="text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 p-4 rounded">
                {evaluation.transcript}
              </p>
            </div>

            <div className="card">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Evaluation Scores
              </h3>
              <div className="space-y-4">
                {Object.entries(evaluation.scores).map(([key, value]) => (
                  <div key={key}>
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {key.replace("_", " ")}
                      </span>
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {value}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full"
                        style={{ width: `${(value / 10) * 100}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                      {
                        evaluation.feedback[
                          key as keyof typeof evaluation.feedback
                        ]
                      }
                    </p>
                  </div>
                ))}
              </div>
              {evaluation.overall_comment && (
                <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900 rounded">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Overall Feedback
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {evaluation.overall_comment}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-4">
              {isViewingHistory && (
                <button
                  onClick={handleTryAgain}
                  className="btn btn-secondary flex-1"
                >
                  Try Again
                </button>
              )}
              <button
                onClick={handleNextQuestion}
                className={`btn btn-primary ${isViewingHistory ? 'flex-1' : 'w-full'}`}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Back to Dashboard"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function PracticePage() {
  return (
    <ProtectedRoute>
      <PracticeContent />
    </ProtectedRoute>
  );
}
