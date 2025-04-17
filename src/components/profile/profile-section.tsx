
import React, { useState } from "react";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ProfileForm } from "./profile-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface ProfileSectionProps {
  user: User;
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);

  // Get user information from metadata
  const metadata = user.user_metadata || {};
  const firstName = metadata.first_name || "";
  const lastName = metadata.last_name || "";
  const avatarUrl = metadata.avatar_url;

  const getInitials = () => {
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    }
    return user.email ? user.email.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Manage your profile information and preferences
              </CardDescription>
            </div>
            <Button 
              variant="outline" 
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? "Cancel" : "Edit Profile"}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-4">
          {isEditing ? (
            <ProfileForm 
              user={user} 
              onCancel={() => setIsEditing(false)}
              onSuccess={() => setIsEditing(false)}
            />
          ) : (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex items-center justify-center">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={avatarUrl} />
                  <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                </Avatar>
              </div>
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                  <p className="text-base">{firstName} {lastName}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Email Address</h3>
                  <p className="text-base">{user.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Account Created</h3>
                  <p className="text-base">
                    {user.created_at ? new Date(user.created_at).toLocaleDateString() : "N/A"}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="activity">
        <TabsList>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
          <TabsTrigger value="notifications">Notification Preferences</TabsTrigger>
        </TabsList>
        <TabsContent value="activity" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>View your recent actions in the system</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>No recent activity found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="notifications" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>Manage how you receive notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-muted-foreground">
                <p>Notification settings will be available in a future update</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
