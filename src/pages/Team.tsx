
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { useMessages } from '@/hooks/use-messages';
import { MessageList } from '@/components/messaging/MessageList';
import { MessageInput } from '@/components/messaging/MessageInput';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

const Team = () => {
  const { messages, sendMessage, loading: messagesLoading } = useMessages();
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
            <div className="flex items-center space-x-2 mb-4">
              <Users className="h-6 w-6 text-electric" />
              <h1 className="text-2xl font-bold">Team Messaging</h1>
            </div>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Team Chat</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[500px] flex flex-col">
                  {messagesLoading ? (
                    <div className="flex-1 flex items-center justify-center">
                      <p className="text-muted-foreground">Loading messages...</p>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="flex-1 flex items-center justify-center flex-col p-8">
                      <p className="text-muted-foreground text-center">No messages yet.</p>
                      <p className="text-muted-foreground text-center text-sm mt-1">
                        Be the first to start the conversation!
                      </p>
                    </div>
                  ) : (
                    <MessageList 
                      messages={messages} 
                      currentUserId={user?.id} 
                    />
                  )}
                  <MessageInput onSendMessage={sendMessage} />
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Team;
