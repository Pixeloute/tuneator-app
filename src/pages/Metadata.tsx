
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { MetadataForm } from "@/components/metadata/metadata-form";
import { BatchEditor } from "@/components/metadata/batch-editor";
import { HealthReport } from "@/components/metadata/health-report";
import { ValidationPanel } from "@/components/metadata/validation-panel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

const Metadata = () => {
  const [activeView, setActiveView] = useState<"single" | "batch">("single");

  useEffect(() => {
    document.title = "TuneTrust - Metadata Management";
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16 max-w-[1920px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Metadata Management</h1>
              
              <div className="flex items-center gap-2">
                <Button
                  variant={activeView === "single" ? "default" : "outline"}
                  onClick={() => setActiveView("single")}
                  className={activeView === "single" ? "bg-electric hover:bg-electric/90" : ""}
                >
                  Single Track
                </Button>
                <Button
                  variant={activeView === "batch" ? "default" : "outline"}
                  onClick={() => setActiveView("batch")}
                  className={activeView === "batch" ? "bg-electric hover:bg-electric/90" : ""}
                >
                  Batch Editor
                </Button>
                <Button
                  variant="outline"
                  className="ml-2 border-electric text-electric"
                  asChild
                >
                  <Link to="/ai-assistant">
                    <Sparkles className="h-4 w-4 mr-2" />
                    AI Assistant
                  </Link>
                </Button>
              </div>
            </div>
            
            {activeView === "single" ? (
              <Tabs defaultValue="editor">
                <TabsList className="grid w-full max-w-md grid-cols-3">
                  <TabsTrigger value="editor">Editor</TabsTrigger>
                  <TabsTrigger value="health">Health Report</TabsTrigger>
                  <TabsTrigger value="validation">Validation</TabsTrigger>
                </TabsList>
                <TabsContent value="editor" className="mt-4">
                  <MetadataForm />
                </TabsContent>
                <TabsContent value="health" className="mt-4">
                  <HealthReport />
                </TabsContent>
                <TabsContent value="validation" className="mt-4">
                  <ValidationPanel />
                </TabsContent>
              </Tabs>
            ) : (
              <BatchEditor />
            )}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Metadata;
