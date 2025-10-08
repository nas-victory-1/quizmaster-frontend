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
import { useState } from "react";

interface AppearanceSettings {
  theme: "light" | "dark" | "system";
  language: string;
  dateFormat: string;
  timeFormat: "12h" | "24h";
}

const AppearanceTab = () => {
  const [appearance, setAppearance] = useState<AppearanceSettings>({
    theme: "system",
    language: "en",
    dateFormat: "MM/DD/YYYY",
    timeFormat: "12h",
  });

  const updateAppearance = <K extends keyof AppearanceSettings>(
    field: K,
    value: AppearanceSettings[K]
  ) => {
    setAppearance((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <TabsContent value="appearance" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Appearance & Language</CardTitle>
          <CardDescription>
            Customize how QuizMaster looks and feels
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="text-base font-medium">Theme</Label>
            <p className="text-sm text-gray-500">Choose your preferred theme</p>
            <Select
              value={appearance.theme}
              onValueChange={(value) =>
                updateAppearance("theme", value as "light" | "dark" | "system")
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System (Auto)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-base font-medium">Language</Label>
            <p className="text-sm text-gray-500">
              Select your preferred language
            </p>
            <Select
              value={appearance.language}
              onValueChange={(value) => updateAppearance("language", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Español</SelectItem>
                <SelectItem value="fr">Français</SelectItem>
                <SelectItem value="de">Deutsch</SelectItem>
                <SelectItem value="it">Italiano</SelectItem>
                <SelectItem value="pt">Português</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-base font-medium">Date Format</Label>
              <Select
                value={appearance.dateFormat}
                onValueChange={(value) => updateAppearance("dateFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-base font-medium">Time Format</Label>
              <Select
                value={appearance.timeFormat}
                onValueChange={(value) =>
                  updateAppearance("timeFormat", value as "12h" | "24h")
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="12h">12 Hour (AM/PM)</SelectItem>
                  <SelectItem value="24h">24 Hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default AppearanceTab;
