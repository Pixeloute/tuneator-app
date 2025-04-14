
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { MetadataEnrichmentPanel } from "@/components/ai-assistant/metadata-enrichment-panel";
import { SmartSuggestionsList } from "@/components/ai-assistant/smart-suggestions-list";
import { GenreAnalyzer } from "@/components/ai-assistant/genre-analyzer";
import { useToast } from "@/hooks/use-toast";
import { Share2, Users, History, Bot, BrainCircuit, Sparkles, Clock } from "lucide-react";

const SmartMetadataAssistant = () => {
  const { toast } = useToast();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [isCollaborative, setIsCollaborative] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("enrich");
  
  useEffect(() => {
    document.title = "Tuneator - Smart Metadata AI Assistant";
  }, []);

  const collaborators = [
    { id: 1, name: "Jane Smith", role: "Manager", avatar: "" },
    { id: 2, name: "John Doe", role: "Editor", avatar: "" },
  ];

  const recentChanges = [
    { id: 1, user: "Jane Smith", action: "Applied genre suggestions to 'Midnight Dreams'", time: "10 minutes ago" },
    { id: 2, user: "John Doe", action: "Enhanced keywords for 'Electric Sunrise'", time: "25 minutes ago" },
    { id: 3, user: "AI Assistant", action: "Generated new tag recommendations", time: "1 hour ago" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Smart Metadata AI Assistant</h1>
              
              <div className="flex items-center space-x-2">
                <Switch
                  id="collaborative-mode"
                  checked={isCollaborative}
                  onCheckedChange={setIsCollaborative}
                />
                <Label htmlFor="collaborative-mode" className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  Collaborative Mode
                </Label>
                <Button variant="outline" size="sm" className="flex items-center gap-1 ml-2">
                  <Share2 className="h-4 w-4" />
                  <span>Share</span>
                </Button>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3 space-y-6">
                <Card className="border-l-4 border-l-electric">
                  <CardHeader className="pb-2">
                    <CardTitle>Google AI-Powered Metadata Enrichment</CardTitle>
                    <CardDescription>
                      Let our Google AI technology analyze your tracks and suggest improvements to maximize their discoverability and revenue potential
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Our Google AI assistant can help you optimize your metadata by analyzing audio content, identifying potential errors, 
                      suggesting keywords, and ensuring compliance with platform requirements.
                    </p>
                  </CardContent>
                </Card>
                
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full max-w-md grid-cols-3">
                    <TabsTrigger value="enrich">
                      <Sparkles className="h-4 w-4 mr-2" />
                      Enrichment
                    </TabsTrigger>
                    <TabsTrigger value="suggestions">
                      <BrainCircuit className="h-4 w-4 mr-2" />
                      Smart Suggestions
                    </TabsTrigger>
                    <TabsTrigger value="genre">
                      <Bot className="h-4 w-4 mr-2" />
                      Genre Analysis
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="enrich" className="mt-4">
                    <MetadataEnrichmentPanel
                      onEnrichmentComplete={() => {
                        toast({
                          title: "Metadata Enriched",
                          description: "Track metadata has been successfully enhanced with Google AI",
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
              </div>
              
              {isCollaborative && (
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Users className="h-4 w-4 text-electric" />
                        Active Collaborators
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {collaborators.map((user) => (
                        <div key={user.id} className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-medium">{user.name}</div>
                            <div className="text-xs text-muted-foreground">{user.role}</div>
                          </div>
                          <Badge className="ml-auto bg-green-100 text-green-800 border-green-200">
                            Online
                          </Badge>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <History className="h-4 w-4 text-electric" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {recentChanges.map((change) => (
                        <div key={change.id} className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{change.user}</span>
                            {change.user === "AI Assistant" && (
                              <Badge variant="outline" className="bg-electric/10 text-electric border-electric/20">
                                AI
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm">{change.action}</p>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <Clock className="h-3 w-3 mr-1" />
                            {change.time}
                          </div>
                          <div className="pt-2 border-b border-border" />
                        </div>
                      ))}
                    </CardContent>
                    <CardFooter>
                      <Button variant="ghost" size="sm" className="w-full text-xs">
                        View All Activity
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SmartMetadataAssistant;
