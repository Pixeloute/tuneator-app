
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { useMessages } from '@/hooks/use-messages';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';

const Team = () => {
  const { messages, sendMessage } = useMessages();
  const { user, loading: authLoading } = useAuth();

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" />;
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <h1 className="text-2xl font-bold">Team Messaging</h1>
            <div className="border rounded-lg shadow-sm">
              <MessageList 
                messages={messages} 
                currentUserId={user?.id} 
              />
              <MessageInput onSendMessage={sendMessage} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Team;
