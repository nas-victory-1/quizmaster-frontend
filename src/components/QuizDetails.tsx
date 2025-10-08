import { TabsContent } from "./ui/tabs";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { QuizData } from "@/types/types";

type Props = {
  quizData: QuizData;
  updateQuizData: <K extends keyof QuizData>(
    field: K,
    value: QuizData[K]
  ) => void;
  setActiveTab: (tab: string) => void;
};

const QuizDetails = ({ quizData, updateQuizData, setActiveTab }: Props) => {
  return (
    <TabsContent value="details" className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Quiz Title *</Label>
              <Input
                id="title"
                placeholder="Enter quiz title"
                value={quizData.title}
                onChange={(e) => updateQuizData("title", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter quiz description"
                rows={4}
                value={quizData.description}
                onChange={(e) => updateQuizData("description", e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={quizData.category}
                onValueChange={(value) => updateQuizData("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="business">Business</SelectItem>
                  <SelectItem value="entertainment">Entertainment</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end">
              <Button
                onClick={() => setActiveTab("questions")}
                className="bg-purple-600 hover:bg-purple-700"
              >
                Continue to Questions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default QuizDetails;
