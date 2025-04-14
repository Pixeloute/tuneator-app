
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AudioFileUploader } from "@/components/ai-assistant/audio-file-uploader";
import { AudioAttributesChart } from "@/components/ai-assistant/audio-attributes-chart";
import { GenreDistributionChart } from "@/components/ai-assistant/genre-distribution-chart";
import { AnalysisResultsDisplay } from "@/components/ai-assistant/analysis-results-display";
import { Spinner } from "@/components/ui/spinner";
import { getMetadataSuggestions, analyzeAudio } from "@/services/google-api";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Globe, Wand2, Music, Tags, Headphones, User } from "lucide-react";

export const GenreAnalyzer = () => {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [additionalMetadata, setAdditionalMetadata] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("attributes");
  
  const handleFileSelected = (file: File) => {
    setAudioFile(file);
    setAnalysisResults(null);
    setAdditionalMetadata(null);
  };
  
  const handleAnalyze = async () => {
    if (!audioFile) return;
    
    setIsAnalyzing(true);
    
    try {
      // Perform audio analysis
      const results = await analyzeAudio(audioFile);
      setAnalysisResults(results);
      
      // Get additional metadata suggestions
      const additionalData = await getMetadataSuggestions(audioFile.name.replace(/\.[^/.]+$/, ""), "Unknown Artist");
      setAdditionalMetadata(additionalData);
      
      toast({
        title: "Analysis Complete",
        description: "Your track has been analyzed successfully",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis Failed",
        description: "There was an error analyzing your track",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };
  
  const genreConfidenceToArray = () => {
    if (!additionalMetadata || !additionalMetadata.genreConfidence) return [];
    
    return Object.entries(additionalMetadata.genreConfidence).map(([name, value]) => ({
      name,
      value: Number(value) * 100
    }));
  };
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>AI-Powered Genre Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <AudioFileUploader onFileSelected={handleFileSelected} />
          
          {audioFile && (
            <div className="flex justify-end">
              <Button 
                onClick={handleAnalyze} 
                disabled={isAnalyzing} 
                className="bg-electric hover:bg-electric/90"
              >
                {isAnalyzing ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Analyze with AI
                  </>
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      {analysisResults && additionalMetadata && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="attributes">Audio Attributes</TabsTrigger>
              <TabsTrigger value="genres">Genre Analysis</TabsTrigger>
              <TabsTrigger value="market">Market Fit</TabsTrigger>
              <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
            </TabsList>
            
            <TabsContent value="attributes" className="mt-4 space-y-4">
              <AudioAttributesChart
                energy={analysisResults.energy || 0}
                danceability={analysisResults.danceability || 0}
                instrumentalness={analysisResults.instrumentalness || 0}
                acousticness={analysisResults.acousticness || 0}
                valence={analysisResults.valence || 0}
              />
              <AnalysisResultsDisplay results={analysisResults} />
            </TabsContent>
            
            <TabsContent value="genres" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Music className="h-4 w-4 text-electric" />
                    Genre Distribution
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GenreDistributionChart data={genreConfidenceToArray()} />
                  
                  <div className="mt-4 space-y-2">
                    <Label>Primary Genre</Label>
                    <Select defaultValue={Object.entries(additionalMetadata.genreConfidence)[0]?.[0] || ""}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select primary genre" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(additionalMetadata.genreConfidence).map(([genre]) => (
                          <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="mt-4">
                    <Label className="mb-2 block">Recommended Tags</Label>
                    <div className="flex flex-wrap gap-2">
                      {additionalMetadata.recommendedTags.map((tag: string) => (
                        <Badge key={tag} variant="outline" className="bg-muted">
                          {tag}
                        </Badge>
                      ))}
                      {additionalMetadata.moodTags.slice(0, 3).map((tag: string) => (
                        <Badge key={tag} variant="outline" className="bg-electric/10 text-electric border-electric/20">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="market" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Globe className="h-4 w-4 text-mint" />
                    Market Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Target Markets</Label>
                    <div className="flex flex-wrap gap-2">
                      {additionalMetadata.marketRecommendations.map((market: string) => (
                        <Badge key={market} variant="outline" className="bg-mint/10 text-mint border-mint/20">
                          {market}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      These markets show the highest affinity for your genre and style of music.
                    </p>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Mood Classification</Label>
                    <div className="flex flex-wrap gap-2">
                      {additionalMetadata.moodTags.map((mood: string) => (
                        <Badge key={mood} variant="outline" className="bg-secondary">
                          {mood}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Playlist Potential</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4 text-electric" />
                            <span className="text-sm font-medium">Chillout & Ambient</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">High match potential</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4 text-electric" />
                            <span className="text-sm font-medium">Electronic Focus</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">High match potential</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4 text-mint" />
                            <span className="text-sm font-medium">Study & Concentration</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Medium match potential</p>
                        </CardContent>
                      </Card>
                      <Card className="bg-muted/50">
                        <CardContent className="p-3">
                          <div className="flex items-center gap-2">
                            <Headphones className="h-4 w-4 text-mint" />
                            <span className="text-sm font-medium">Atmospheric Electronic</span>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Medium match potential</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="recommendations" className="mt-4 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Tags className="h-4 w-4 text-electric" />
                    Metadata Enhancement Suggestions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="mb-2 block">Recommended Keywords</Label>
                    <div className="flex flex-wrap gap-2">
                      {additionalMetadata.keywords.map((keyword: string) => (
                        <Badge key={keyword} variant="outline" className="bg-secondary">
                          {keyword}
                        </Badge>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Add these keywords to your track metadata to improve discoverability.
                    </p>
                  </div>
                  
                  <div>
                    <Label className="mb-2 block">Similar Artists</Label>
                    <div className="flex flex-wrap gap-2">
                      {additionalMetadata.similarArtists.map((artist: string) => (
                        <div key={artist} className="flex items-center gap-1 text-sm bg-muted/50 px-2 py-1 rounded-md">
                          <User className="h-3 w-3" />
                          <span>{artist}</span>
                        </div>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      Your track may appeal to fans of these artists.
                    </p>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">AI Recommendations</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20 mt-0.5">Tip</Badge>
                        <span>Add "{additionalMetadata.moodTags[0]}" and "{additionalMetadata.moodTags[1]}" as mood descriptors</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20 mt-0.5">Tip</Badge>
                        <span>Register for royalty collection in {additionalMetadata.marketRecommendations.slice(0, 3).join(", ")}</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="bg-electric/10 text-electric border-electric/20 mt-0.5">Action</Badge>
                        <span>Consider creating a "{additionalMetadata.recommendedTags[0]}" alternative mix to maximize playlist potential</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Badge variant="outline" className="bg-electric/10 text-electric border-electric/20 mt-0.5">Action</Badge>
                        <span>Target pitching to curators of {genreConfidenceToArray()[0]?.name || "Electronic"} playlists</span>
                      </li>
                    </ul>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="w-full bg-electric hover:bg-electric/90">
                    <Wand2 className="h-4 w-4 mr-2" />
                    Apply Metadata Suggestions
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
};
