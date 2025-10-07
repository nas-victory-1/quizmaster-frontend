"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  Trophy,
  Square,
  SkipForward,
  AlertCircle,
} from "lucide-react";
import { useSocket } from "@/hooks/useSocket";
import { getSessionById, updateParticipantScore } from "@/api/session";

interface Question {
  question: string;
  options: string[];
  correctAnswer: number;
  timeLimit?: number;
}

interface Participant {
  id: string;
  name: string;
  hasAnswered?: boolean;
  score?: number;
  avatar?: string;
}

interface QuizData {
  title: string;
  questions: Question[];
  currentQuestion: number;
  totalQuestions: number;
  id?: string;
}

export default function QuizStart() {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.id;
  const [isCreator, setIsCreator] = useState(false);
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [hasAnswered, setHasAnswered] = useState(false);
  const [quizEnded, setQuizEnded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [currentScore, setCurrentScore] = useState(0);

  const { socket } = useSocket(sessionId as string);

  // Calculate score based on answers
  const calculateScore = () => {
    if (!quizData) return 0;

    let score = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData.questions[index]?.correctAnswer) {
        // Base score + time bonus (if answer was quick)
        score += 1;
      }
    });
    return score;
  };

  // Initialize quiz data
  useEffect(() => {
    const initializeQuiz = async () => {
      try {
        const storedIsCreator = localStorage.getItem("isCreator") === "true";
        setIsCreator(storedIsCreator);

        const response = await getSessionById(
          sessionId as string,
          storedIsCreator
        );

        if (response.success) {
          const sessionData = response.data;
          setQuizData({
            title: sessionData.title,
            questions: sessionData.questions || [],
            currentQuestion: 0,
            totalQuestions: sessionData.questions?.length || 0,
            id: sessionData.sessionId,
          });

          // Initialize participants if creator
          if (storedIsCreator && sessionData.participants) {
            setParticipants(
              sessionData.participants.map((p: any) => ({
                ...p,
                hasAnswered: false,
              }))
            );
          }

          // Start first question if creator
          if (storedIsCreator && sessionData.questions?.length > 0) {
            startQuestion(0, sessionData.questions[0]);
          }
        }
      } catch (error) {
        console.error("Error initializing quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    initializeQuiz();
  }, [sessionId]);

  // Timer effect
  useEffect(() => {
    if (
      !quizData ||
      quizEnded ||
      showResults ||
      (isCreator && currentQuestionIndex >= quizData.questions.length)
    )
      return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Time's up - move to next question
          if (isCreator) {
            handleNextQuestion();
          } else {
            // Show results for participants
            setShowResults(true);
            setTimeout(() => {
              setShowResults(false);
            }, 3000); // Show results for 3 seconds
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [currentQuestionIndex, quizData, quizEnded, isCreator, showResults]);

  // Socket listeners for participants
  useEffect(() => {
    if (!socket || isCreator) return;

    const handleNewQuestion = (data: {
      question: Question;
      questionIndex: number;
      timeLimit: number;
    }) => {
      setCurrentQuestionIndex(data.questionIndex);
      setTimeLeft(data.timeLimit);
      setSelectedAnswer(null);
      setHasAnswered(false);
      setShowResults(false);
    };

    const handleQuizEnd = () => {
      setQuizEnded(true);
    };

    socket.on("new-question", handleNewQuestion);
    socket.on("quiz-ended", handleQuizEnd);

    return () => {
      socket.off("new-question", handleNewQuestion);
      socket.off("quiz-ended", handleQuizEnd);
    };
  }, [socket, isCreator]);

  // Update score when answers change
  useEffect(() => {
    setCurrentScore(calculateScore());
  }, [answers, quizData]);

  // Add this useEffect to join socket room when quiz starts
  useEffect(() => {
    if (socket && sessionId && !loading) {
      const storedIsCreator = localStorage.getItem("isCreator") === "true";
      const participantId = localStorage.getItem("participantId");
      const participantName = localStorage.getItem("participantName");

      // Join the socket room for quiz play
      socket.emit("join-quiz-room", {
        sessionId: sessionId as string,
        participantId: participantId || undefined,
        participantName: participantName || undefined,
        isCreator: storedIsCreator,
      });

      console.log("Joined quiz room:", sessionId);
    }
  }, [socket, sessionId, loading]);

  const startQuestion = (questionIndex: number, question: Question) => {
    const timeLimit = question.timeLimit || 30;
    setTimeLeft(timeLimit);
    setSelectedAnswer(null);
    setHasAnswered(false);
    setShowResults(false);

    // Reset participant answered status
    if (isCreator) {
      setParticipants((prev) =>
        prev.map((p) => ({ ...p, hasAnswered: false }))
      );
    }

    // Broadcast question to participants
    if (socket && isCreator) {
      socket.emit("next-question", {
        sessionId,
        question,
        questionIndex,
        timeLimit,
      });
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (hasAnswered || isCreator || showResults) return;

    setSelectedAnswer(answerIndex);
    setHasAnswered(true);

    // Store answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setAnswers(newAnswers);

    // Show results immediately after answering
    setShowResults(true);

    // Send answer to server
    if (socket) {
      socket.emit("submit-answer", {
        sessionId,
        participantId: localStorage.getItem("participantId"),
        questionIndex: currentQuestionIndex,
        answer: answerIndex,
        timeToAnswer:
          (quizData?.questions[currentQuestionIndex]?.timeLimit || 30) -
          timeLeft,
      });
    }
  };

  const handleNextQuestion = () => {
    if (!quizData || !isCreator) return;

    const nextIndex = currentQuestionIndex + 1;

    if (nextIndex >= quizData.questions.length) {
      // Quiz finished - save participant scores first
      setQuizEnded(true);
      if (socket) {
        socket.emit("end-quiz", { sessionId });
      }
      return;
    }
    setCurrentQuestionIndex(nextIndex);
    startQuestion(nextIndex, quizData.questions[nextIndex]);
  };

  const handleManualNext = () => {
    if (isCreator) {
      handleNextQuestion();
    }
  };

  const handleEndQuiz = async () => {
    if (isCreator) {
      setQuizEnded(true);
      if (socket) {
        socket.emit("end-quiz", { sessionId });
      }
    } else {
      // Participant - send their final score to backend
      if (quizData) {
        const finalScore = answers.filter(
          (answer, index) => answer === quizData.questions[index]?.correctAnswer
        ).length;

        try {
          await updateParticipantScore(
            sessionId as string,
            localStorage.getItem("participantId") as string,
            finalScore
          );
        } catch (error) {
          console.error("Failed to save final score:", error);
        }
      }

      setQuizEnded(true);
    }
  };

  // Listen for participant answers (creator only)
  useEffect(() => {
    if (!socket || !isCreator) return;

    const handleAnswerReceived = (data: { participantId: string }) => {
      setParticipants((prev) =>
        prev.map((p) =>
          p.id === data.participantId ? { ...p, hasAnswered: true } : p
        )
      );
    };

    socket.on("answer-received", handleAnswerReceived);

    return () => {
      socket.off("answer-received", handleAnswerReceived);
    };
  }, [socket, isCreator]);

  useEffect(() => {
    if (quizEnded && !isCreator && answers.length > 0 && quizData) {
      const finalScore = answers.filter(
        (answer, index) => answer === quizData.questions[index]?.correctAnswer
      ).length;

      const saveScore = async () => {
        try {
          await updateParticipantScore(
            sessionId as string,
            localStorage.getItem("participantId") as string,
            finalScore
          );
        } catch (error) {
          console.error("Failed to save final score:", error);
        }
      };

      saveScore();
    }
  }, [quizEnded, isCreator, answers, sessionId, quizData]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
            <p className="text-gray-600 mb-4">Failed to load quiz data</p>
            <Button onClick={() => router.push("/dashboard")}>
              Back to Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full">
          <CardContent className="pt-6 text-center">
            <Trophy className="h-20 w-20 text-yellow-500 mx-auto mb-6" />
            <h2 className="text-3xl font-bold mb-4">Quiz Complete!</h2>

            {!isCreator && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 mb-2">Your Final Score</p>
                <div className="text-4xl font-bold text-purple-600 mb-4">
                  {currentScore}
                </div>
                <p className="text-gray-500">
                  You answered{" "}
                  {
                    answers.filter(
                      (answer, index) =>
                        answer === quizData.questions[index]?.correctAnswer
                    ).length
                  }{" "}
                  out of {quizData.questions.length} questions correctly
                </p>
              </div>
            )}

            {isCreator && (
              <div className="mb-6">
                <p className="text-lg text-gray-600 mb-4">
                  Quiz session ended successfully
                </p>
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">
                      {participants.length}
                    </div>
                    <div className="text-sm text-gray-500">Participants</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      {quizData.questions.length}
                    </div>
                    <div className="text-sm text-gray-500">Questions</div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button
                onClick={() =>
                  router.push(`${isCreator ? "/dashboard" : "leaderboard"}`)
                }
              >
                {isCreator ? "Back to Dashboard" : "Exit Quiz"}
              </Button>
              {isCreator && quizData.id && (
                <Button
                  variant="outline"
                  onClick={() =>
                    router.push(`/dashboard/quizzes/${quizData.id}/leaderboard`)
                  }
                >
                  View Results
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const progressPercentage =
    ((currentQuestionIndex + 1) / quizData.totalQuestions) * 100;
  const timePercentage = currentQuestion
    ? (timeLeft / (currentQuestion.timeLimit || 30)) * 100
    : 0;

  if (!currentQuestion) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800">
            Loading question...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-background">
      {/* Header */}
      <div className="bg-white dark:bg-card border-b py-4">
        <div className="container flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">{quizData.title}</h1>
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {quizData.totalQuestions}
            </p>
          </div>
          {isCreator && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Host View
            </Badge>
          )}
        </div>
      </div>

      <div className="container py-6">
        <div className="max-w-4xl mx-auto">
          {/* Progress Bar */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium">Quiz Progress</span>
                <span className="text-sm text-gray-500">
                  {Math.round(progressPercentage)}%
                </span>
              </div>
              <Progress value={progressPercentage} className="h-2" />
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Main Quiz Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Timer */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center mb-4">
                    <div
                      className={`text-4xl font-bold ${
                        timeLeft <= 10 ? "text-red-600" : "text-purple-600"
                      }`}
                    >
                      {timeLeft}s
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Time remaining</p>
                  </div>
                  <Progress
                    value={timePercentage}
                    className={`h-2 ${
                      timeLeft <= 10
                        ? "[&>div]:bg-red-500"
                        : "[&>div]:bg-green-500"
                    }`}
                  />
                </CardContent>
              </Card>

              {/* Question */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-center">
                    {currentQuestion.question}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {showResults && !isCreator ? (
                    // Show results for participants
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg border-2 ${
                            index === currentQuestion.correctAnswer
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : selectedAnswer === index
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                              : "border-gray-200 bg-gray-50 dark:bg-gray-800"
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{option}</span>
                            {index === currentQuestion.correctAnswer && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                            {selectedAnswer === index &&
                              index !== currentQuestion.correctAnswer && (
                                <XCircle className="h-5 w-5 text-red-600" />
                              )}
                          </div>
                        </div>
                      ))}

                      <div className="text-center pt-4">
                        {selectedAnswer === currentQuestion.correctAnswer ? (
                          <div className="text-green-600 font-medium">
                            <CheckCircle2 className="h-6 w-6 mx-auto mb-2" />
                            Correct! +{1} point
                          </div>
                        ) : (
                          <div className="text-red-600 font-medium">
                            <XCircle className="h-6 w-6 mx-auto mb-2" />
                            {selectedAnswer !== null
                              ? "Incorrect"
                              : "Time's up!"}
                          </div>
                        )}
                        <p className="text-sm text-gray-500 mt-2">
                          Waiting for next question...
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Show answer options
                    <div className="grid gap-3 md:grid-cols-2">
                      {currentQuestion.options.map((option, index) => (
                        <Button
                          key={index}
                          variant={
                            selectedAnswer === index ? "default" : "outline"
                          }
                          className={`h-auto py-4 px-6 text-left justify-start ${
                            selectedAnswer === index
                              ? "bg-purple-600 hover:bg-purple-700"
                              : ""
                          } ${
                            isCreator ? "cursor-not-allowed opacity-60" : ""
                          }`}
                          onClick={() => handleAnswerSelect(index)}
                          disabled={isCreator || hasAnswered || showResults}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}

                  {/* Creator Controls */}
                  {isCreator && (
                    <div className="mt-6 pt-6 border-t">
                      <div className="text-center mb-4">
                        <p className="text-gray-600 mb-2">
                          {participants.filter((p) => p.hasAnswered).length} of{" "}
                          {participants.length} participants answered
                        </p>
                        <div className="flex justify-center gap-2">
                          <Button
                            onClick={handleNextQuestion}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <SkipForward className="h-4 w-4 mr-2" />
                            Next Question
                          </Button>
                          <Button variant="destructive" onClick={handleEndQuiz}>
                            <Square className="h-4 w-4 mr-2" />
                            End Quiz
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Participant Status */}
                  {!isCreator && !hasAnswered && !showResults && (
                    <div className="mt-6 text-center">
                      <p className="text-purple-600 font-medium flex items-center justify-center gap-2">
                        <Clock className="h-4 w-4" />
                        Select your answer above
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Current Score (for participants) */}
              {!isCreator && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Your Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {currentScore}
                      </div>
                      <p className="text-sm text-gray-500">
                        {
                          answers.filter(
                            (answer, index) =>
                              answer ===
                              quizData.questions[index]?.correctAnswer
                          ).length
                        }{" "}
                        correct answers
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Participants (for creators) */}
              {isCreator && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Participants ({participants.length})
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {participants.map((participant) => (
                        <div
                          key={participant.id}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback>
                                {participant.name.charAt(0)}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {participant.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {participant.hasAnswered ? (
                              <CheckCircle2 className="h-4 w-4 text-green-600" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-yellow-600" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quiz Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quiz Info</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Total Questions
                    </span>
                    <span className="font-medium">
                      {quizData.totalQuestions}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Current Question
                    </span>
                    <span className="font-medium">
                      {currentQuestionIndex + 1}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">
                      Time per Question
                    </span>
                    <span className="font-medium">
                      {currentQuestion.timeLimit || 30}s
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
