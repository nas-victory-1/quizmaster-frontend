'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { PlusCircle, Clock, Users, BarChart, Edit, Trash2, ExternalLink } from "lucide-react"
import DashboardLayout from "@/components/DashboardLayout"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation";

export default function DashboardPage() {

  const router = useRouter();
  // Mock data for quizzes
  const quizzes = [
    {
      id: 1,
      title: "Science Quiz",
      questions: 10,
      participants: 24,
      status: "Scheduled",
      date: "May 25, 2025",
      time: "3:00 PM",
    },
    {
      id: 2,
      title: "History Trivia",
      questions: 15,
      participants: 18,
      status: "Draft",
      date: "Not scheduled",
      time: "",
    },
    {
      id: 3,
      title: "Math Challenge",
      questions: 8,
      participants: 32,
      status: "Completed",
      date: "May 15, 2025",
      time: "2:30 PM",
    },
  ]

  const [authChecking, setAuthChecking] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      router.push("/login");
    }else{
      setAuthChecking(false);
    }
  }, [router]);

  if(authChecking){
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-gray-500 mt-1">Manage your quizzes and view analytics</p>
        </div>
        <Link href="/dashboard/create-quiz">
          <Button className="bg-purple-600 hover:bg-purple-700">
            <PlusCircle className="mr-2 h-4 w-4" /> Create Quiz
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Quizzes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">12</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Participants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">248</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Avg. Completion Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">92%</div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Your Quizzes</h2>
          <Link href="/dashboard/quizzes">
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => (
            <Card key={quiz.id} className="overflow-hidden">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{quiz.title}</CardTitle>
                  <div
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      quiz.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : quiz.status === "Draft"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-green-100 text-green-800"
                    }`}
                  >
                    {quiz.status}
                  </div>
                </div>
                <CardDescription>
                  {quiz.status === "Scheduled"
                    ? `${quiz.date} at ${quiz.time}`
                    : quiz.status === "Completed"
                      ? `Completed on ${quiz.date}`
                      : "Not scheduled yet"}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{quiz.questions} questions</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 mr-1 text-gray-500" />
                    <span>{quiz.participants} participants</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between pt-2">
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                  {quiz.status === "Scheduled" && (
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4 mr-1" /> Share
                    </Button>
                  )}
                  {quiz.status === "Completed" && (
                    <Button variant="outline" size="sm">
                      <BarChart className="h-4 w-4 mr-1" /> Results
                    </Button>
                  )}
                </div>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}

          <Card className="border-dashed flex flex-col items-center justify-center p-6">
            <div className="rounded-full bg-purple-100 p-3 mb-4">
              <PlusCircle className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">Create New Quiz</h3>
            <p className="text-gray-500 text-center mb-4">Start from scratch or use AI to generate questions</p>
            <Link href="/dashboard/create-quiz">
              <Button className="bg-purple-600 hover:bg-purple-700">Create Quiz</Button>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
