"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  PlusCircle,
  Clock,
  Users,
  BarChart,
  Edit,
  Trash2,
  ExternalLink,
  PlayCircle,
} from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAllQuizzes } from "@/api/quiz";
import { createQuizSession } from "@/api/session";

interface Quiz {
  _id: string;
  title: string;
  description: string;
  category: string;
  questions: any[];
  status: string;
  createdAt: string;
  participants: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const [authChecking, setAuthChecking] = useState(true);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(false);
  const [creatingSession, setCreatingSession] = useState<string | null>(null);

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthChecking(false);
      fetchQuizzes();
    }
  }, [router]);

  // Fetch quizzes from API
  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await getAllQuizzes();
      if (response.data.success) {
        setQuizzes(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Start a live quiz session
  const startLiveSession = async (quiz: Quiz) => {
    try {
      setCreatingSession(quiz._id);

      // Get user data from localStorage (added this line)
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      const sessionResponse = await createQuizSession({
        title: quiz.title,
        questions: quiz.questions,
        creatorId: userData.id || "temp-user", // Now userData is defined!
      });

      if (sessionResponse.success) {
        localStorage.setItem("isCreator", "true");
        localStorage.setItem("quizTitle", quiz.title);
        localStorage.setItem("quizCode", sessionResponse.data.code);
        localStorage.setItem("sessionId", sessionResponse.data.sessionId);

        router.push(`/quiz/${sessionResponse.data.sessionId}/waiting`);
      } else {
        alert("Failed to create quiz session. Please try again.");
      }
    } catch (error) {
      console.error("Error creating session:", error);
      alert("Failed to create quiz session. Please try again.");
    } finally {
      setCreatingSession(null);
    }
  };

  // Delete quiz
  const deleteQuiz = async (quizId: string) => {
    if (confirm("Are you sure you want to delete this quiz?")) {
      try {
        // TODO: Implement delete API call
        setQuizzes((prev) => prev.filter((quiz) => quiz._id !== quizId));
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  if (authChecking) {
    return null;
  }

  const totalQuestions = quizzes.reduce(
    (sum, quiz) => sum + quiz.questions.length,
    0
  );
  const completedQuizzes = quizzes.filter(
    (quiz) => quiz.status === "published"
  ).length;

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">
            Manage your quizzes and create live sessions
          </p>
        </div>
        <Link href="/dashboard/create-quiz">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Quiz
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{quizzes.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalQuestions}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Published Quizzes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{completedQuizzes}</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Quizzes */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Quizzes</h2>
          <Link href="/dashboard/quizzes">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {quizzes.slice(0, 3).map((quiz) => (
              <Card key={quiz._id} className="overflow-hidden relative">
                {creatingSession === quiz._id && (
                  <div className="absolute inset-0 bg-white/80 flex items-center justify-center z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        Creating session...
                      </p>
                    </div>
                  </div>
                )}

                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{quiz.title}</CardTitle>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        quiz.status === "published"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {quiz.status === "published" ? "Published" : "Draft"}
                    </div>
                  </div>
                  <CardDescription className="line-clamp-2">
                    {quiz.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pb-2">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>{quiz.participants}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Created {new Date(quiz.createdAt).toLocaleDateString()}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between pt-2">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/create-quiz?edit=${quiz._id}`}>
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-1" /> Edit
                      </Button>
                    </Link>

                    {quiz.status === "published" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startLiveSession(quiz)}
                        disabled={creatingSession === quiz._id}
                      >
                        <PlayCircle className="h-4 w-4 mr-1" /> Start Live
                      </Button>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => deleteQuiz(quiz._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}

            {/* Create New Quiz Card */}
            <Card className="border-dashed flex flex-col items-center justify-center p-6">
              <div className="rounded-full bg-purple-100 p-3 mb-4">
                <PlusCircle className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Quiz</h3>
              <p className="text-gray-500 text-center mb-4">
                Build interactive quizzes for live sessions
              </p>
              <Link href="/dashboard/create-quiz">
                <Button className="bg-purple-600 hover:bg-purple-700">
                  Create Quiz
                </Button>
              </Link>
            </Card>
          </div>
        )}

        {/* {!loading && quizzes.length === 0 && (
          <Card className="border-dashed flex flex-col items-center justify-center p-12 mt-10">
            <div className="rounded-full bg-purple-100 p-4 mb-4">
              <PlusCircle className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">No quizzes yet</h3>
            <p className="text-gray-500 text-center mb-6">
              Create your first quiz to get started with live quiz sessions
            </p>
            <Link href="/dashboard/create-quiz">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Quiz
              </Button>
            </Link>
          </Card>
        )} */}
      </div>
    </DashboardLayout>
  );
}
