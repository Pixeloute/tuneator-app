
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";

export function NotificationsSettingsForm() {
  const { toast } = useToast();
  
  const handleSaveSettings = () => {
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Settings</CardTitle>
        <CardDescription>
          Customize how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-sm font-medium">Email Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-metadata-alerts">Metadata Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications about metadata issues and improvements
              </p>
            </div>
            <Switch id="email-metadata-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-royalty-updates">Royalty Updates</Label>
              <p className="text-sm text-muted-foreground">
                Get notified about significant changes in your royalty earnings
              </p>
            </div>
            <Switch id="email-royalty-updates" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-new-features">New Features</Label>
              <p className="text-sm text-muted-foreground">
                Stay updated on new platform features and improvements
              </p>
            </div>
            <Switch id="email-new-features" />
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-sm font-medium">In-App Notifications</h3>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-metadata-alerts">Metadata Alerts</Label>
              <p className="text-sm text-muted-foreground">
                Show real-time notifications for metadata issues
              </p>
            </div>
            <Switch id="app-metadata-alerts" defaultChecked />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="app-team-activity">Team Activity</Label>
              <p className="text-sm text-muted-foreground">
                Receive notifications when team members make changes
              </p>
            </div>
            <Switch id="app-team-activity" defaultChecked />
          </div>
        </div>
        
        <Button onClick={handleSaveSettings}>Save Preferences</Button>
        
        <div className="pt-4">
          <p className="text-muted-foreground text-sm">
            Note: These are placeholder settings and will be fully implemented in a future update.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
