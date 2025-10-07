import { TabsContent } from "./ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Download } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { AlertTriangle } from "lucide-react";
import { Trash2 } from "lucide-react";

const AccountTab = () => {
  const handleExportData = () => {
    // Handle data export
    alert("Data export started. You'll receive an email when it's ready.");
  };

  const handleDeleteAccount = () => {
    // Handle account deletion
    alert("Account deletion process would be implemented here");
  };

  return (
    <TabsContent value="account" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
          <CardDescription>
            Manage your account and subscription details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Current Plan</div>
              <div className="text-sm text-gray-500">Free Plan</div>
            </div>
            <Badge variant="secondary">Free</Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-1">Quizzes Created</div>
              <div className="text-2xl font-bold text-purple-600">12</div>
              <div className="text-sm text-gray-500">
                5 remaining this month
              </div>
            </div>
            <div className="p-4 border rounded-lg">
              <div className="font-medium mb-1">Total Participants</div>
              <div className="text-2xl font-bold text-purple-600">248</div>
              <div className="text-sm text-gray-500">Across all quizzes</div>
            </div>
          </div>

          <Button className="w-full bg-purple-600 hover:bg-purple-700">
            Upgrade to Pro
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Data & Privacy</CardTitle>
          <CardDescription>
            Export your data or delete your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <div className="font-medium">Export Data</div>
              <div className="text-sm text-gray-500">
                Download all your quiz data and analytics
              </div>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
            <div>
              <div className="font-medium text-red-800">Delete Account</div>
              <div className="text-sm text-red-600">
                Permanently delete your account and all data
              </div>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Delete Account
                  </AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove all your data from our servers,
                    including:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      <li>All your quizzes and questions</li>
                      <li>Participant responses and analytics</li>
                      <li>Your profile and settings</li>
                    </ul>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDeleteAccount}
                    className="bg-red-600 hover:bg-red-700"
                  >
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AccountTab;
