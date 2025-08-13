"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Clock, Users, FileText, Play, Eye, Share2 } from "lucide-react"

interface QuizQuestion {
  id: string
  text: string
  timeLimit: number
  options: {
    id: string
    text: string
    isCorrect: boolean
  }[]
}

interface QuizPreviewData {
  id: string
  title: string
  description: string
  category: string
  status: "draft" | "scheduled" | "live" | "completed"
  questions: QuizQuestion[]
  settings: {
    showLeaderboard: boolean
    randomizeQuestions: boolean
    allowReview: boolean
  }
  scheduledAt?: string
}

export default function QuizPreviewPage({ params }: { params: { id: string } }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)

  // Mock quiz data - in real app, this would come from API
  const quiz: QuizPreviewData = {
    id: params.id,
    title: "Science Quiz",
    description: "Test your knowledge of basic science concepts including physics, chemistry, and biology.",
    category: "science",
    status: "draft",
    questions: [
      {
        id: "1",
        text: "What is the chemical symbol for gold?",
        timeLimit: 20,
        options: [
          { id: "1-1", text: "Au", isCorrect: true },
          { id: "1-2", text: "Ag", isCorrect: false },
          { id: "1-3", text: "Fe", isCorrect: false },
          { id: "1-4", text: "Cu", isCorrect: false },
        ],
      },
      {
        id: "2",
        text: "Which planet is known as the Red Planet?",
        timeLimit: 15,
        options: [
          { id: "2-1", text: "Venus", isCorrect: false },
          { id: "2-2", text: "Mars", isCorrect: true },
          { id: "2-3", text: "Jupiter", isCorrect: false },
          { id: "2-4", text: "Saturn", isCorrect: false },
        ],
      },
      {
        id: "3",
        text: "What is the largest organ in the human body?",
        timeLimit: 20,
        options: [
          { id: "3-1", text: "Heart", isCorrect: false },
          { id: "3-2", text: "Liver", isCorrect: false },
          { id: "3-3", text: "Skin", isCorrect: true },
          { id: "3-4", text: "Brain", isCorrect: false },
        ],
      },
    ],
    settings: {
      showLeaderboard: true,
      randomizeQuestions: false,
      allowReview: true,
    },
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800"
      case "scheduled":
        return "bg-blue-100 text-blue-800"
      case "live":
        return "bg-green-100 text-green-800"
      case "completed":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const copyQuizLink = () => {
    const link = `${window.location.origin}/quiz/${quiz.id}`
    navigator.clipboard.writeText(link)
    alert("Quiz link copied to clipboard!")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <Link href="/dashboard/quizzes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" /> Back to Quizzes
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-600" />
              <span className="font-medium">Preview Mode</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className={getStatusColor(quiz.status)}>
              {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
            </Badge>
            <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
              <Button variant="outline" size="sm">
                Edit Quiz
              </Button>
            </Link>
            {quiz.status !== "draft" && (
              <Button onClick={copyQuizLink} size="sm" className="bg-purple-600 hover:bg-purple-700">
                <Share2 className="h-4 w-4 mr-1" />
                Share
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container py-8">
        <div className="max-w-4xl mx-auto">
          {/* Quiz Overview */}
          <Card className="mb-8">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-2xl mb-2">{quiz.title}</CardTitle>
                  <p className="text-gray-600 mb-4">{quiz.description}</p>
                  <div className="flex items-center gap-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 mr-1" />
                      <span>{quiz.questions.length} questions</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>~{quiz.questions.reduce((total, q) => total + q.timeLimit, 0)} seconds total</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      <span>Category: {quiz.category}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-500 mb-2">Quiz Settings</div>
                  <div className="space-y-1 text-xs">
                    <div className={quiz.settings.showLeaderboard ? "text-green-600" : "text-gray-400"}>
                      {quiz.settings.showLeaderboard ? "✓" : "✗"} Show Leaderboard
                    </div>
                    <div className={quiz.settings.randomizeQuestions ? "text-green-600" : "text-gray-400"}>
                      {quiz.settings.randomizeQuestions ? "✓" : "✗"} Randomize Questions
                    </div>
                    <div className={quiz.settings.allowReview ? "text-green-600" : "text-gray-400"}>
                      {quiz.settings.allowReview ? "✓" : "✗"} Allow Review
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Question Navigation */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Questions Preview</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Question:</span>
              {quiz.questions.map((_, index) => (
                <Button
                  key={index}
                  variant={currentQuestion === index ? "default" : "outline"}
                  size="sm"
                  className={`w-8 h-8 p-0 ${currentQuestion === index ? "bg-purple-600 hover:bg-purple-700" : ""}`}
                  onClick={() => setCurrentQuestion(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>

          {/* Current Question Preview */}
          <Card className="mb-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">
                  Question {currentQuestion + 1} of {quiz.questions.length}
                </CardTitle>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>{quiz.questions[currentQuestion].timeLimit} seconds</span>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="text-lg font-medium">{quiz.questions[currentQuestion].text}</div>
                <div className="grid gap-3">
                  {quiz.questions[currentQuestion].options.map((option, index) => (
                    <div
                      key={option.id}
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        option.isCorrect
                          ? "border-green-200 bg-green-50"
                          : "border-gray-200 bg-white hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">
                          {String.fromCharCode(65 + index)}. {option.text}
                        </span>
                        {option.isCorrect && (
                          <Badge className="bg-green-100 text-green-800 text-xs">Correct Answer</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
              disabled={currentQuestion === 0}
            >
              Previous Question
            </Button>
            <Button
              onClick={() => setCurrentQuestion(Math.min(quiz.questions.length - 1, currentQuestion + 1))}
              disabled={currentQuestion === quiz.questions.length - 1}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Next Question
            </Button>
          </div>

          {/* Participant View Simulation */}
          <Card className="mt-8 border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Play className="h-5 w-5 text-purple-600" />
                How participants will see this quiz
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Participants will see questions one at a time with a countdown timer. They'll need to select an answer
                  before time runs out.
                </p>
                <div className="flex gap-4">
                  <Link href={`/quiz/${quiz.id}`}>
                    <Button className="bg-purple-600 hover:bg-purple-700">
                      <Play className="h-4 w-4 mr-1" />
                      Take Quiz as Participant
                    </Button>
                  </Link>
                  <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
                    <Button variant="outline">Edit This Quiz</Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
