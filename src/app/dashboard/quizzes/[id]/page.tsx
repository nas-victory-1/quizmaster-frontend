"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  Copy,
  Calendar,
  Clock,
  Users,
  FileText,
  Settings,
  Eye,
  Edit,
  Share2,
  CheckCircle2,
  AlertCircle,
  Timer,
} from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"

export default function QuizDetailsPage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)

  // Mock quiz data
  const quiz = {
    id: params.id,
    title: "Science Quiz",
    description: "Test your knowledge of basic science concepts including physics, chemistry, and biology.",
    category: "science",
    status: "scheduled" ,
    accessCode: "SCI2025",
    scheduledDate: "2025-01-25",
    scheduledTime: "15:00",
    duration: 20, // minutes
    questions: 10,
    timePerQuestion: 20, // seconds
    createdAt: "2025-01-05",
    thumbnail: "/placeholder.svg?height=200&width=300",
  }

  // Mock participants data
  const participants = [
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.johnson@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      registeredAt: "2025-01-10 14:30",
      status: "confirmed" as const,
    },
    {
      id: 2,
      name: "Jamie Smith",
      email: "jamie.smith@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      registeredAt: "2025-01-12 09:15",
      status: "registered" as const,
    },
    {
      id: 3,
      name: "Taylor Brown",
      email: "taylor.brown@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      registeredAt: "2025-01-14 16:45",
      status: "confirmed" as const,
    },
    {
      id: 4,
      name: "Casey Wilson",
      email: "casey.wilson@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      registeredAt: "2025-01-15 11:20",
      status: "registered" as const,
    },
    {
      id: 5,
      name: "Jordan Lee",
      email: "jordan.lee@email.com",
      avatar: "/placeholder.svg?height=40&width=40",
      registeredAt: "2025-01-16 13:10",
      status: "confirmed" as const,
    },
  ]

  const copyAccessCode = () => {
    navigator.clipboard.writeText(quiz.accessCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const copyQuizLink = () => {
    const link = `${window.location.origin}/quiz/join/${quiz.accessCode}`
    navigator.clipboard.writeText(link)
    alert("Quiz link copied to clipboard!")
  }

  const getStatusColor = (status: typeof quiz.status) => {
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

  const getParticipantStatusColor = (status: "registered" | "confirmed") => {
    switch (status) {
      case "registered":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDateTime = (date: string, time: string) => {
    const dateObj = new Date(`${date}T${time}`)
    return dateObj.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const confirmedCount = participants.filter((p) => p.status === "confirmed").length
  const registeredCount = participants.filter((p) => p.status === "registered").length

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/dashboard/quizzes" className="text-sm text-gray-500 hover:text-gray-700">
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
          <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit Quiz
            </Button>
          </Link>
          <Link href={`/quiz/${quiz.id}/preview`}>
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
            {/* Access Code & Schedule */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Quiz Access
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Access Code */}
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Access Code</label>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border font-mono text-lg font-bold text-center">
                      {quiz.accessCode}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={copyAccessCode}
                      className={copied ? "text-green-600" : ""}
                    >
                      {copied ? <CheckCircle2 className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">Participants will use this code to join the quiz</p>
                </div>

                <Separator />

                {/* Schedule Information */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Scheduled Date & Time
                    </label>
                    <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border">
                      <div className="font-medium">{formatDateTime(quiz.scheduledDate, quiz.scheduledTime)}</div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                      <Timer className="h-4 w-4" />
                      Duration
                    </label>
                    <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border">
                      <div className="font-medium">{quiz.duration} minutes</div>
                      <div className="text-xs text-gray-500">
                        {quiz.questions} questions × {quiz.timePerQuestion}s each
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Participants List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Registered Participants ({participants.length})
                </CardTitle>
                <CardDescription>
                  {confirmedCount} confirmed, {registeredCount} pending confirmation
                </CardDescription>
              </CardHeader>
              <CardContent>
                {participants.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No participants registered yet</p>
                    <p className="text-sm">Share the access code to get started</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {participants.map((participant) => (
                      <div
                        key={participant.id}
                        className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800/50"
                      >
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={participant.avatar || "/placeholder.svg"} alt={participant.name} />
                            <AvatarFallback>
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{participant.name}</div>
                            <div className="text-sm text-gray-500">{participant.email}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getParticipantStatusColor(participant.status)} variant="secondary">
                            {participant.status === "confirmed" ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <AlertCircle className="h-3 w-3 mr-1" />
                            )}
                            {participant.status.charAt(0).toUpperCase() + participant.status.slice(1)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
                    Total Participants
                  </div>
                  <div className="font-bold text-lg">{participants.length}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4" />
                    Confirmed
                  </div>
                  <div className="font-bold text-lg text-green-600">{confirmedCount}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <AlertCircle className="h-4 w-4" />
                    Pending
                  </div>
                  <div className="font-bold text-lg text-yellow-600">{registeredCount}</div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    Questions
                  </div>
                  <div className="font-bold">{quiz.questions}</div>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock className="h-4 w-4" />
                    Duration
                  </div>
                  <div className="font-bold">{quiz.duration}m</div>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Thumbnail */}
            <Card>
              <CardContent className="p-0">
                <div className="aspect-video rounded-lg overflow-hidden">
                  <img
                    src={quiz.thumbnail || "/placeholder.svg"}
                    alt={quiz.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
