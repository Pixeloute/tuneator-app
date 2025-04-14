
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Badge } from "@/components/ui/badge";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Search, Music, User, Disc, Youtube, Info, Database, ExternalLink, Copy } from "lucide-react";
import apiService from "@/services/api-service";
import type { EnrichedMetadata } from "@/services/types/shared-types";
import { useToast } from "@/hooks/use-toast";

export const ExternalLookupPanel = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isrc, setIsrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("comprehensive");
  const [results, setResults] = useState<EnrichedMetadata | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  
  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: "Empty Search",
        description: "Please enter a search query.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    setSearchPerformed(true);
    
    try {
      // Parse the search query to extract artist and track
      const parts = searchQuery.split(" - ");
      const artist = parts.length > 1 ? parts[0].trim() : "";
      const track = parts.length > 1 ? parts[1].trim() : searchQuery.trim();
      
      const metadata = await apiService.getComprehensiveMetadata(track, artist, isrc || undefined);
      setResults(metadata);
      
      toast({
        title: "Search Complete",
        description: "Metadata lookup completed successfully.",
      });
    } catch (error) {
      console.error("Metadata lookup error:", error);
      toast({
        title: "Search Error",
        description: "An error occurred during metadata lookup.",
        variant: "destructive",
      });
      setResults(null);
    } finally {
      setIsLoading(false);
    }
  };
  
  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: `${label} copied to clipboard.`,
    });
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5 text-electric" />
          External Metadata Lookup
        </CardTitle>
        <CardDescription>
          Search across multiple music platforms to enrich your metadata
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="search">Search Query (Artist - Track)</Label>
            <div className="flex gap-2">
              <Input
                id="search"
                placeholder="e.g. Daft Punk - Get Lucky"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-electric hover:bg-electric/90"
              >
                {isLoading ? <Spinner className="mr-2" /> : <Search className="mr-2 h-4 w-4" />}
                Search
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="isrc">ISRC (Optional)</Label>
              <HoverCard>
                <HoverCardTrigger>
                  <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <p className="text-xs">
                    International Standard Recording Code (ISRC) is a unique identifier for recordings.
                    Adding an ISRC can improve search accuracy.
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <Input
              id="isrc"
              placeholder="e.g. USRC17607839"
              value={isrc}
              onChange={(e) => setIsrc(e.target.value)}
            />
          </div>
          
          {searchPerformed && (
            <div className="pt-4">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <Spinner className="h-8 w-8 mb-4" />
                  <p className="text-muted-foreground">Searching across multiple platforms...</p>
                </div>
              ) : results ? (
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="comprehensive">Overview</TabsTrigger>
                    <TabsTrigger value="audio">Audio Info</TabsTrigger>
                    <TabsTrigger value="links">Links</TabsTrigger>
                    <TabsTrigger value="details">Details</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="comprehensive" className="space-y-4">
                    {/* Track and Artist Info */}
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        {results.album?.artwork && (
                          <img
                            src={results.album.artwork}
                            alt="Album Artwork"
                            className="w-24 h-24 object-cover rounded-md"
                          />
                        )}
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold">{results.title}</h3>
                          {results.artists && results.artists.length > 0 && (
                            <div className="flex flex-wrap gap-1 items-center">
                              <span className="text-muted-foreground">by</span>
                              {results.artists.map((artist, index) => (
                                <span key={index} className="text-md">
                                  {artist.name}
                                  {index < results.artists!.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          )}
                          {results.album?.title && (
                            <p className="text-sm text-muted-foreground">
                              Album: {results.album.title}
                            </p>
                          )}
                          {results.album?.releaseDate && (
                            <p className="text-sm text-muted-foreground">
                              Released: {results.album.releaseDate}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Genres and Styles */}
                      {(results.genres || results.styles) && (
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">Genres & Styles</h4>
                          <div className="flex flex-wrap gap-1">
                            {results.genres?.map((genre, index) => (
                              <Badge key={`genre-${index}`} variant="secondary">
                                {genre}
                              </Badge>
                            ))}
                            {results.styles?.map((style, index) => (
                              <Badge key={`style-${index}`} variant="outline" className="bg-muted">
                                {style}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      {/* ISRC */}
                      {results.isrc && (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium">ISRC:</span>
                          <code className="bg-muted px-1 py-0.5 rounded text-sm">
                            {results.isrc}
                          </code>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyToClipboard(results.isrc!, "ISRC")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="audio" className="space-y-4">
                    {/* Audio Features */}
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">Audio Characteristics</h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {results.bpm && (
                          <div className="bg-muted p-3 rounded-md">
                            <h4 className="text-sm font-medium">Tempo (BPM)</h4>
                            <p className="text-2xl font-semibold">{Math.round(results.bpm)}</p>
                          </div>
                        )}
                        
                        {results.key && (
                          <div className="bg-muted p-3 rounded-md">
                            <h4 className="text-sm font-medium">Key</h4>
                            <p className="text-2xl font-semibold">{results.key}</p>
                          </div>
                        )}
                        
                        {results.duration && (
                          <div className="bg-muted p-3 rounded-md">
                            <h4 className="text-sm font-medium">Duration</h4>
                            <p className="text-2xl font-semibold">
                              {Math.floor(results.duration / 60000)}:{String(Math.floor((results.duration % 60000) / 1000)).padStart(2, '0')}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      {results.audioFeatures && (
                        <div className="space-y-2 pt-2">
                          <h4 className="text-sm font-medium">Audio Analysis</h4>
                          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                            {Object.entries(results.audioFeatures).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <p className="text-xs capitalize">{key}</p>
                                <div className="h-2 bg-muted rounded-full overflow-hidden">
                                  <div
                                    className="h-full bg-electric"
                                    style={{ width: `${Number(value) * 100}%` }}
                                  />
                                </div>
                                <p className="text-xs text-right">{Math.round(Number(value) * 100)}%</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="links" className="space-y-4">
                    {/* External Links */}
                    <div className="space-y-4">
                      <h3 className="text-md font-medium">External Platform Links</h3>
                      
                      <div className="grid grid-cols-1 gap-2">
                        {results.externalLinks?.spotify && (
                          <a
                            href={results.externalLinks.spotify}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                          >
                            <Music className="h-5 w-5 text-[#1DB954]" />
                            <span>View on Spotify</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        
                        {results.externalLinks?.youtube && (
                          <a
                            href={results.externalLinks.youtube}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                          >
                            <Youtube className="h-5 w-5 text-[#FF0000]" />
                            <span>View on YouTube</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        
                        {results.externalLinks?.musicbrainz && (
                          <a
                            href={results.externalLinks.musicbrainz}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                          >
                            <Database className="h-5 w-5 text-[#BA478F]" />
                            <span>View on MusicBrainz</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                        
                        {results.externalLinks?.discogs && (
                          <a
                            href={results.externalLinks.discogs}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 p-2 bg-muted rounded-md hover:bg-muted/80 transition-colors"
                          >
                            <Disc className="h-5 w-5 text-[#333333]" />
                            <span>View on Discogs</span>
                            <ExternalLink className="h-4 w-4 ml-auto" />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {/* Videos */}
                    {results.videos && results.videos.length > 0 && (
                      <div className="space-y-2 pt-2">
                        <h4 className="text-sm font-medium">Related Videos</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {results.videos.slice(0, 4).map((video, index) => (
                            <a
                              key={index}
                              href={video.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group block"
                            >
                              <div className="relative pb-[56.25%] overflow-hidden rounded-md bg-muted">
                                {video.thumbnail ? (
                                  <img
                                    src={video.thumbnail}
                                    alt={video.title}
                                    className="absolute inset-0 w-full h-full object-cover transition-transform group-hover:scale-105"
                                  />
                                ) : (
                                  <div className="absolute inset-0 flex items-center justify-center">
                                    <Youtube className="h-8 w-8 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                              <p className="text-xs mt-1 line-clamp-1">{video.title}</p>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="details" className="space-y-4">
                    {/* Credits */}
                    {results.credits && results.credits.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Credits</h4>
                        <div className="border rounded-md divide-y">
                          {results.credits.map((credit, index) => (
                            <div key={index} className="flex items-center justify-between p-2">
                              <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span>{credit.name}</span>
                              </div>
                              <Badge variant="outline">{credit.role}</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Related Artists */}
                    {results.relatedArtists && results.relatedArtists.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium">Related Artists</h4>
                        <div className="flex flex-wrap gap-1">
                          {results.relatedArtists.map((artist, index) => (
                            <Badge key={index} className="bg-electric/10 text-electric border-electric/30">
                              {artist.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Label Info */}
                    {results.album?.label && (
                      <div className="space-y-1">
                        <h4 className="text-sm font-medium">Label</h4>
                        <p>{results.album.label}</p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
              ) : (
                <Alert>
                  <AlertDescription>
                    No results found. Try adjusting your search query or adding an ISRC.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Powered by Spotify, YouTube, MusicBrainz, and Discogs APIs
        </p>
        
        {results && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              // Format metadata as JSON for clipboard
              const metadataJson = JSON.stringify(results, null, 2);
              copyToClipboard(metadataJson, "Metadata");
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Metadata
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};
