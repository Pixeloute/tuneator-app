
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export function AppearanceSettingsForm() {
  const { toast } = useToast();
  
  const handleThemeChange = (theme: string) => {
    // This would change the theme in a real implementation
    toast({
      title: "Theme changed",
      description: `Theme switched to ${theme}. This is a placeholder for future functionality.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance Settings</CardTitle>
        <CardDescription>
          Customize how Tuneator looks for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Theme</Label>
          <RadioGroup defaultValue="dark" className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="dark" id="dark" onClick={() => handleThemeChange("dark")} />
              <Label htmlFor="dark">Dark (Default)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="light" id="light" onClick={() => handleThemeChange("light")} />
              <Label htmlFor="light">Light</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="system" id="system" onClick={() => handleThemeChange("system")} />
              <Label htmlFor="system">System</Label>
            </div>
          </RadioGroup>
        </div>
        
        <div className="space-y-2">
          <Label>Font Size</Label>
          <RadioGroup defaultValue="medium" className="grid grid-cols-1 gap-4 pt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="small" id="small" />
              <Label htmlFor="small">Small</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="medium" id="medium" />
              <Label htmlFor="medium">Medium (Default)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="large" id="large" />
              <Label htmlFor="large">Large</Label>
            </div>
          </RadioGroup>
        </div>
        
        <Button>Save Preferences</Button>
        
        <div className="pt-4">
          <p className="text-muted-foreground text-sm">
            Note: Appearance settings will be fully implemented in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
