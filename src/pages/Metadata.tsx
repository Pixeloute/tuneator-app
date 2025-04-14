
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { MetadataForm } from "@/components/metadata/metadata-form";
import { BatchEditor } from "@/components/metadata/batch-editor";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, FileWarning, Music, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <main className="p-4 md:p-6 space-y-6 pb-16">
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
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="md:col-span-1">
                      <CardHeader>
                        <CardTitle>Metadata Health</CardTitle>
                        <CardDescription>Overall catalog quality</CardDescription>
                      </CardHeader>
                      <CardContent className="flex flex-col items-center justify-center">
                        <ProgressCircle 
                          value={78} 
                          size={180} 
                          color="electric"
                          label="Health Score" 
                        />
                        <div className="mt-6 w-full space-y-1.5">
                          <div className="flex justify-between text-sm">
                            <span>Required Fields</span>
                            <span className="font-medium text-mint">92%</span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-mint rounded-full" style={{ width: '92%' }}></div>
                          </div>
                          
                          <div className="flex justify-between text-sm mt-2">
                            <span>Contributor Info</span>
                            <span className="font-medium text-electric">76%</span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-electric rounded-full" style={{ width: '76%' }}></div>
                          </div>
                          
                          <div className="flex justify-between text-sm mt-2">
                            <span>Rights & Registration</span>
                            <span className="font-medium text-yellow-500">65%</span>
                          </div>
                          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                            <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card className="md:col-span-2">
                      <CardHeader>
                        <CardTitle>Metadata Issues</CardTitle>
                        <CardDescription>Items requiring attention</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-3 rounded-md border border-red-500/30 bg-red-500/5 flex gap-3">
                            <div className="flex-shrink-0">
                              <FileWarning className="h-5 w-5 text-red-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Missing ISRC Codes</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                2 tracks are missing ISRC codes which are required for proper royalty tracking.
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="text-xs bg-muted/20">Urban Pulse.wav</Badge>
                                <Badge variant="outline" className="text-xs bg-muted/20">Digital Dreams.wav</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 rounded-md border border-yellow-500/30 bg-yellow-500/5 flex gap-3">
                            <div className="flex-shrink-0">
                              <AlertCircle className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Incomplete Contributors</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                5 tracks have incomplete contributor information which may affect royalty distribution.
                              </p>
                              <div className="flex gap-1 mt-2 flex-wrap">
                                <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Midnight Dreams.wav</Badge>
                                <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Urban Pulse.wav</Badge>
                                <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Synth Wave.wav</Badge>
                                <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Digital Dreams.wav</Badge>
                              </div>
                            </div>
                          </div>
                          
                          <div className="p-3 rounded-md border border-mint/30 bg-mint/5 flex gap-3">
                            <div className="flex-shrink-0">
                              <Check className="h-5 w-5 text-mint" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">Well-Documented Tracks</h4>
                              <p className="text-xs text-muted-foreground mt-1">
                                3 tracks have excellent metadata quality with no issues detected.
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Badge variant="outline" className="text-xs bg-mint/20 text-mint">Synth Wave.wav</Badge>
                                <Badge variant="outline" className="text-xs bg-mint/20 text-mint">Midnight Dreams.wav</Badge>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                <TabsContent value="validation" className="mt-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Metadata Validation</CardTitle>
                      <CardDescription>Verify your track information against industry standards</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                            <div className="flex items-center gap-2">
                              <Music className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">MusicBrainz</span>
                            </div>
                            <Badge variant="outline" className="bg-electric/10 text-electric">Connected</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                            <div className="flex items-center gap-2">
                              <Music className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">ASCAP</span>
                            </div>
                            <Badge variant="outline" className="bg-electric/10 text-electric">Connected</Badge>
                          </div>
                          
                          <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
                            <div className="flex items-center gap-2">
                              <Music className="h-5 w-5 text-muted-foreground" />
                              <span className="text-sm font-medium">BMI</span>
                            </div>
                            <Badge variant="outline" className="bg-muted/10 text-muted-foreground">Not Connected</Badge>
                          </div>
                        </div>
                        
                        <div className="rounded-md border border-border p-4">
                          <h3 className="text-sm font-medium mb-2">Validation Status</h3>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Artist Name</span>
                              <div className="flex items-center">
                                <Check className="h-4 w-4 text-mint mr-1" />
                                <span>Verified</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">ISRC Code</span>
                              <div className="flex items-center">
                                <Check className="h-4 w-4 text-mint mr-1" />
                                <span>Verified</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Album Title</span>
                              <div className="flex items-center">
                                <Check className="h-4 w-4 text-mint mr-1" />
                                <span>Verified</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">PRO Registration</span>
                              <div className="flex items-center">
                                <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                                <span>Partial</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Publishing Info</span>
                              <div className="flex items-center">
                                <FileWarning className="h-4 w-4 text-red-500 mr-1" />
                                <span>Missing</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-3 rounded-md bg-mint/10 border border-mint/20">
                        <div className="flex items-center gap-2 mb-2">
                          <Check className="h-5 w-5 text-mint" />
                          <h4 className="text-sm font-medium">Recent Validation</h4>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Last validated 2 days ago. 8 tracks were checked against MusicBrainz and ASCAP databases.
                          6 tracks passed all validation checks.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
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
