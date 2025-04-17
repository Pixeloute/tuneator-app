
import { ReactNode } from "react";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { SidebarProvider } from "@/components/ui/sidebar";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto p-4">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
