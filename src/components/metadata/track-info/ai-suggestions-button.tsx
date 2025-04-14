
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { MetadataFormState } from "@/contexts/metadata-context";

interface AiSuggestionsButtonProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export function AiSuggestionsButton({ formState, updateForm }: AiSuggestionsButtonProps) {
  // Get AI suggestions for track info
  const getAiSuggestions = () => {
    // Simulate AI suggestions
    if (formState.genre === "Electronic" && !formState.tags.includes("EDM")) {
      const newTags = [...formState.tags, "EDM", "Dance"];
      updateForm('tags', newTags);
    }
    
    if (!formState.mood && formState.genre) {
      let suggestedMood = "";
      switch (formState.genre) {
        case "Electronic":
          suggestedMood = "Energetic, Uplifting";
          break;
        case "Hip-Hop":
        case "Hip-Hop/Rap":
          suggestedMood = "Confident, Rhythmic";
          break;
        case "Pop":
          suggestedMood = "Catchy, Upbeat";
          break;
        default:
          suggestedMood = "Expressive";
      }
      updateForm('mood', suggestedMood);
    }
  };

  return (
    <div className="flex justify-end">
      <Button 
        variant="outline" 
        size="sm" 
        className="flex items-center space-x-2"
        onClick={getAiSuggestions}
      >
        <Wand2 className="h-4 w-4" />
        <span>AI Suggestions</span>
      </Button>
    </div>
  );
}
