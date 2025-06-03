import React from "react";
import { User } from "@supabase/supabase-js";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountSettingsForm } from "./account-settings-form";
import { AppearanceSettingsForm } from "./appearance-settings-form";
import { SecuritySettingsForm } from "./security-settings-form";
import { NotificationsSettingsForm } from "./notifications-settings-form";
import { FeatureFlag } from '@/lib/feature-flags';
import { EnterpriseSettingsPanel } from "./enterprise-settings-panel";

interface SettingsTabsProps {
  user: User;
}

export function SettingsTabs({ user }: SettingsTabsProps) {
  return (
    <Tabs defaultValue="account" className="space-y-4">
      <TabsList className="w-full flex overflow-x-auto space-x-2 bg-muted p-1 rounded-md text-muted-foreground scrollbar-hide" role="tablist">
        <TabsTrigger value="account" className="min-w-[110px] whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-sm transition-all">Account</TabsTrigger>
        <TabsTrigger value="appearance" className="min-w-[110px] whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-sm transition-all">Appearance</TabsTrigger>
        <TabsTrigger value="security" className="min-w-[110px] whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-sm transition-all">Security</TabsTrigger>
        <TabsTrigger value="notifications" className="min-w-[110px] whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-sm transition-all">Notifications</TabsTrigger>
        {FeatureFlag.ENTERPRISE_SETTINGS === 'enterprise_settings' && (
          <TabsTrigger value="enterprise" className="min-w-[110px] whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-sm transition-all">Enterprise</TabsTrigger>
        )}
        {FeatureFlag.ONBOARDING === 'onboarding' && (
          <TabsTrigger value="onboarding" className="min-w-[110px] whitespace-nowrap px-3 py-1.5 text-sm font-medium rounded-sm transition-all">Onboarding</TabsTrigger>
        )}
      </TabsList>
      <div className="mt-4 space-y-4">
        <TabsContent value="account">
          <AccountSettingsForm user={user} />
        </TabsContent>
        <TabsContent value="appearance">
          <AppearanceSettingsForm />
        </TabsContent>
        <TabsContent value="security">
          <SecuritySettingsForm user={user} />
        </TabsContent>
        <TabsContent value="notifications">
          <NotificationsSettingsForm />
        </TabsContent>
        {FeatureFlag.ENTERPRISE_SETTINGS === 'enterprise_settings' && (
          <TabsContent value="enterprise">
            <EnterpriseSettingsPanel />
          </TabsContent>
        )}
        {FeatureFlag.ONBOARDING === 'onboarding' && (
          <TabsContent value="onboarding">
            <div className="p-4">Onboarding coming soon.</div>
          </TabsContent>
        )}
      </div>
    </Tabs>
  );
}
