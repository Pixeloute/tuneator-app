
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useMetadata } from "@/contexts/metadata";

export const MetadataHeader = () => {
  const { metadataQualityScore, handleAiAudit, handleSaveMetadata } = useMetadata();

  return (
    <div className="flex flex-col lg:flex-row gap-4 justify-between">
      <div className="flex items-center space-x-2">
        <h2 className="text-xl font-semibold">Track Metadata</h2>
        <Badge 
          variant="outline" 
          className={`${metadataQualityScore > 80 ? 'bg-mint/20 text-mint' : 
                      metadataQualityScore > 60 ? 'bg-electric/20 text-electric' : 
                      'bg-yellow-500/20 text-yellow-500'}`}
        >
          {metadataQualityScore}% Complete
        </Badge>
      </div>
      
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          className="flex items-center space-x-2"
          onClick={handleAiAudit}
        >
          <Wand2 className="h-4 w-4" />
          <span>Audit & Autofix</span>
        </Button>
        
        <Button 
          className="bg-electric hover:bg-electric/90 text-primary-foreground"
          onClick={handleSaveMetadata}
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
};
