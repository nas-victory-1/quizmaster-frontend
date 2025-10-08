"use client";
import { TabsContent } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { QuizData } from "@/types/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { createQuizSession } from "@/api/session";

type Props = {
  quizData: QuizData;
  setErrors: React.Dispatch<React.SetStateAction<string[]>>;
  setActiveTab: (tab: string) => void;
  setQuizData: React.Dispatch<React.SetStateAction<QuizData>>;
};

const Settings = ({ quizData, setErrors, setActiveTab }: Props) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingSession, setIsCreatingSession] = useState(false);
  const { id } = useParams();
  const router = useRouter();

  const validateQuiz = () => {
    const newErrors: string[] = [];

    if (!quizData.title.trim()) {
      newErrors.push("Quiz title is required");
    }

    if (!quizData.category) {
      newErrors.push("Quiz category is required");
    }

    if (quizData.questions.length === 0) {
      newErrors.push("At least one question is required");
    }

    quizData.questions.forEach((question, index) => {
      if (!question.text.trim()) {
        newErrors.push(`Question ${index + 1} text is required`);
      }

      if (question.options.length < 2) {
        newErrors.push(`Question ${index + 1} must have at least 2 options`);
      }

      const hasCorrectAnswer = question.options.some((opt) => opt.isCorrect);
      if (!hasCorrectAnswer) {
        newErrors.push(
          `Question ${index + 1} must have at least one correct answer`
        );
      }

      const hasEmptyOptions = question.options.some((opt) => !opt.text.trim());
      if (hasEmptyOptions) {
        newErrors.push(`Question ${index + 1} has empty answer options`);
      }
    });

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSaveQuiz = async () => {
    setErrors([]);
    if (validateQuiz() && !isSubmitting) {
      setIsSubmitting(true);
      try {
        let response;

        console.log("Quiz ID:", id);
        console.log("API URL:", process.env.NEXT_PUBLIC_API_URL);

        if (id) {
          // Editing existing quiz - UPDATE
          const url = `${process.env.NEXT_PUBLIC_API_URL}/quiz/quizzes/${id}`;
          console.log("Updating quiz at URL:", url);
          console.log("Quiz data being sent:", quizData);

          response = await fetch(url, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(quizData),
          });

          console.log("Response status:", response.status);
          console.log("Response ok:", response.ok);
        } else {
          // Creating new quiz - CREATE
          const url = `${process.env.NEXT_PUBLIC_API_URL}/quiz/create-quiz`;
          console.log("Creating quiz at URL:", url);

          response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(quizData),
          });
        }

        if (!response.ok) {
          const errorText = await response.text();
          console.log("Error response text:", errorText);
          throw new Error(
            id
              ? `Failed to update quiz: ${response.status}`
              : "Failed to create quiz"
          );
        }

        alert(id ? "Quiz updated successfully!" : "Quiz created successfully!");

        if (!id) {
          await response.json();
          router.push(`/dashboard/quizzes`);
        }
      } catch (err) {
        console.error("Full save error:", err);
        alert(id ? "Failed to update quiz" : "Failed to create quiz");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleCreateLiveSession = async () => {
    if (!validateQuiz() || isCreatingSession) return;

    setIsCreatingSession(true);
    setErrors([]);

    try {
      // Get user data properly
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const creatorId = userData.id || userData._id;

      // ✅ Check authentication FIRST
      if (!creatorId) {
        setErrors(["Please log in to create a live session"]);
        setIsCreatingSession(false);
        return;
      }

      // ✅ Then save if it's a new quiz
      if (!id) {
        await handleSaveQuiz();
      }

      const sessionPayload = {
        title: quizData.title,
        questions: quizData.questions.map((q) => ({
          question: q.text,
          options: q.options.map((opt) => opt.text),
          correctAnswer: q.options.findIndex((opt) => opt.isCorrect),
          timeLimit: q.timeLimit || 30,
        })),
        creatorId: creatorId,
      };
      console.log("Creating live session with payload:", sessionPayload);

      const response = await createQuizSession(sessionPayload);

      if (response.success) {
        localStorage.setItem("sessionId", response.data.sessionId);
        localStorage.setItem("quizCode", response.data.code);
        localStorage.setItem("isCreator", "true");
        localStorage.setItem("quizTitle", quizData.title);

        alert(`Live quiz session created! Code: ${response.data.code}`);

        // ✅ Use the correct route
        router.push(
          `/dashboard/quizzes/${response.data.sessionId}/waiting-room`
        );
      } else {
        throw new Error(response.error || "Failed to create session");
      }
    } catch (error) {
      console.error("Error creating live session:", error);
      setErrors(["Failed to create live session. Please try again."]);
    } finally {
      setIsCreatingSession(false);
    }
  };

  return (
    <TabsContent value="settings" className="space-y-6">
      {/* NEW: Launch Options Section */}
      <Card className="bg-gradient-to-r from-purple-50 to-violet-50 border-purple-200">
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4 text-purple-900">
            Launch Options
          </h3>

          <div className="space-y-4">
            {/* Save as Template */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border">
              <div>
                <h4 className="font-medium">Save as Template</h4>
                <p className="text-sm text-gray-600">
                  Save quiz for later use, editing, or scheduled sessions
                </p>
              </div>
              <Button
                variant="outline"
                onClick={handleSaveQuiz}
                disabled={isSubmitting}
                className={isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
              >
                {isSubmitting ? "Saving..." : "Save Template"}
              </Button>
            </div>

            {/* Start Live Session */}
            <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-green-200">
              <div>
                <h4 className="font-medium text-green-800">
                  Start Live Session
                </h4>
                <p className="text-sm text-gray-600">
                  Create an immediate live quiz session with participant codes
                </p>
                <p className="text-xs text-green-600 font-medium">
                  Perfect for classroom or event use!
                </p>
              </div>
              <Button
                onClick={handleCreateLiveSession}
                disabled={isCreatingSession}
                className={`bg-green-600 hover:bg-green-700 ${
                  isCreatingSession ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isCreatingSession ? "Creating..." : "Start Live Session"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setActiveTab("questions")}>
          Back to Questions
        </Button>
        <div className="text-sm text-gray-500">
          Choose how you want to use your quiz above
        </div>
      </div>
    </TabsContent>
  );
};

export default Settings;
