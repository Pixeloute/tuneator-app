import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { Switch } from '@/components/ui/switch';
import { FeatureFlag } from '@/lib/feature-flags';

export function AppearanceSettingsForm() {
  const { toast } = useToast();
  
  // In a real app, this would come from user settings or context
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  const handleThemeChange = (theme: string) => {
    // This would change the theme in a real implementation
    toast({
      title: "Theme changed",
      description: `Theme switched to ${theme}. This is a placeholder for future functionality.`,
    });
  };

  const handleToggle = (checked: boolean) => {
    setDarkMode(checked);
    document.documentElement.classList.toggle('dark', checked);
    localStorage.setItem('theme', checked ? 'dark' : 'light');
  };

  // Feature flag check (expand as needed)
  if (FeatureFlag.DARK_MODE !== 'dark_mode') return null;

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
          <div className="flex items-center gap-6 py-2">
            <span className="text-sm">Theme</span>
            <div className="flex items-center gap-2">
              <Switch checked={darkMode} onCheckedChange={handleToggle} />
              <span className="text-xs">Dark</span>
              <Switch checked={!darkMode} onCheckedChange={v => handleToggle(!v)} />
              <span className="text-xs">Light</span>
            </div>
          </div>
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
