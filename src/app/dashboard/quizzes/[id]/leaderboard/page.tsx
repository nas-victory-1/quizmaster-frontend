"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Trophy,
  Medal,
  Award,
  ArrowLeft,
  Share2,
  Download,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { getSessionById } from "@/api/session";

interface LeaderboardEntry {
  participantId: string;
  name: string;
  totalScore: number;
  correctAnswers: number;
  totalQuestions: number;
  accuracy: number;
  rank: number;
}

interface Participant {
  id: string;
  name: string;
  score: number;
}

interface SessionResponse {
  sessionId: string;
  title: string;
  code: string;
  createdAt: string;
  questions: unknown[];
  participants: Participant[];
}

interface QuizData {
  id: string;
  title: string;
  code: string;
  completedAt: string;
  totalQuestions: number;
}

export default function LeaderboardPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSessionById(sessionId, true);

        if (response.success) {
          const session: SessionResponse = response.data;
          setQuiz({
            id: session.sessionId,
            title: session.title,
            code: session.code,
            completedAt: session.createdAt,
            totalQuestions: session.questions?.length || 0,
          });

          // Create leaderboard from participants with real scores (1 point per correct answer)
          const entries = session.participants
            .map((participant) => {
              // Use actual score from participant data (should be number of correct answers)
              const correctAnswers = participant.score || 0;
              const totalQuestions = session.questions?.length || 0;
              const accuracy =
                totalQuestions > 0
                  ? Math.round((correctAnswers / totalQuestions) * 100)
                  : 0;

              return {
                participantId: participant.id,
                name: participant.name,
                totalScore: correctAnswers, // 1 point per correct answer
                correctAnswers: correctAnswers,
                totalQuestions: totalQuestions,
                accuracy: accuracy,
                rank: 0,
              };
            })
            .sort((a, b) => b.totalScore - a.totalScore) // Sort by score (highest first)
            .map((entry, index) => ({
              ...entry,
              rank: index + 1,
            }));

          setLeaderboard(entries);
        }
      } catch (error) {
        console.error("Error fetching leaderboard:", error);
        router.push("/dashboard/quizzes");
      } finally {
        setLoading(false);
      }
    };

    if (sessionId) {
      fetchData();
    }
  }, [sessionId, router]);

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="h-8 w-8 text-yellow-500" />;
      case 2:
        return <Medal className="h-8 w-8 text-gray-400" />;
      case 3:
        return <Award className="h-8 w-8 text-amber-600" />;
      default:
        return (
          <div className="h-8 w-8 flex items-center justify-center text-lg font-bold text-gray-500 bg-gray-100 rounded-full">
            {rank}
          </div>
        );
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 80) return "bg-green-100 text-green-800";
    if (accuracy >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const shareLeaderboard = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Leaderboard link copied to clipboard!");
  };

  const exportLeaderboard = () => {
    if (!leaderboard.length) return;

    const csvContent = [
      ["Rank", "Name", "Score", "Correct Answers", "Accuracy"].join(","),
      ...leaderboard.map((entry) =>
        [
          entry.rank,
          entry.name,
          entry.totalScore,
          `${entry.correctAnswers}/${entry.totalQuestions}`,
          `${entry.accuracy}%`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${quiz?.title || "quiz"}_leaderboard.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading leaderboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">Quiz not found</p>
          <Button
            onClick={() => router.push("/dashboard/quizzes")}
            className="mt-4"
          >
            Back to Dashboard
          </Button>
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
              <span className="text-sm font-medium">Leaderboard</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Leaderboard</h1>
            <p className="text-gray-600 mt-1">
              Final rankings for {quiz.title}
            </p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
              <span>
                Quiz Code: <Badge variant="outline">{quiz.code}</Badge>
              </span>
              <span>{leaderboard.length} participants</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={exportLeaderboard}
              disabled={!leaderboard.length}
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={shareLeaderboard}>
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            <Link href="/dashboard/quizzes">
              <Button variant="outline" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            </Link>
          </div>
        </div>

        {/* Leaderboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Final Rankings
            </CardTitle>
            <CardDescription>
              {leaderboard.length} participants completed the quiz
            </CardDescription>
          </CardHeader>
          <CardContent>
            {leaderboard.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No participants completed this quiz
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {leaderboard.map((entry) => (
                  <div
                    key={entry.participantId}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      entry.rank === 1
                        ? "bg-gradient-to-r from-yellow-50 to-yellow-100 border-yellow-200"
                        : entry.rank === 2
                        ? "bg-gradient-to-r from-gray-50 to-gray-100 border-gray-200"
                        : entry.rank === 3
                        ? "bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200"
                        : "hover:bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex items-center justify-center w-12">
                        {getRankIcon(entry.rank)}
                      </div>

                      {/* Avatar and Info */}
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-purple-100 text-purple-700">
                          {entry.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-semibold text-gray-900">
                          {entry.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          Participant #{entry.rank}
                        </div>
                      </div>
                    </div>

                    {/* Score and Stats */}
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-600">
                        {entry.totalScore.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-2 justify-end mt-1">
                        <Badge
                          variant="secondary"
                          className={getAccuracyColor(entry.accuracy)}
                        >
                          {entry.accuracy}%
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {entry.correctAnswers}/{entry.totalQuestions}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        {leaderboard.length > 0 && (
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {leaderboard[0]?.name || "N/A"}
                  </div>
                  <p className="text-sm text-gray-600">First Place</p>
                  <p className="text-lg font-semibold text-purple-600 mt-1">
                    {leaderboard[0]?.totalScore.toLocaleString() || "0"} points
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.round(
                      leaderboard.reduce(
                        (sum, entry) => sum + entry.accuracy,
                        0
                      ) / leaderboard.length
                    )}
                    %
                  </div>
                  <p className="text-sm text-gray-600">Average Accuracy</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Across all {leaderboard.length} participants
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(
                      leaderboard.reduce(
                        (sum, entry) => sum + entry.totalScore,
                        0
                      ) / leaderboard.length
                    ).toLocaleString()}
                  </div>
                  <p className="text-sm text-gray-600">Average Score</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Out of {quiz.totalQuestions} questions
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
