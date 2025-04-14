
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LightbulbIcon, StarIcon, AlertCircle, ThumbsUp, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Suggestion {
  id: string;
  type: "improvement" | "warning" | "opportunity";
  title: string;
  description: string;
  impact: "high" | "medium" | "low";
  appliedTo: string[];
}

interface SmartSuggestionsListProps {
  activeTrack: string | null;
  onSelectTrack: (trackId: string) => void;
}

export const SmartSuggestionsList = ({ activeTrack, onSelectTrack }: SmartSuggestionsListProps) => {
  const { toast } = useToast();
  const [suggestions, setSuggestions] = useState<Suggestion[]>([
    {
      id: "sug1",
      type: "improvement",
      title: "Enhance Keywords with Mood Tags",
      description: "Adding mood-based keywords like 'uplifting', 'melancholic', or 'energetic' can improve playlist matching by 35%.",
      impact: "high",
      appliedTo: []
    },
    {
      id: "sug2",
      type: "warning",
      title: "Potential Rights Conflict",
      description: "Two contributors have overlapping songwriter shares that exceed 100% total. This may cause royalty distribution issues.",
      impact: "high",
      appliedTo: []
    },
    {
      id: "sug3",
      type: "opportunity",
      title: "Add Instrumental Version",
      description: "Creating and registering an instrumental version could increase sync licensing opportunities by 28%.",
      impact: "medium",
      appliedTo: []
    },
    {
      id: "sug4",
      type: "improvement",
      title: "Optimize Title Format",
      description: "Removing special characters from titles improves searchability across platforms.",
      impact: "medium",
      appliedTo: []
    },
    {
      id: "sug5",
      type: "opportunity",
      title: "Add Language Tags",
      description: "Specify language tags to improve regional discoverability and playlist inclusion.",
      impact: "low",
      appliedTo: []
    }
  ]);
  
  const mockTracks = [
    { id: "track1", name: "Midnight Dreams" },
    { id: "track2", name: "Electric Sunrise" },
    { id: "track3", name: "Cosmic Wanderer" },
  ];
  
  const handleApplySuggestion = (suggestionId: string) => {
    setSuggestions(suggestions.map(suggestion => 
      suggestion.id === suggestionId
        ? { ...suggestion, appliedTo: [...suggestion.appliedTo, activeTrack!] }
        : suggestion
    ));
    
    toast({
      title: "Suggestion Applied",
      description: "The AI suggestion has been applied to your track.",
    });
  };
  
  const filteredSuggestions = (type: "all" | "improvement" | "warning" | "opportunity") => {
    return suggestions.filter(s => type === "all" || s.type === type);
  };
  
  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-amber-100 text-amber-800 border-amber-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "";
    }
  };
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case "improvement": return <LightbulbIcon className="h-5 w-5 text-amber-500" />;
      case "warning": return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "opportunity": return <StarIcon className="h-5 w-5 text-purple-500" />;
      default: return null;
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <LightbulbIcon className="h-5 w-5 text-electric" />
          <span>Smart Suggestions</span>
        </CardTitle>
        <CardDescription>
          AI-powered recommendations to optimize your track's performance
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          {mockTracks.map((track) => (
            <Button
              key={track.id}
              variant={activeTrack === track.id ? "default" : "outline"}
              className={activeTrack === track.id ? "bg-electric hover:bg-electric/90" : ""}
              onClick={() => onSelectTrack(track.id)}
            >
              {track.name}
            </Button>
          ))}
        </div>
        
        {activeTrack ? (
          <Tabs defaultValue="all">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="all">All ({filteredSuggestions("all").length})</TabsTrigger>
              <TabsTrigger value="improvements">Improvements ({filteredSuggestions("improvement").length})</TabsTrigger>
              <TabsTrigger value="warnings">Warnings ({filteredSuggestions("warning").length})</TabsTrigger>
              <TabsTrigger value="opportunities">Opportunities ({filteredSuggestions("opportunity").length})</TabsTrigger>
            </TabsList>
            
            <ScrollArea className="h-[400px] mt-2 pr-4">
              {["all", "improvements", "warnings", "opportunities"].map((tabValue) => (
                <TabsContent key={tabValue} value={tabValue === "improvements" ? "improvements" : tabValue === "warnings" ? "warnings" : tabValue === "opportunities" ? "opportunities" : "all"} className="space-y-4 mt-2">
                  {filteredSuggestions(tabValue === "all" ? "all" : tabValue === "improvements" ? "improvement" : tabValue === "warnings" ? "warning" : "opportunity").map((suggestion) => (
                    <Card key={suggestion.id} className="border-l-4 border-l-electric">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-2">
                            {getTypeIcon(suggestion.type)}
                            <h4 className="font-medium">{suggestion.title}</h4>
                          </div>
                          <Badge className={`ml-2 ${getImpactColor(suggestion.impact)}`}>
                            {suggestion.impact.charAt(0).toUpperCase() + suggestion.impact.slice(1)} Impact
                          </Badge>
                        </div>
                        <p className="text-sm mt-2 text-muted-foreground">{suggestion.description}</p>
                        <div className="flex justify-end mt-4">
                          {suggestion.appliedTo.includes(activeTrack!) ? (
                            <Badge variant="outline" className="flex items-center gap-1 bg-green-50 text-green-700 border-green-200">
                              <CheckCircle2 className="h-3 w-3" />
                              Applied
                            </Badge>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="text-xs flex items-center gap-1"
                              onClick={() => handleApplySuggestion(suggestion.id)}
                            >
                              <ThumbsUp className="h-3 w-3" />
                              Apply Suggestion
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </ScrollArea>
          </Tabs>
        ) : (
          <div className="text-center p-6 text-muted-foreground">
            Select a track to view AI-powered suggestions
          </div>
        )}
      </CardContent>
    </Card>
  );
};
