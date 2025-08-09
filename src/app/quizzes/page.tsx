"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import api from "@/api/axios"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { PlusCircle, Search, Filter, Grid3X3, List, Clock, Users, BarChart, Edit, Share2, Copy, Trash2, MoreHorizontal, Calendar, Play, Pause, CheckCircle2, FileText, Eye } from 'lucide-react'
import DashboardLayout from "@/components/DashboardLayout"
import { Quiz } from "@/types/types"
import { getAllQuizzes } from "@/api/quiz"


export default function QuizzesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getAllQuizzes();
        console.log("API response:", res.data);

        setAllQuizzes(res.data.data);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  // Filter and sort quizzes
  const filteredQuizzes = allQuizzes
    .filter((quiz) => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz.description.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === "all" || quiz.status === statusFilter
      const matchesCategory = categoryFilter === "all" || quiz.category === categoryFilter
      return matchesSearch && matchesStatus && matchesCategory
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        case "oldest":
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        case "title":
          return a.title.localeCompare(b.title)
        case "participants":
          return b.participants - a.participants
        default:
          return 0
      }
    })

  const getStatusColor = (status: Quiz["status"]) => {
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

  const getStatusIcon = (status: Quiz["status"]) => {
    switch (status) {
      case "draft":
        return <FileText className="h-3 w-3" />
      case "scheduled":
        return <Clock className="h-3 w-3" />
      case "live":
        return <Play className="h-3 w-3" />
      case "completed":
        return <CheckCircle2 className="h-3 w-3" />
      default:
        return <FileText className="h-3 w-3" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const copyQuizLink = (quizId: string) => {
    const link = `${window.location.origin}/quiz/${quizId}`
    navigator.clipboard.writeText(link)
    // You could add a toast notification here
    alert("Quiz link copied to clipboard!")
  }

  const deleteQuiz = (quizId: string) => {
    // Handle quiz deletion
    console.log("Deleting quiz:", quizId)
    alert("Quiz deleted successfully!")
  }

  const QuizCard = ({ quiz }: { quiz: Quiz }) => (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-video relative overflow-hidden bg-gray-100">
        <img
          src={quiz.thumbnail || "/placeholder.svg?height=200&width=300"}
          alt={quiz.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 right-2">
          <Badge className={`${getStatusColor(quiz.status)} flex items-center gap-1`}>
            {getStatusIcon(quiz.status)}
            {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{quiz.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Quiz
                </Link>
              </DropdownMenuItem>
              {quiz.status !== "draft" && (
                <DropdownMenuItem onClick={() => copyQuizLink(quiz.id)}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Quiz
                </DropdownMenuItem>
              )}
              {quiz.status === "completed" && (
                <DropdownMenuItem asChild>
                  <Link href={`/dashboard/quizzes/${quiz.id}/results`}>
                    <BarChart className="h-4 w-4 mr-2" />
                    View Results
                  </Link>
                </DropdownMenuItem>
              )}
              <DropdownMenuItem asChild>
                <Link href={`/quiz/${quiz.id}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview Quiz
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Quiz
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => deleteQuiz(quiz.id)} className="bg-red-600 hover:bg-red-700">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{quiz.questions} questions</span>
          </div>
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{quiz.participants} participants</span>
          </div>
        </div>
        {quiz.status === "completed" && quiz.averageScore && (
          <div className="mt-2 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Avg. Score: {quiz.averageScore}%</span>
              <span>Completion: {quiz.completionRate}%</span>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="pt-2 text-xs text-gray-500">
        <div className="flex justify-between items-center w-full">
          <span>Created {formatDate(quiz.createdAt)}</span>
          {quiz.scheduledAt && quiz.status === "scheduled" && (
            <span>Scheduled for {formatDateTime(quiz.scheduledAt)}</span>
          )}
          {quiz.completedAt && quiz.status === "completed" && (
            <span>Completed {formatDateTime(quiz.completedAt)}</span>
          )}
        </div>
      </CardFooter>
    </Card>
  )

  const QuizListItem = ({ quiz }: { quiz: Quiz }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
            <img
              src={quiz.thumbnail || "/placeholder.svg?height=64&width=64"}
              alt={quiz.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-medium truncate">{quiz.title}</h3>
                <p className="text-sm text-gray-600 line-clamp-1">{quiz.description}</p>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span className="flex items-center">
                    <FileText className="h-3 w-3 mr-1" />
                    {quiz.questions} questions
                  </span>
                  <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {quiz.participants} participants
                  </span>
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(quiz.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge className={`${getStatusColor(quiz.status)} flex items-center gap-1`}>
                  {getStatusIcon(quiz.status)}
                  {quiz.status.charAt(0).toUpperCase() + quiz.status.slice(1)}
                </Badge>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/quizzes/${quiz.id}/edit`}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Quiz
                      </Link>
                    </DropdownMenuItem>
                    {quiz.status !== "draft" && (
                      <DropdownMenuItem onClick={() => copyQuizLink(quiz.id)}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Share Quiz
                      </DropdownMenuItem>
                    )}
                    {quiz.status === "completed" && (
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/quizzes/${quiz.id}/results`}>
                          <BarChart className="h-4 w-4 mr-2" />
                          View Results
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem asChild>
                      <Link href={`/quiz/${quiz.id}`}>
                        <Eye className="h-4 w-4 mr-2" />
                        Preview Quiz
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-red-600">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Quiz
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Quiz</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{quiz.title}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteQuiz(quiz.id)} className="bg-red-600 hover:bg-red-700">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Quizzes</h1>
          <p className="text-gray-500 mt-1">Manage and track all your quizzes</p>
        </div>
        <Link href="/dashboard/create-quiz">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Quiz
          </Button>
        </Link>
      </div>

      {/* Filters and Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">Most Recent</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  <SelectItem value="title">Title A-Z</SelectItem>
                  <SelectItem value="participants">Most Participants</SelectItem>
                </SelectContent>
              </Select>
              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quiz List */}
      {filteredQuizzes.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "No quizzes found"
                : "No quizzes yet"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
                ? "Try adjusting your search or filters"
                : "Create your first quiz to get started"}
            </p>
            <Link href="/dashboard/create-quiz">
              <Button className="bg-purple-600 hover:bg-purple-700">
                <PlusCircle className="mr-2 h-4 w-4" /> Create Your First Quiz
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Showing {filteredQuizzes.length} of {allQuizzes.length} quizzes
            </p>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredQuizzes.map((quiz) => (
                <QuizCard key={quiz.id} quiz={quiz} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => (
                <QuizListItem key={quiz.id} quiz={quiz} />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
