"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import DashboardLayout from "@/components/DashboardLayout"
import { Quiz } from "@/types/types"
import { getAllQuizzes } from "@/api/quiz"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import QuizCard from "@/components/QuizCard"
import QuizListItem from "@/components/QuizListItem"
import QuizFilters from "@/components/QuizFilters"
import QuizEmptyState from "@/components/QuizEmptyState"


export default function QuizzesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [sortBy, setSortBy] = useState<string>("recent")
  const [allQuizzes, setAllQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const res = await getAllQuizzes();
        console.log("API response:", res.data);
        setAllQuizzes(res.data.data || []);
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if(loading){
    return (
          <DashboardLayout>
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4" />
                <p className="text-gray-500">Loading quizzes...</p>
              </div>
            </div>
          </DashboardLayout>
        );
  }

  // Filter and sort quizzes
  const filteredQuizzes = allQuizzes
    .filter((quiz) => {
      const matchesSearch =
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
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

  const copyQuizLink = (quizId: string) => {
    const link = `${window.location.origin}/quiz/${quizId}`
    navigator.clipboard.writeText(link)
    alert("Quiz link copied to clipboard!")
  }

  const deleteQuiz = (quizId: string) => {
    // console.log("Deleting quiz:", quizId)
    setAllQuizzes(prevQuizzes => prevQuizzes.filter(quiz => quiz._id !== quizId));
    // alert("Quiz deleted successfully!")
  }

  const hasFilters = Boolean(searchQuery || statusFilter !== "all" || categoryFilter !== "all")

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

      <QuizFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      {filteredQuizzes.length === 0 ? (
        <QuizEmptyState hasFilters={hasFilters} />
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
                <QuizCard key={quiz._id} quiz={quiz} onDelete={deleteQuiz} onCopyLink={copyQuizLink} />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQuizzes.map((quiz) => (
                <QuizListItem key={quiz._id} quiz={quiz} onDelete={deleteQuiz} onCopyLink={copyQuizLink} />
              ))}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}
