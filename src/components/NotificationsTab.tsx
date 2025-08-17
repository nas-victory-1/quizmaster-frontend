import { TabsContent } from "./ui/tabs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "./ui/card";
import { Label } from "./ui/label";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useState } from "react";


interface NotificationSettings {
  emailNotifications: boolean
  quizReminders: boolean
  participantJoined: boolean
  quizCompleted: boolean
  weeklyReports: boolean
  marketingEmails: boolean
  securityAlerts: boolean
}


const NotificationsTab = () => {

    const [notifications, setNotifications] = useState<NotificationSettings>({
        emailNotifications: true,
        quizReminders: true,
        participantJoined: false,
        quizCompleted: true,
        weeklyReports: true,
        marketingEmails: false,
        securityAlerts: true,
    })

    const updateNotifications = (field: keyof NotificationSettings, value: boolean) => {
        setNotifications((prev) => ({ ...prev, [field]: value }))
    }
    return ( 
        <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
                <CardDescription>Choose what email notifications you'd like to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="text-base font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-500">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={notifications.emailNotifications}
                    onCheckedChange={(checked) => updateNotifications("emailNotifications", checked)}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Quiz Reminders</Label>
                      <p className="text-sm text-gray-500">Get reminded about upcoming scheduled quizzes</p>
                    </div>
                    <Switch
                      checked={notifications.quizReminders}
                      onCheckedChange={(checked) => updateNotifications("quizReminders", checked)}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Participant Joined</Label>
                      <p className="text-sm text-gray-500">Notify when someone joins your quiz</p>
                    </div>
                    <Switch
                      checked={notifications.participantJoined}
                      onCheckedChange={(checked) => updateNotifications("participantJoined", checked)}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Quiz Completed</Label>
                      <p className="text-sm text-gray-500">Notify when your quiz is completed</p>
                    </div>
                    <Switch
                      checked={notifications.quizCompleted}
                      onCheckedChange={(checked) => updateNotifications("quizCompleted", checked)}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">Receive weekly analytics and performance reports</p>
                    </div>
                    <Switch
                      checked={notifications.weeklyReports}
                      onCheckedChange={(checked) => updateNotifications("weeklyReports", checked)}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Marketing Emails</Label>
                      <p className="text-sm text-gray-500">Receive updates about new features and tips</p>
                    </div>
                    <Switch
                      checked={notifications.marketingEmails}
                      onCheckedChange={(checked) => updateNotifications("marketingEmails", checked)}
                      disabled={!notifications.emailNotifications}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">Security Alerts</Label>
                      <p className="text-sm text-gray-500">Important security notifications (always enabled)</p>
                    </div>
                    <Switch
                      checked={notifications.securityAlerts}
                      onCheckedChange={(checked) => updateNotifications("securityAlerts", checked)}
                      disabled={true}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
     );
}
 
export default NotificationsTab;