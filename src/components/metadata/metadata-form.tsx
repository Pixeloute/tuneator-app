
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackInfoTab } from "@/components/metadata/track-info-tab";
import { ArtistDetailsTab } from "@/components/metadata/artist-details-tab";
import { ReleaseInfoTab } from "@/components/metadata/release-info-tab";
import { PublishingRightsTab } from "@/components/metadata/publishing-rights-tab";
import { CreditsTab } from "@/components/metadata/credits-tab";
import { PlatformsTab } from "@/components/metadata/platforms-tab";
import { MetadataFeedback } from "@/components/metadata/metadata-feedback";
import { MetadataHeader } from "@/components/metadata/metadata-header";
import { MetadataProvider, useMetadata } from "@/contexts/metadata-context";

export type { MetadataFormState } from "@/contexts/metadata-context";

export const MetadataForm = () => {
  return (
    <MetadataProvider>
      <MetadataFormContent />
    </MetadataProvider>
  );
};

const MetadataFormContent = () => {
  const { 
    formState, 
    metadataQualityScore, 
    validationIssues,
    updateForm,
    validateMetadata
  } = useMetadata();
  
  const [activeTab, setActiveTab] = useState("track-info");

  return (
    <div className="space-y-6">
      <MetadataHeader />
      
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        <div className="xl:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 w-full">
              <TabsTrigger value="track-info">Track Info</TabsTrigger>
              <TabsTrigger value="artist-details">Artist Details</TabsTrigger>
              <TabsTrigger value="release-info">Release Info</TabsTrigger>
              <TabsTrigger value="publishing-rights">Publishing & Rights</TabsTrigger>
              <TabsTrigger value="credits">Credits</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
            </TabsList>
            
            <TabsContent value="track-info">
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
        
        <div className="xl:col-span-1">
          <MetadataFeedback 
            score={metadataQualityScore} 
            issues={validationIssues} 
            onValidate={validateMetadata}
          />
        </div>
      </div>
    </div>
  );
};
