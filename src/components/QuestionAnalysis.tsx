const QuestionAnalysis = () => {
    return ( 
         <TabsContent value="questions" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Question Analysis</CardTitle>
                    <CardDescription>Answer distribution for each question</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      {analytics.questionAnalytics.map((question, qIndex) => (
                        <div key={question.questionIndex} className="space-y-3">
                          <div className="flex justify-between items-center">
                            <h4 className="font-medium">
                              Q{qIndex + 1}: {question.question}
                            </h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{question.accuracy.toFixed(0)}% correct</Badge>
                              <Badge variant="outline">
                                {question.correctAnswers}/{question.totalAnswers} answers
                              </Badge>
                            </div>
                          </div>
                          <div className="grid gap-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-3">
                                <div className="w-8 text-sm font-medium text-gray-500">
                                  {String.fromCharCode(65 + oIndex)}
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm">{option.text}</span>
                                    <span className="text-sm text-gray-500">
                                      {option.count} ({option.percentage.toFixed(0)}%)
                                    </span>
                                  </div>
                                  <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${
                                        oIndex === session.questions[qIndex]?.correctAnswer
                                          ? "bg-green-500"
                                          : "bg-gray-400"
                                      }`}
                                      style={{ width: `${option.percentage}%` }}
                                    ></div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                          {qIndex < analytics.questionAnalytics.length - 1 && <Separator />}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
     );
}
 
export default QuestionAnalysis;