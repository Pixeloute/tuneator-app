
import React, { useState, useEffect } from "react";
import { PageLayout } from "@/components/layout/page-layout";
import { SettingsTabs } from "@/components/settings/settings-tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Spinner } from "@/components/ui/spinner";

const Settings = () => {
  const { user, loading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Tuneator - Settings";
    // When the auth system is done loading, we can finish our loading state
    if (!loading) {
      setIsLoading(false);
    }
  }, [loading]);

  if (isLoading || loading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </PageLayout>
    );
  }

  if (!user) {
    // Handle the case where the user is not logged in
    toast({
      title: "Authentication required",
      description: "Please log in to access settings",
      variant: "destructive",
    });
    return (
      <PageLayout>
        <div className="flex flex-col items-center justify-center h-full">
          <h1 className="text-2xl font-bold mb-4">Authentication Required</h1>
          <p className="text-muted-foreground">Please log in to access settings</p>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container max-w-4xl py-6">
        <h1 className="text-3xl font-bold mb-6">Settings</h1>
        <SettingsTabs user={user} />
      </div>
    </PageLayout>
  );
};

export default Settings;
