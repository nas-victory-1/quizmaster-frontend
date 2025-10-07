import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TabsContent } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { BarChart3 } from "lucide-react"

const Analytics = () => {
    return ( 
        <TabsContent value="analytics" className="space-y-6">
                <div className="grid gap-6 lg:grid-cols-2">
                  {/* Score Distribution */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BarChart3 className="h-5 w-5" />
                        Score Distribution
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {results.length > 0 ? (
                          [
                            { range: "8000-10000", count: results.filter(r => r.totalScore >= 8000).length, color: "bg-green-500" },
                            { range: "6000-7999", count: results.filter(r => r.totalScore >= 6000 && r.totalScore < 8000).length, color: "bg-blue-500" },
                            { range: "4000-5999", count: results.filter(r => r.totalScore >= 4000 && r.totalScore < 6000).length, color: "bg-yellow-500" },
                            { range: "0-3999", count: results.filter(r => r.totalScore < 4000).length, color: "bg-red-500" },
                          ].map((item) => (
                            <div key={item.range} className="flex items-center gap-3">
                              <div className="w-20 text-sm font-medium">{item.range}</div>
                              <div className="flex-1">
                                <div className="flex items-center gap-2">
                                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                                    <div
                                      className={`h-2 rounded-full ${item.color}`}
                                      style={{ width: `${(item.count / results.length) * 100}%` }}
                                    ></div>
                                  </div>
                                  <span className="text-sm text-gray-600">{item.count}</span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <p className="text-gray-500 text-center py-4">No data available</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Question Performance Overview */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Question Performance</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {analytics.questionAnalytics.slice(0, 5).map((question, index) => (
                          <div key={question.questionIndex} className="space-y-2">
                            <div className="flex justify-between items-start">
                              <div className="flex-1 pr-4">
                                <p className="text-sm font-medium">
                                  Q{index + 1}: {question.question.substring(0, 60)}
                                  {question.question.length > 60 && '...'}
                                </p>
                                <p className="text-xs text-gray-500">
                                  {question.correctAnswers}/{question.totalAnswers} correct
                                </p>
                              </div>
                              <Badge
                                variant="secondary"
                                className={
                                  question.accuracy >= 80
                                    ? "bg-green-100 text-green-800"
                                    : question.accuracy >= 60
                                      ? "bg-yellow-100 text-yellow-800"
                                      : "bg-red-100 text-red-800"
                                }
                              >
                                {question.accuracy.toFixed(0)}%
                              </Badge>
                            </div>
                            <Progress value={question.accuracy} className="h-2" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
     );
}
 
export default Analytics;