
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Spinner } from "@/components/ui/spinner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { OverviewTab } from "./tabs/overview-tab";
import { AudioInfoTab } from "./tabs/audio-info-tab";
import { LinksTab } from "./tabs/links-tab";
import { DetailsTab } from "./tabs/details-tab";
import type { EnrichedMetadata } from "@/services/types/shared-types";

interface SearchResultsProps {
  isLoading: boolean;
  results: EnrichedMetadata | null;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const SearchResults = ({ 
  isLoading, 
  results, 
  activeTab, 
  setActiveTab 
}: SearchResultsProps) => {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <Spinner className="h-8 w-8 mb-4" />
        <p className="text-muted-foreground">Searching across multiple platforms...</p>
      </div>
    );
  }
  
  if (!results) {
    return (
      <Alert>
        <AlertDescription>
          No results found. Try adjusting your search query or adding an ISRC.
        </AlertDescription>
      </Alert>
    );
  }
  
  return (
    <div className="pt-4">
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="comprehensive">Overview</TabsTrigger>
          <TabsTrigger value="audio">Audio Info</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comprehensive">
          <OverviewTab metadata={results} />
        </TabsContent>
        
        <TabsContent value="audio">
          <AudioInfoTab metadata={results} />
        </TabsContent>
        
        <TabsContent value="links">
          <LinksTab metadata={results} />
        </TabsContent>
        
        <TabsContent value="details">
          <DetailsTab metadata={results} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
