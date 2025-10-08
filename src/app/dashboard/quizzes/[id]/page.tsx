"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Copy,
  Users,
  FileText,
  Settings,
  Eye,
  Edit,
  Share2,
  CheckCircle2,
  Clock,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useParams } from "next/navigation";
import { Quiz } from "@/types/types";

export default function QuizDetailsPage() {
  const params = useParams();
  const id = params.id as string;
  const [copied, setCopied] = useState(false);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/dashboard/quizzes/${id}`
        );
        if (!response.ok) throw new Error("Failed to fetch quiz");
        const data = await response.json();
        setQuiz(data);
      } catch (error) {
        console.error("Error fetching quiz:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchQuiz();
    }
  }, [id]);

  const copyAccessCode = () => {
    if (!quiz) return;
    navigator.clipboard.writeText(quiz._id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copyQuizLink = () => {
    if (!quiz) return;
    const link = `${window.location.origin}/join-quiz?code=${quiz._id}`;
    navigator.clipboard.writeText(link);
    alert("Quiz link copied to clipboard!");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "live":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      case "published":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading quiz details...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!quiz) {
    return (
      <DashboardLayout>
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Quiz not found</p>
            <Link href="/dashboard/quizzes">
              <Button>Back to Quizzes</Button>
            </Link>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  const totalTime = quiz.questions.reduce((sum, q) => sum + q.timeLimit, 0);

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
              <span className="text-sm font-medium">{quiz.title}</span>
            </div>
            <h1 className="text-3xl font-bold">{quiz.title}</h1>
            <p className="text-gray-600 mt-1">{quiz.description}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(quiz.status)}>
              {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-2">
          <Link href={`/dashboard/quizzes/${quiz._id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Quiz
            </Button>
          </Link>
          <Link href={`/dashboard/quizzes/${quiz._id}/preview`}>
            <Button variant="outline" size="sm">
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
          </Link>
          <Button variant="outline" size="sm" onClick={copyQuizLink}>
            <Share2 className="h-4 w-4 mr-2" />
            Share Link
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quiz Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Access Code & Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quiz Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quiz ID as Access Code */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Quiz ID (Share this for participants to join)
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border font-mono text-sm break-all">
                      {quiz._id}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAccessCode}
                      className={copied ? "text-green-600" : ""}
                    >
                      {copied ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Participants can use this ID to join the quiz
                  </p>
                </div>

                <Separator />

                {/* Quiz Stats */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      Questions
                    </label>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                      <div className="font-medium text-2xl">
                        {quiz.questions.length}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total questions
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Total Duration
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="font-medium text-2xl">
                        {Math.ceil(totalTime / 60)}m
                      </div>
                      <div className="text-xs text-gray-500">
                        ~{totalTime} seconds total
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Questions Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Questions Overview
                </CardTitle>
                <CardDescription>
                  Preview of all questions in this quiz
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quiz.questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-medium mb-1">
                            {index + 1}. {question.text}
                          </div>
                          <div className="text-sm text-gray-500">
                            {question.options.length} options •{" "}
                            {question.timeLimit}s
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {question.timeLimit}s
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Users className="h-4 w-4" />
                    Participants
                  </div>
                  <div className="font-bold text-lg">
                    {quiz.participants || 0}
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    Questions
                  </div>
                  <div className="font-bold">{quiz.questions.length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <div className="font-bold">{Math.ceil(totalTime / 60)}m</div>
                </div>
                <Separator />
                <div className="text-xs text-gray-500">
                  Created {new Date(quiz.createdAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>

            {/* Quiz Settings */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Leaderboard</span>
                  <span
                    className={
                      quiz.settings.leaderboard
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {quiz.settings.leaderboard ? "✓ Enabled" : "✗ Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Shuffle Questions</span>
                  <span
                    className={
                      quiz.settings.shuffle ? "text-green-600" : "text-gray-400"
                    }
                  >
                    {quiz.settings.shuffle ? "✓ Enabled" : "✗ Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Review Answers</span>
                  <span
                    className={
                      quiz.settings.reviewAnswers
                        ? "text-green-600"
                        : "text-gray-400"
                    }
                  >
                    {quiz.settings.reviewAnswers ? "✓ Enabled" : "✗ Disabled"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
