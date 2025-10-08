"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import DashboardLayout from "@/components/DashboardLayout";
import { QuizData } from "@/types/types";
import QuizDetails from "@/components/QuizDetails";
import Questions from "@/components/Questions";
import Settings from "@/components/Settings";

export default function CreateQuizPage() {
  const [activeTab, setActiveTab] = useState("details");
  const [errors, setErrors] = useState<string[]>([]);

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

  const updateQuizData = <K extends keyof QuizData>(
    field: K,
    value: QuizData[K]
  ) => {
    setQuizData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <DashboardLayout>
      <div className="flex items-center mb-6">
        <Link href="/dashboard" className="mr-4">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Create New Quiz</h1>
      </div>

      {errors.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            <div className="font-medium mb-2">
              Please fix the following errors:
            </div>
            <ul className="list-disc list-inside space-y-1">
              {errors.map((error, index) => (
                <li key={index} className="text-sm">
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

        {/* Quiz Details Tab */}

        <QuizDetails
          quizData={quizData}
          updateQuizData={updateQuizData}
          setActiveTab={setActiveTab}
        />

        {/* Quiz questions tab */}
        <Questions
          quizData={quizData}
          setQuizData={setQuizData}
          setActiveTab={setActiveTab}
        />

        {/* Settings and Scheduling tab */}
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
