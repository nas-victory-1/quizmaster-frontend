import { TabsContent } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { QuizData } from "@/types/types";

type Props = {
    quizData: QuizData,
    setErrors: React.Dispatch<React.SetStateAction<string[]>>,
    setActiveTab: (tab: string) => void;
}

const Settings = ({quizData, setErrors, setActiveTab}: Props) => {
    const validateQuiz = () => {
        const newErrors: string[] = []

        if (!quizData.title.trim()) {
        newErrors.push("Quiz title is required")
        }

        if (!quizData.category) {
        newErrors.push("Quiz category is required")
        }

        if (quizData.questions.length === 0) {
        newErrors.push("At least one question is required")
        }

        quizData.questions.forEach((question, index) => {
        if (!question.text.trim()) {
            newErrors.push(`Question ${index + 1} text is required`)
        }

        if (question.options.length < 2) {
            newErrors.push(`Question ${index + 1} must have at least 2 options`)
        }

        const hasCorrectAnswer = question.options.some((opt) => opt.isCorrect)
        if (!hasCorrectAnswer) {
            newErrors.push(`Question ${index + 1} must have at least one correct answer`)
        }

        const hasEmptyOptions = question.options.some((opt) => !opt.text.trim())
        if (hasEmptyOptions) {
            newErrors.push(`Question ${index + 1} has empty answer options`)
        }
        })

        setErrors(newErrors)
        return newErrors.length === 0
  }

  const handleSaveQuiz = () => {
    if (validateQuiz()) {
      console.log("Quiz saved:", quizData)
      // Here you would typically save to your backend
      alert("Quiz saved successfully!")
    }
  }


    return ( 
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
            <Button onClick={handleSaveQuiz} className="bg-purple-600 hover:bg-purple-700">
              Save and Publish Quiz
            </Button>
          </div>
        </TabsContent>
     );
}
 
export default Settings;