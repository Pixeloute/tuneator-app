
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Database, Copy } from "lucide-react";
import { SearchForm } from "./search-form";
import { SearchResults } from "./search-results";
import { useToast } from "@/hooks/use-toast";
import type { EnrichedMetadata } from "@/services/types/shared-types";

export const ExternalLookupPanel = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [isrc, setIsrc] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<EnrichedMetadata | null>(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [activeTab, setActiveTab] = useState("comprehensive");
  
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
        <SearchForm
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          isrc={isrc}
          setIsrc={setIsrc}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          setResults={setResults}
          setSearchPerformed={setSearchPerformed}
        />
        
        {searchPerformed && (
          <SearchResults
            isLoading={isLoading}
            results={results}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        )}
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <p className="text-xs text-muted-foreground">
          Powered by Spotify, YouTube, MusicBrainz, and Discogs APIs
        </p>
        
        {results && (
          <button
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
            onClick={() => {
              // Format metadata as JSON for clipboard
              const metadataJson = JSON.stringify(results, null, 2);
              copyToClipboard(metadataJson, "Metadata");
            }}
          >
            <Copy className="h-4 w-4 mr-2" />
            Copy All Metadata
          </button>
        )}
      </CardFooter>
    </Card>
  );
};
