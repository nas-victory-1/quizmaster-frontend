"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Edit, Share2, BarChart, Eye } from "lucide-react"
import QuizDelete from "./QuizDelete"
import { Quiz } from "@/types/types"

interface QuizDropdownProps {
  quiz: Quiz
  onDelete: (quizId: string) => void
  onCopyLink: (quizId: string) => void
}

const QuizDropdown = ({ quiz, onDelete, onCopyLink }: QuizDropdownProps)  => {
    return ( 
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
          <DropdownMenuItem onClick={() => onCopyLink(quiz.id)}>
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
        <QuizDelete quiz={quiz} onDelete={onDelete} />
      </DropdownMenuContent>
    </DropdownMenu>
     );
}
 
export default QuizDropdown;