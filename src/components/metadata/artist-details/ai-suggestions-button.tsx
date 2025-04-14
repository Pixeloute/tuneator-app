
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";

interface AiSuggestionsButtonProps {
  onGetSuggestions: () => void;
}

export const AiSuggestionsButton = ({ onGetSuggestions }: AiSuggestionsButtonProps) => {
  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="flex items-center space-x-2"
      onClick={onGetSuggestions}
    >
      <Wand2 className="h-4 w-4" />
      <span>AI Suggestions</span>
    </Button>
  );
};
