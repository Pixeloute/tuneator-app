
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MetadataEnrichmentPanel } from "@/components/ai-assistant/metadata-enrichment-panel";
import { SmartSuggestionsList } from "@/components/ai-assistant/smart-suggestions-list";
import { GenreAnalyzer } from "@/components/ai-assistant/genre-analyzer";
import { useToast } from "@/hooks/use-toast";

const SmartMetadataAssistant = () => {
  const { toast } = useToast();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  
  useEffect(() => {
    document.title = "TuneTrust - Smart Metadata AI Assistant";
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Smart Metadata AI Assistant</h1>
            </div>
            
            <Card className="border-l-4 border-l-electric">
              <CardHeader className="pb-2">
                <CardTitle>AI-Powered Metadata Enrichment</CardTitle>
                <CardDescription>
                  Let our AI analyze your tracks and suggest improvements to maximize their discoverability and revenue potential
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our AI assistant can help you optimize your metadata by analyzing audio content, identifying potential errors, 
                  suggesting keywords, and ensuring compliance with platform requirements.
                </p>
              </CardContent>
            </Card>
            
            <Tabs defaultValue="enrich">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="enrich">Enrichment</TabsTrigger>
                <TabsTrigger value="suggestions">Smart Suggestions</TabsTrigger>
                <TabsTrigger value="genre">Genre Analysis</TabsTrigger>
              </TabsList>
              
              <TabsContent value="enrich" className="mt-4">
                <MetadataEnrichmentPanel
                  onEnrichmentComplete={() => {
                    toast({
                      title: "Metadata Enriched",
                      description: "Track metadata has been successfully enhanced",
                    });
                  }}
                />
              </TabsContent>
              
              <TabsContent value="suggestions" className="mt-4">
                <SmartSuggestionsList 
                  activeTrack={activeTrack}
                  onSelectTrack={setActiveTrack}
                />
              </TabsContent>
              
              <TabsContent value="genre" className="mt-4">
                <GenreAnalyzer />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SmartMetadataAssistant;
