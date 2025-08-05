import { Card, CardContent } from "./ui/card";
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Brain } from "lucide-react";

const Assistant = () => {
    return ( 
        <Card className="mb-6 border-purple-200 bg-purple-50">
                      <CardContent className="pt-6">
                        <div className="flex items-start gap-4">
                          <div className="bg-purple-600 text-white p-2 rounded-md">
                            <Brain size={24} />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-medium mb-2">AI Question Generator</h3>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="ai-topic">Topic</Label>
                                <Input id="ai-topic" placeholder="e.g., World Geography, Science, History" className="mb-2" />
                              </div>
                              <div>
                                <Label htmlFor="ai-difficulty">Difficulty Level</Label>
                                <RadioGroup defaultValue="medium" className="flex space-x-4 mt-1">
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="easy" id="easy" />
                                    <Label htmlFor="easy">Easy</Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="medium" id="medium" />
                                    <Label htmlFor="medium">Medium</Label>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <RadioGroupItem value="hard" id="hard" />
                                    <Label htmlFor="hard">Hard</Label>
                                  </div>
                                </RadioGroup>
                              </div>
                              <div>
                                <Label htmlFor="ai-count">Number of Questions</Label>
                                <Select defaultValue="5">
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select number" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="5">5 questions</SelectItem>
                                    <SelectItem value="10">10 questions</SelectItem>
                                    <SelectItem value="15">15 questions</SelectItem>
                                    <SelectItem value="20">20 questions</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button className="w-full bg-purple-600 hover:bg-purple-700">
                                <Brain className="h-4 w-4 mr-1" /> Generate Questions
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
     );
}
 
export default Assistant;