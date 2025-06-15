"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Brain, Clock, Plus, Trash2 } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

export default function CreateQuizPage() {
  const [activeTab, setActiveTab] = useState("details")
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: "What is the capital of France?",
      timeLimit: 20,
      options: [
        { id: 1, text: "Paris", isCorrect: true },
        { id: 2, text: "London", isCorrect: false },
        { id: 3, text: "Berlin", isCorrect: false },
        { id: 4, text: "Madrid", isCorrect: false },
      ],
    },
    {
      id: 2,
      text: "Which planet is known as the Red Planet?",
      timeLimit: 15,
      options: [
        { id: 1, text: "Venus", isCorrect: false },
        { id: 2, text: "Mars", isCorrect: true },
        { id: 3, text: "Jupiter", isCorrect: false },
        { id: 4, text: "Saturn", isCorrect: false },
      ],
    },
  ])
  const [showAiAssistant, setShowAiAssistant] = useState(false)

  const addQuestion = () => {
    const newQuestion = {
      id: questions.length + 1,
      text: "",
      timeLimit: 20,
      options: [
        { id: 1, text: "", isCorrect: true },
        { id: 2, text: "", isCorrect: false },
        { id: 3, text: "", isCorrect: false },
        { id: 4, text: "", isCorrect: false },
      ],
    }
    setQuestions([...questions, newQuestion])
  }

  const toggleAiAssistant = () => {
    setShowAiAssistant(!showAiAssistant)
  }

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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="details">Quiz Details</TabsTrigger>
          <TabsTrigger value="questions">Questions</TabsTrigger>
          <TabsTrigger value="settings">Settings & Schedule</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div className="space-y-2">
                  <Label htmlFor="title">Quiz Title</Label>
                  <Input id="title" placeholder="Enter quiz title" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea id="description" placeholder="Enter quiz description" rows={4} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="science">Science</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end">
                  <Button onClick={() => setActiveTab("questions")} className="bg-purple-600 hover:bg-purple-700">
                    Continue to Questions
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="questions" className="space-y-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Quiz Questions</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center space-x-2">
                <Switch id="ai-assistant" checked={showAiAssistant} onCheckedChange={toggleAiAssistant} />
                <Label htmlFor="ai-assistant" className="cursor-pointer">
                  AI Assistant
                </Label>
              </div>
              <Button onClick={addQuestion}>
                <Plus className="h-4 w-4 mr-1" /> Add Question
              </Button>
            </div>
          </div>

          {showAiAssistant && (
            <Card className="mb-6 border-purple-200 bg-purple-50">
              <CardContent className="pt-6">
                <div className="flex items-start gap-4">
                  <div className="bg-purple-600 text-white p-2 rounded-md">
                    <Brain size={24} />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-medium mb-2">AI Question Generator</h3>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="ai-topic">Topic</Label>
                        <Input id="ai-topic" placeholder="e.g., World Geography, Science, History" className="mb-2" />
                      </div>
                      <div>
                        <Label htmlFor="ai-difficulty">Difficulty Level</Label>
                        <RadioGroup defaultValue="medium" className="flex space-x-4 mt-1">
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="easy" id="easy" />
                            <Label htmlFor="easy">Easy</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="medium" id="medium" />
                            <Label htmlFor="medium">Medium</Label>
                          </div>
                          <div className="flex items-center space-x-1">
                            <RadioGroupItem value="hard" id="hard" />
                            <Label htmlFor="hard">Hard</Label>
                          </div>
                        </RadioGroup>
                      </div>
                      <div>
                        <Label htmlFor="ai-count">Number of Questions</Label>
                        <Select defaultValue="5">
                          <SelectTrigger>
                            <SelectValue placeholder="Select number" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5">5 questions</SelectItem>
                            <SelectItem value="10">10 questions</SelectItem>
                            <SelectItem value="15">15 questions</SelectItem>
                            <SelectItem value="20">20 questions</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <Button className="w-full bg-purple-600 hover:bg-purple-700">
                        <Brain className="h-4 w-4 mr-1" /> Generate Questions
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {questions.map((question, index) => (
            <Card key={question.id} className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor={`question-${question.id}`}>Question Text</Label>
                    <Textarea
                      id={`question-${question.id}`}
                      placeholder="Enter your question"
                      value={question.text}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Label htmlFor={`time-limit-${question.id}`}>Time Limit (seconds)</Label>
                    </div>
                    <Select defaultValue={question.timeLimit.toString()}>
                      <SelectTrigger className="w-24">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10">10</SelectItem>
                        <SelectItem value="15">15</SelectItem>
                        <SelectItem value="20">20</SelectItem>
                        <SelectItem value="30">30</SelectItem>
                        <SelectItem value="45">45</SelectItem>
                        <SelectItem value="60">60</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Answer Options</Label>
                    <div className="space-y-3">
                      {question.options.map((option, optIndex) => (
                        <div key={option.id} className="flex items-center gap-3">
                          <RadioGroup defaultValue={option.isCorrect ? "correct" : ""} className="flex items-center">
                            <RadioGroupItem value="correct" id={`correct-${question.id}-${option.id}`} />
                          </RadioGroup>
                          <Input placeholder={`Option ${optIndex + 1}`} value={option.text} className="flex-1" />
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-8 w-8"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <Button variant="outline" size="sm" className="mt-2">
                        <Plus className="h-4 w-4 mr-1" /> Add Option
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("details")}>
              Back to Details
            </Button>
            <Button onClick={() => setActiveTab("settings")} className="bg-purple-600 hover:bg-purple-700">
              Continue to Settings
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-6">
                <div>
                  <h3 className="text-lg font-medium mb-4">Quiz Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Show Leaderboard After Each Question</Label>
                        <p className="text-sm text-gray-500">Display rankings after each question is answered</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Randomize Question Order</Label>
                        <p className="text-sm text-gray-500">Present questions in random order to participants</p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label className="text-base">Allow Participants to Review Answers</Label>
                        <p className="text-sm text-gray-500">Let participants see correct answers after the quiz</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6">
                  <h3 className="text-lg font-medium mb-4">Schedule Quiz</h3>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="quiz-date">Date</Label>
                      <Input id="quiz-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quiz-time">Time</Label>
                      <Input id="quiz-time" type="time" />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setActiveTab("questions")}>
              Back to Questions
            </Button>
            <Button className="bg-purple-600 hover:bg-purple-700">Save and Publish Quiz</Button>
          </div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
