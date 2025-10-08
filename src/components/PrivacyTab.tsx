"use client";

import { TabsContent } from "./ui/tabs";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./ui/card";
import { Label } from "./ui/label";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "./ui/select";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { useState } from "react";

interface PrivacySettings {
  profileVisibility: "public" | "private" | "organization";
  showEmail: boolean;
  showLocation: boolean;
  allowAnalytics: boolean;
  allowCookies: boolean;
}

const PrivacyTab = () => {
  const [privacy, setPrivacy] = useState<PrivacySettings>({
    profileVisibility: "public",
    showEmail: false,
    showLocation: true,
    allowAnalytics: true,
    allowCookies: true,
  });

  const updatePrivacy = <K extends keyof PrivacySettings>(
    field: K,
    value: PrivacySettings[K]
  ) => {
    setPrivacy((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <TabsContent value="privacy" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
          <CardDescription>
            Control your privacy and data sharing preferences
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">Profile Visibility</Label>
            <p className="text-sm text-gray-500">
              Choose who can see your profile information
            </p>
            <Select
              value={privacy.profileVisibility}
              onValueChange={(value) =>
                updatePrivacy(
                  "profileVisibility",
                  value as "public" | "private" | "organization"
                )
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="public">
                  Public - Anyone can see your profile
                </SelectItem>
                <SelectItem value="organization">
                  Organization - Only organization members
                </SelectItem>
                <SelectItem value="private">
                  Private - Only you can see your profile
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Show Email Address
                </Label>
                <p className="text-sm text-gray-500">
                  Display your email on your public profile
                </p>
              </div>
              <Switch
                checked={privacy.showEmail}
                onCheckedChange={(checked) =>
                  updatePrivacy("showEmail", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Show Location</Label>
                <p className="text-sm text-gray-500">
                  Display your location on your profile
                </p>
              </div>
              <Switch
                checked={privacy.showLocation}
                onCheckedChange={(checked) =>
                  updatePrivacy("showLocation", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">
                  Analytics & Performance
                </Label>
                <p className="text-sm text-gray-500">
                  Help us improve by sharing usage analytics
                </p>
              </div>
              <Switch
                checked={privacy.allowAnalytics}
                onCheckedChange={(checked) =>
                  updatePrivacy("allowAnalytics", checked)
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="text-base font-medium">Cookies</Label>
                <p className="text-sm text-gray-500">
                  Allow cookies for better user experience
                </p>
              </div>
              <Switch
                checked={privacy.allowCookies}
                onCheckedChange={(checked) =>
                  updatePrivacy("allowCookies", checked)
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default PrivacyTab;
