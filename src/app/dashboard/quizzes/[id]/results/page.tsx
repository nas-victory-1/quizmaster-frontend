"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Target,
  TrendingUp,
  Download,
  Share2,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getSessionById } from "@/api/session";

interface QuizResult {
  participantId: string;
  name: string;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  averageTimePerQuestion: number;
  completionTime: string;
  answers: {
    questionIndex: number;
    question: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
    pointsEarned: number;
  }[];
}

interface QuizSession {
  _id: string;
  title: string;
  code: string;
  questions: {
    question: string;
    options: string[];
    correctAnswer: number;
    timeLimit?: number;
  }[];
  participants: {
    id: string;
    name: string;
    joinedAt: Date;
    score: number;
  }[];
  status: "waiting" | "active" | "finished";
  createdAt: Date;
}

interface QuizAnalytics {
  totalParticipants: number;
  averageScore: number;
  averageAccuracy: number;
  averageCompletionTime: number;
  completionRate: number;
  questionAnalytics: {
    questionIndex: number;
    question: string;
    correctAnswers: number;
    totalAnswers: number;
    accuracy: number;
    options: {
      text: string;
      count: number;
      percentage: number;
    }[];
  }[];
}

export default function QuizResultsPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  // const [selectedTab, setSelectedTab] = useState("leaderboard");
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<QuizSession | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [analytics, setAnalytics] = useState<QuizAnalytics | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);

        // Fetch session data
        const response = await getSessionById(sessionId, true); // true for creator view

        if (response.success) {
          const sessionData = response.data as QuizSession;
          setSession(sessionData);

          // Process results from participants
          const processedResults = sessionData.participants
            .map((participant) => {
              // Calculate accuracy and other metrics
              // Note: You'll need to store actual answer data in your session model
              // For now, we'll use mock calculations
              const correctAnswers = Math.floor(
                Math.random() * sessionData.questions.length
              );
              const accuracy =
                (correctAnswers / sessionData.questions.length) * 100;

              return {
                participantId: participant.id,
                name: participant.name,
                totalScore: participant.score || Math.floor(Math.random() * 1),
                correctAnswers,
                totalQuestions: sessionData.questions.length,
                accuracy,
                averageTimePerQuestion: 15 + Math.random() * 10,
                completionTime: new Date().toISOString(),
                answers: [], // You'll need to implement answer tracking
              } as QuizResult;
            })
            .sort((a, b) => b.totalScore - a.totalScore); // Sort by score descending

          setResults(processedResults);

          // Calculate analytics
          const totalParticipants = processedResults.length;
          const averageScore =
            processedResults.reduce((sum, r) => sum + r.totalScore, 0) /
              totalParticipants || 0;
          const averageAccuracy =
            processedResults.reduce((sum, r) => sum + r.accuracy, 0) /
              totalParticipants || 0;
          const averageCompletionTime =
            processedResults.reduce(
              (sum, r) => sum + r.averageTimePerQuestion,
              0
            ) / totalParticipants || 0;

          // Generate question analytics
          const questionAnalytics = sessionData.questions.map(
            (question, index) => {
              // Mock analytics - you'll need to implement real answer tracking
              const correctAnswers = Math.floor(
                totalParticipants * (0.5 + Math.random() * 0.5)
              );
              const accuracy =
                totalParticipants > 0
                  ? (correctAnswers / totalParticipants) * 100
                  : 0;

              return {
                questionIndex: index,
                question: question.question,
                correctAnswers,
                totalAnswers: totalParticipants,
                accuracy,
                options: question.options.map((option, optIndex) => {
                  const isCorrect = optIndex === question.correctAnswer;
                  const count = isCorrect
                    ? correctAnswers
                    : Math.floor(
                        Math.random() * (totalParticipants - correctAnswers)
                      );
                  return {
                    text: option,
                    count,
                    percentage:
                      totalParticipants > 0
                        ? (count / totalParticipants) * 100
                        : 0,
                  };
                }),
              };
            }
          );

          setAnalytics({
            totalParticipants,
            averageScore,
            averageAccuracy,
            averageCompletionTime,
            completionRate: 100, // All participants who joined completed
            questionAnalytics,
          });
        } else {
          console.error("Failed to fetch session results");
          router.push("/dashboard/quizzes");
        }
      } catch (error) {
        console.error("Error fetching results:", error);
        router.push("/dashboard/quizzes");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchResults();
    }
  }, [sessionId, router]);

  // const getRankIcon = (rank: number) => {
  //   switch (rank) {
  //     case 1:
  //       return <Trophy className="h-6 w-6 text-yellow-500" />;
  //     case 2:
  //       return <Medal className="h-6 w-6 text-gray-400" />;
  //     case 3:
  //       return <Award className="h-6 w-6 text-amber-600" />;
  //     default:
  //       return (
  //         <div className="h-6 w-6 flex items-center justify-center text-sm font-bold text-gray-500">
  //           #{rank}
  //         </div>
  //       );
  //   }
  // };

  // const getAccuracyColor = (accuracy: number) => {
  //   if (accuracy >= 80) return "text-green-600";
  //   if (accuracy >= 60) return "text-yellow-600";
  //   return "text-red-600";
  // };

  const exportResults = () => {
    if (!results.length) return;

    // Create CSV content
    const headers = [
      "Rank",
      "Name",
      "Score",
      "Correct Answers",
      "Total Questions",
      "Accuracy",
      "Avg Time per Question",
    ];
    const csvContent = [
      headers.join(","),
      ...results.map((result, index) =>
        [
          index + 1,
          result.name,
          result.totalScore,
          result.correctAnswers,
          result.totalQuestions,
          `${result.accuracy}%`,
          `${result.averageTimePerQuestion.toFixed(1)}s`,
        ].join(",")
      ),
    ].join("\n");

    // Download CSV
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${session?.title || "quiz"}_results.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const shareResults = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Results link copied to clipboard!");
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading results...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!session) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardContent className="pt-6 text-center">
              <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-600 mb-2">
                Session Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                The quiz session could not be loaded
              </p>
              <Button onClick={() => router.push("/dashboard/quizzes")}>
                Back to Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link
                href="/dashboard/quizzes"
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                My Quizzes
              </Link>
              <span className="text-gray-300">/</span>
              <span className="text-sm font-medium">Results</span>
            </div>
            <h1 className="text-3xl font-bold">{session.title} - Results</h1>
            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
              <span>
                Quiz Code: <Badge variant="outline">{session.code}</Badge>
              </span>
              <span>
                Completed on{" "}
                {new Date(session.createdAt).toLocaleDateString("en-US", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportResults}
              disabled={!results.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={shareResults}>
              <Share2 className="h-4 w-4 mr-2" />
              Share Results
            </Button>
          </div>
        </div>

        {analytics && (
          <>
            {/* Quick Stats */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Participants
                      </p>
                      <p className="text-2xl font-bold">
                        {analytics.totalParticipants}
                      </p>
                    </div>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Average Score
                      </p>
                      <p className="text-2xl font-bold">
                        {Math.round(analytics.averageScore)}
                      </p>
                    </div>
                    <Target className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Average Accuracy
                      </p>
                      <p className="text-2xl font-bold">
                        {Math.round(analytics.averageAccuracy)}%
                      </p>
                    </div>
                    <TrendingUp className="h-8 w-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        Total Questions
                      </p>
                      <p className="text-2xl font-bold">
                        {session.questions.length}
                      </p>
                    </div>
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            {/*             
            <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="questions">Question Analysis</TabsTrigger>
              </TabsList>

              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="h-5 w-5" />
                      Final Rankings
                    </CardTitle>
                    <CardDescription>Participants ranked by total score</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {results.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No participants completed this quiz</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {results.map((result, index) => (
                          <div
                            key={result.participantId}
                            className={`flex items-center justify-between p-4 rounded-lg border ${
                              index === 0
                                ? "bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20"
                                : index === 1
                                  ? "bg-gray-50 border-gray-200 dark:bg-gray-800/50"
                                  : index === 2
                                    ? "bg-amber-50 border-amber-200 dark:bg-amber-900/20"
                                    : "hover:bg-gray-50 dark:hover:bg-gray-800/50"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className="flex items-center justify-center w-12">{getRankIcon(index + 1)}</div>
                              <Avatar className="h-12 w-12">
                                <AvatarFallback>
                                  {result.name
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-semibold">{result.name}</div>
                                <div className="text-sm text-gray-500">Participant #{index + 1}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-purple-600">{result.totalScore}</div>
                              <div className="text-sm text-gray-500">
                                {result.correctAnswers}/{result.totalQuestions} correct (
                                <span className={getAccuracyColor(result.accuracy)}>{result.accuracy.toFixed(0)}%</span>)
                              </div>
                              <div className="text-xs text-gray-400">
                                Avg: {result.averageTimePerQuestion.toFixed(1)}s per question
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

            </Tabs> */}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
