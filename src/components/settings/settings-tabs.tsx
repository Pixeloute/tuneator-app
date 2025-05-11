import React from "react";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettingsForm } from "./account-settings-form";
import { AppearanceSettingsForm } from "./appearance-settings-form";
import { SecuritySettingsForm } from "./security-settings-form";
import { NotificationsSettingsForm } from "./notifications-settings-form";
import { FeatureFlag } from '@/lib/feature-flags';

interface SettingsTabsProps {
  user: User;
}

export function SettingsTabs({ user }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="account" className="space-y-4">
      <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:w-[600px]">
        <TabsTrigger value="account">Account</TabsTrigger>
        <TabsTrigger value="appearance">Appearance</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
        <TabsTrigger value="notifications">Notifications</TabsTrigger>
        {FeatureFlag.ONBOARDING === 'onboarding' && (
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
        )}
      </TabsList>
      
      <TabsContent value="account" className="space-y-4">
        <AccountSettingsForm user={user} />
      </TabsContent>
      
      <TabsContent value="appearance" className="space-y-4">
        <AppearanceSettingsForm />
      </TabsContent>
      
      <TabsContent value="security" className="space-y-4">
        <SecuritySettingsForm user={user} />
      </TabsContent>
      
      <TabsContent value="notifications" className="space-y-4">
        <NotificationsSettingsForm />
      </TabsContent>
      
      {FeatureFlag.ONBOARDING === 'onboarding' && (
        <TabsContent value="onboarding" className="space-y-4">
          <div className="p-4">Onboarding coming soon.</div>
        </TabsContent>
      )}
    </Tabs>
  );
}
