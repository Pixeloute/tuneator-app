
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Database, Music, MusicIcon, User, Building2, FileText, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import apiService from "@/services/api-service";
import { EnrichedMetadata } from "@/services/api-service";

type SearchType = 'title' | 'performer' | 'writer' | 'publisher' | 'isrc' | 'iswc' | 'work_id';

export const ExternalLookupPanel = () => {
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<EnrichedMetadata | null>(null);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['musicbrainz', 'spotify', 'discogs']);
  const [activeTab, setActiveTab] = useState('overview');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    try {
      // Here we would call the comprehensive search API
      const results = await apiService.getComprehensiveMetadata(searchQuery, "", "");
      setSearchResults(results);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms(prev => 
      prev.includes(platform) 
        ? prev.filter(p => p !== platform) 
        : [...prev, platform]
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>External Metadata Lookup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="w-full md:w-1/4">
              <Select value={searchType} onValueChange={(value: SearchType) => setSearchType(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Search by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="performer">Performer</SelectItem>
                  <SelectItem value="writer">Writer/Composer</SelectItem>
                  <SelectItem value="publisher">Publisher</SelectItem>
                  <SelectItem value="isrc">ISRC</SelectItem>
                  <SelectItem value="iswc">ISWC</SelectItem>
                  <SelectItem value="work_id">Work ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <div className="flex gap-2">
                <Input 
                  placeholder={`Search by ${searchType}...`} 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-electric hover:bg-electric/90"
                >
                  {isSearching ? "Searching..." : "Search"}
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-6">
            <Badge 
              variant={selectedPlatforms.includes('musicbrainz') ? "default" : "outline"}
              className={selectedPlatforms.includes('musicbrainz') ? "bg-electric" : ""}
              onClick={() => togglePlatform('musicbrainz')}
            >
              <Database className="h-3 w-3 mr-1" /> MusicBrainz
            </Badge>
            <Badge 
              variant={selectedPlatforms.includes('spotify') ? "default" : "outline"} 
              className={selectedPlatforms.includes('spotify') ? "bg-green-500" : ""}
              onClick={() => togglePlatform('spotify')}
            >
              <MusicIcon className="h-3 w-3 mr-1" /> Spotify
            </Badge>
            <Badge 
              variant={selectedPlatforms.includes('discogs') ? "default" : "outline"}
              className={selectedPlatforms.includes('discogs') ? "bg-orange-500" : ""}
              onClick={() => togglePlatform('discogs')}
            >
              <Music className="h-3 w-3 mr-1" /> Discogs
            </Badge>
            <Badge 
              variant={selectedPlatforms.includes('ascap') ? "default" : "outline"}
              className={selectedPlatforms.includes('ascap') ? "bg-purple-500" : ""}
              onClick={() => togglePlatform('ascap')}
            >
              <Building2 className="h-3 w-3 mr-1" /> ASCAP
            </Badge>
            <Badge 
              variant={selectedPlatforms.includes('bmi') ? "default" : "outline"}
              className={selectedPlatforms.includes('bmi') ? "bg-blue-500" : ""}
              onClick={() => togglePlatform('bmi')}
            >
              <Building2 className="h-3 w-3 mr-1" /> BMI
            </Badge>
          </div>
          
          {searchResults && (
            <div className="border rounded-md p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  {searchResults.title || "Unknown Title"}
                </h3>
                <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20">
                  {searchResults.isrc ? `ISRC: ${searchResults.isrc}` : "No ISRC"}
                </Badge>
              </div>
              
              <div>
                <p className="text-muted-foreground">
                  {searchResults.artists?.map(a => a.name).join(", ") || "Unknown Artist"}
                  {searchResults.album?.title && ` • ${searchResults.album.title}`}
                  {searchResults.album?.releaseDate && ` (${searchResults.album.releaseDate.substring(0, 4)})`}
                </p>
              </div>
              
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                  <TabsTrigger value="audio">Audio Info</TabsTrigger>
                  <TabsTrigger value="links">Links</TabsTrigger>
                </TabsList>
                
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium mb-2">Artists</h4>
                      <ul className="space-y-1">
                        {searchResults.artists?.map((artist, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span>{artist.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {artist.source}
                            </Badge>
                          </li>
                        )) || <li className="text-muted-foreground">No artists found</li>}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Album Info</h4>
                      {searchResults.album ? (
                        <ul className="space-y-1">
                          <li>Title: {searchResults.album.title}</li>
                          <li>Released: {searchResults.album.releaseDate}</li>
                          {searchResults.album.label && <li>Label: {searchResults.album.label}</li>}
                        </ul>
                      ) : (
                        <p className="text-muted-foreground">No album information</p>
                      )}
                    </div>
                  </div>
                  
                  {searchResults.genres && searchResults.genres.length > 0 && (
                    <div>
                      <h4 className="font-medium mb-2">Genres</h4>
                      <div className="flex flex-wrap gap-2">
                        {searchResults.genres.map((genre, idx) => (
                          <Badge key={idx} variant="outline">{genre}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="details" className="mt-4">
                  <p>Detailed metadata information here...</p>
                </TabsContent>
                
                <TabsContent value="audio" className="mt-4">
                  <p>Audio analysis information here...</p>
                </TabsContent>
                
                <TabsContent value="links" className="mt-4">
                  <h4 className="font-medium mb-2">External Links</h4>
                  <ul className="space-y-2">
                    {searchResults.externalLinks ? (
                      Object.entries(searchResults.externalLinks).map(([platform, url]) => (
                        <li key={platform}>
                          <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-electric hover:underline"
                          >
                            <FileText className="h-4 w-4" />
                            View on {platform.charAt(0).toUpperCase() + platform.slice(1)}
                          </a>
                        </li>
                      ))
                    ) : (
                      <li className="text-muted-foreground">No external links available</li>
                    )}
                  </ul>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-end mt-4">
                <Button 
                  variant="outline" 
                  className="border-electric text-electric"
                >
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Validate Metadata
                </Button>
              </div>
            </div>
          )}
          
          {!searchResults && !isSearching && searchQuery && (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              No results found for "{searchQuery}"
            </div>
          )}
          
          {!searchResults && !searchQuery && (
            <div className="text-center p-8 border rounded-md text-muted-foreground">
              Search for music metadata across multiple industry platforms
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
