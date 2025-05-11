import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { MetadataForm } from "@/components/metadata/metadata-form";
import { BatchEditor } from "@/components/metadata/batch-editor";
import { HealthReport } from "@/components/metadata/health-report";
import { ValidationPanel } from "@/components/metadata/validation-panel";
import { ExternalLookupPanel } from "@/components/metadata/external-lookup";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { InsightPulseFeed } from "@/components/metadata/insight-pulse-feed";
import { MetadataProvider } from "@/contexts/metadata";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { PageLayout } from "@/components/layout/page-layout";

const Metadata = () => {
  const [activeView, setActiveView] = useState<"single" | "batch" | "lookup">("single");
  
  useEffect(() => {
    document.title = "Tuneator - Metadata Management";
  }, []);
  
  return (
    <PageLayout>
      <div className="flex min-h-screen w-full">
        <SidebarProvider>
          <div className="flex-1 overflow-hidden">
            <main className="container mx-auto p-4 md:p-6 space-y-6 pb-16">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h1 className="text-2xl font-bold">Metadata Management</h1>
                
                <div className="flex flex-wrap items-center gap-2">
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
                    variant={activeView === "lookup" ? "default" : "outline"} 
                    onClick={() => setActiveView("lookup")} 
                    className={activeView === "lookup" ? "bg-electric hover:bg-electric/90" : ""}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Lookup
                  </Button>
                </div>
              </div>
              
              {activeView === "single" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <Tabs defaultValue="editor">
                        <TabsList className="grid w-full max-w-full grid-cols-3">
                          <TabsTrigger value="editor">Editor</TabsTrigger>
                          <TabsTrigger value="health">Health Report</TabsTrigger>
                          <TabsTrigger value="validation">Validation</TabsTrigger>
                        </TabsList>
                        <TabsContent value="editor" className="mt-4">
                          <MetadataProvider>
                            <MetadataForm />
                          </MetadataProvider>
                        </TabsContent>
                        <TabsContent value="health" className="mt-4">
                          <MetadataProvider>
                            <HealthReport />
                          </MetadataProvider>
                        </TabsContent>
                        <TabsContent value="validation" className="mt-4">
                          <MetadataProvider>
                            <ValidationPanel />
                          </MetadataProvider>
                        </TabsContent>
                      </Tabs>
                    </div>
                    
                    <div className="w-full">
                      <MetadataProvider>
                        <InsightPulseFeed />
                      </MetadataProvider>
                    </div>
                  </div>
                </div>
              )}
              
              {activeView === "batch" && (
                <MetadataProvider>
                  <BatchEditor />
                </MetadataProvider>
              )}
              
              {activeView === "lookup" && (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Search across multiple music industry platforms including Spotify, YouTube, MusicBrainz, and Discogs to enrich your metadata.
                  </p>
                  <ExternalLookupPanel />
                </div>
              )}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </PageLayout>
  );
};

export default Metadata;

