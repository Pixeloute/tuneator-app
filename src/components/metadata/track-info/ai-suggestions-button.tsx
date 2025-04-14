
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useMetadata } from "@/contexts/metadata";
import { MetadataFormState } from "@/contexts/metadata";

interface AiSuggestionsButtonProps {
  formState?: MetadataFormState;
  updateForm?: (field: keyof MetadataFormState, value: any) => void;
}

export const AiSuggestionsButton = ({ formState, updateForm }: AiSuggestionsButtonProps) => {
  const { handleAiAudit } = useMetadata();

  return (
    <Button 
      onClick={handleAiAudit} 
      variant="outline" 
      size="sm" 
      className="flex items-center space-x-2"
    >
      <Wand2 className="h-4 w-4" />
      <span>AI Suggestions</span>
    </Button>
  );
};
