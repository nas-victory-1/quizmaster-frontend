import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { PlusCircle, FileText } from "lucide-react"

interface QuizEmptyStateProps {
  hasFilters: boolean
}

const QuizEmptyState = ({hasFilters}:QuizEmptyStateProps) => {
    return ( 
    <Card className="text-center py-12">
      <CardContent>
        <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <FileText className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium mb-2">{hasFilters ? "No quizzes found" : "No quizzes yet"}</h3>
        <p className="text-gray-500 mb-4">
          {hasFilters ? "Try adjusting your search or filters" : "Create your first quiz to get started"}
        </p>
        <Link href="/dashboard/create-quiz">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            {hasFilters ? "Create Quiz" : "Create Your First Quiz"}
          </Button>
        </Link>
      </CardContent>
    </Card>
     );
}
 
export default QuizEmptyState;