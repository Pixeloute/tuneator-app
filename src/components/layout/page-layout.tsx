import { ReactNode } from "react";
import { TopBar } from "@/components/navigation/top-bar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";

export function PageLayout() {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen bg-background">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-auto p-4 font-sans">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
