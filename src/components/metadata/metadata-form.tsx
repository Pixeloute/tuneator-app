import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackInfoTab } from "@/components/metadata/track-info-tab";
import { ArtistDetailsTab } from "@/components/metadata/artist-details-tab";
import { ReleaseInfoTab } from "@/components/metadata/release-info-tab";
import { PublishingRightsTab } from "@/components/metadata/publishing-rights-tab";
import { CreditsTab } from "@/components/metadata/credits-tab";
import { PlatformsTab } from "./platforms";
import { MetadataFeedback } from "@/components/metadata/metadata-feedback";
import { MetadataHeader } from "@/components/metadata/metadata-header";
import { useMetadata } from "@/contexts/metadata";

export type { MetadataFormState } from "@/contexts/metadata";

export const MetadataForm = () => {
  const { 
    formState, 
    metadataQualityScore, 
    validationIssues,
    updateForm,
    validateMetadata
  } = useMetadata();
  
  const [activeTab, setActiveTab] = useState("track-info");

  // Filter out "success" type issues before passing to MetadataFeedback
  const filteredIssues = validationIssues.filter(
    (issue): issue is { type: "warning" | "error" | "info"; message: string; } => 
    issue.type !== "success"
  );

  return (
    <div className="space-y-6">
      <MetadataHeader />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="flex w-full overflow-x-auto max-w-full">
              <TabsTrigger value="track-info" className="flex-1">Track Info</TabsTrigger>
              <TabsTrigger value="artist-details" className="flex-1">Artist Details</TabsTrigger>
              <TabsTrigger value="release-info" className="flex-1">Release Info</TabsTrigger>
              <TabsTrigger value="publishing-rights" className="flex-1">Publishing & Rights</TabsTrigger>
              <TabsTrigger value="credits" className="flex-1">Credits</TabsTrigger>
              <TabsTrigger value="platforms" className="flex-1">Platforms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track-info" className="mt-4">
              <TrackInfoTab
                formState={formState}
                updateForm={updateForm}
              />
            </TabsContent>
            
            <TabsContent value="artist-details">
              <ArtistDetailsTab
                formState={formState}
                updateForm={updateForm}
              />
            </TabsContent>
            
            <TabsContent value="release-info">
              <ReleaseInfoTab
                formState={formState}
                updateForm={updateForm}
              />
            </TabsContent>
            
            <TabsContent value="publishing-rights">
              <PublishingRightsTab
                formState={formState}
                updateForm={updateForm}
              />
            </TabsContent>
            
            <TabsContent value="credits">
              <CreditsTab
                formState={formState}
                updateForm={updateForm}
              />
            </TabsContent>
            
            <TabsContent value="platforms">
              <PlatformsTab
                formState={formState}
                updateForm={updateForm}
              />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="lg:col-span-1">
          <MetadataFeedback 
            score={metadataQualityScore} 
            issues={filteredIssues} 
            onValidate={validateMetadata}
          />
        </div>
      </div>
    </div>
  );
};
