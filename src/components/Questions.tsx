import { TabsContent } from "./ui/tabs";
import { Switch } from "./ui/switch";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Trash2 } from "lucide-react";
import { Plus } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { Clock } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "./ui/input";
import Assistant from "@/components/Assistant"
import { useState } from "react";
import { QuizData, Question, Option } from "@/types/types";


type Props = {
    quizData: QuizData,
    setQuizData: React.Dispatch<React.SetStateAction<QuizData>>,
    setActiveTab: (tab: string) => void;
}

const Questions = ({quizData, setQuizData, setActiveTab}: Props) => {

    const [showAiAssistant, setShowAiAssistant] = useState(false)
    
    const toggleAiAssistant = () => {
        setShowAiAssistant(!showAiAssistant)
    }

    const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      text: "",
      timeLimit: 20,
      options: [
        { id: `${Date.now()}-1`, text: "", isCorrect: true },
        { id: `${Date.now()}-2`, text: "", isCorrect: false },
        { id: `${Date.now()}-3`, text: "", isCorrect: false },
        { id: `${Date.now()}-4`, text: "", isCorrect: false },
      ],
    }
    setQuizData((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }))
  }

  const removeQuestion = (questionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== questionId),
    }))
  }

  const updateQuestion = (questionId: string, field: keyof Question, value: any) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, [field]: value } : q)),
    }))
  }

  const addOption = (questionId: string) => {
    const newOption: Option = {
      id: `${questionId}-${Date.now()}`,
      text: "",
      isCorrect: false,
    }

    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) => (q.id === questionId ? { ...q, options: [...q.options, newOption] } : q)),
    }))
  }

  const removeOption = (questionId: string, optionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId ? { ...q, options: q.options.filter((opt) => opt.id !== optionId) } : q,
      ),
    }))
  }

  const updateOption = (questionId: string, optionId: string, field: keyof Option, value: any) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) => (opt.id === optionId ? { ...opt, [field]: value } : opt)),
            }
          : q,
      ),
    }))
  }

  const setCorrectAnswer = (questionId: string, optionId: string) => {
    setQuizData((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === questionId
          ? {
              ...q,
              options: q.options.map((opt) => ({
                ...opt,
                isCorrect: opt.id === optionId,
              })),
            }
          : q,
      ),
    }))
  }

    return ( 
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
            <Assistant />
          )}

          {quizData.questions.map((question, index) => (
            <Card key={question.id} className="mb-6">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium">Question {index + 1}</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeQuestion(question.id)}
                    disabled={quizData.questions.length === 1}
                  >
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
                      onChange={(e) => updateQuestion(question.id, "text", e.target.value)}
                      rows={2}
                    />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-500" />
                      <Label htmlFor={`time-limit-${question.id}`}>Time Limit (seconds)</Label>
                    </div>
                    <Select
                      value={question.timeLimit.toString()}
                      onValueChange={(value) => updateQuestion(question.id, "timeLimit", Number.parseInt(value))}
                    >
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
                    <Label>Answer Options (Select the correct answer)</Label>
                    <RadioGroup
                      value={question.options.find((opt) => opt.isCorrect)?.id || ""}
                      onValueChange={(value) => setCorrectAnswer(question.id, value)}
                    >
                      <div className="space-y-3">
                        {question.options.map((option, optIndex) => (
                          <div key={option.id} className="flex items-center gap-3">
                            <RadioGroupItem value={option.id} id={`correct-${question.id}-${option.id}`} />
                            <Input
                              placeholder={`Option ${optIndex + 1}`}
                              value={option.text}
                              onChange={(e) => updateOption(question.id, option.id, "text", e.target.value)}
                              className="flex-1"
                            />
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:text-red-700 hover:bg-red-50 p-0 h-8 w-8"
                              onClick={() => removeOption(question.id, option.id)}
                              disabled={question.options.length <= 2}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2 bg-transparent"
                          onClick={() => addOption(question.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" /> Add Option
                        </Button>
                      </div>
                    </RadioGroup>
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
     );
}
 
export default Questions;