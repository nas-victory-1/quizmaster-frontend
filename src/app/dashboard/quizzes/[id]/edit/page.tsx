"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/DashboardLayout";
import { QuizData, Quiz } from "@/types/types";
import { useParams } from "next/navigation";
import Settings from "@/components/Settings";
import Questions from "@/components/Questions";
import QuizDetails from "@/components/QuizDetails";

export default function EditQuizPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [errors, setErrors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();
  const [error, setError] = useState<string | null>(null);

  const [quizData, setQuizData] = useState<QuizData>({
    title: "",
    description: "",
    category: "",
    questions: [],
    settings: {
      leaderboard: true,
      shuffle: false,
      reviewAnswers: true,
      date: "",
      time: "",
    },
  });

  useEffect(() => {
    if (!id) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/quiz/quizzes/${id}`
        );
        if (!res.ok) throw new Error("Failed to fetch quiz");
        const data: Quiz = await res.json();
        // setQuiz(data);
        setQuizData({
          title: data.title,
          description: data.description,
          category: data.category,
          questions: data.questions,
          settings: data.settings,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [id]);

  // safer typed update helpers
  const updateQuizData = <K extends keyof QuizData>(
    field: K,
    value: QuizData[K]
  ) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4" />
            <p className="text-gray-500">Loading quiz...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Link href="/dashboard/quizzes" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Edit Quiz</h1>
          <p className="text-gray-500">Make changes to your quiz</p>
        </div>
      </div>

      {errors.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-medium mb-2">
              Please fix the following errors:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, i) => (
                <li key={i} className="text-sm">
                  {error}
                </li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">
            Questions ({quizData.questions.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings & Schedule</TabsTrigger>
        </TabsList>

        <QuizDetails
          quizData={quizData}
          updateQuizData={updateQuizData}
          setActiveTab={setActiveTab}
        />

        <Questions
          quizData={quizData}
          setQuizData={setQuizData}
          setActiveTab={setActiveTab}
        />

        <Settings
          quizData={quizData}
          setActiveTab={setActiveTab}
          setQuizData={setQuizData}
          setErrors={setErrors}
        />
      </Tabs>
    </DashboardLayout>
  );
}
