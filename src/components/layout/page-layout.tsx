
import { ReactNode } from "react";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";

interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-background">
      <AppSidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <TopBar />
        <main className="flex-1 overflow-auto p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
