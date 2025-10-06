import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Users, Calendar, Clock, Play, CheckCircle2 } from "lucide-react"
import QuizDropdown from "./QuizDropdown"
import type { Quiz } from "@/types/types"

interface QuizListItemProps {
  quiz: Quiz
  onDelete: (quizId: string) => void
  onCopyLink: (quizId: string) => void
  onClick: (quizId:string) => void
}

const QuizListItem = ({ quiz, onDelete, onCopyLink, onClick }: QuizListItemProps) => {
  
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

  return (
   <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center gap-4" onClick={()=>{onClick?.(quiz._id)}}>
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
                    {quiz.questions?.length || 0} question(s)
                  </span>
                  {/* <span className="flex items-center">
                    <Users className="h-3 w-3 mr-1" />
                    {quiz.participants} participants
                  </span> */}
                  <span className="flex items-center">
                    <Calendar className="h-3 w-3 mr-1" />
                    {formatDate(quiz.createdAt)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2 ml-4">
                <Badge className={`${getStatusColor(quiz.status)} flex items-center gap-1`}>
                  {getStatusIcon(quiz.status)}
                  {quiz.questions?.length || 0} question(s)
                </Badge>
                <QuizDropdown quiz={quiz} onDelete={onDelete} onCopyLink={onCopyLink} />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
export default QuizListItem