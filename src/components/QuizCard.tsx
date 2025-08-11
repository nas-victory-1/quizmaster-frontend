import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Clock, Play, CheckCircle2 } from "lucide-react"
import QuizDropdown from "./QuizDropdown"
import type { Quiz } from "@/types/types"

interface QuizCardProps {
  quiz: Quiz
  onDelete: (quizId: string) => void
  onCopyLink: (quizId: string) => void
}

const QuizCard = ({ quiz, onDelete, onCopyLink }: QuizCardProps) => {
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

  return (
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
            {quiz.status?.charAt(0).toUpperCase() + quiz.status?.slice(1) || "Unknown"}
          </Badge>
        </div>
      </div>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg line-clamp-1">{quiz.title}</CardTitle>
          <QuizDropdown quiz={quiz} onDelete={onDelete} onCopyLink={onCopyLink} />
        </div>
        <CardDescription className="line-clamp-2">{quiz.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center">
            <FileText className="h-4 w-4 mr-1" />
            <span>{quiz.questions?.length || 0} questions</span>
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
          {quiz.completedAt && quiz.status === "completed" && <span>Completed {formatDateTime(quiz.completedAt)}</span>}
        </div>
      </CardFooter>
    </Card>
  )
}
export default QuizCard;