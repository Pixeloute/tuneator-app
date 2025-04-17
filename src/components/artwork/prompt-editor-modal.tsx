
import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Icons } from "@/components/ui/icons";

interface PromptEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPrompt: string;
  onRegenerateWithPrompt: (editedPrompt: string) => void;
}

export function PromptEditorModal({
  isOpen,
  onClose,
  initialPrompt,
  onRegenerateWithPrompt
}: PromptEditorModalProps) {
  const [editedPrompt, setEditedPrompt] = useState(initialPrompt);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = () => {
    setIsSubmitting(true);
    
    // Ensure prompt is not empty
    if (!editedPrompt.trim()) {
      setIsSubmitting(false);
      return;
    }
    
    onRegenerateWithPrompt(editedPrompt);
    setIsSubmitting(false);
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Prompt</DialogTitle>
          <DialogDescription>
            Modify the prompt to refine your artwork generation. Be specific about visual elements, style, and mood.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="prompt">Image Generation Prompt</Label>
            <Textarea
              id="prompt"
              value={editedPrompt}
              onChange={(e) => setEditedPrompt(e.target.value)}
              placeholder="Describe the visual elements, style, colors, and composition..."
              className="min-h-[200px]"
            />
          </div>
          
          <div className="text-sm text-muted-foreground">
            <p>Tips:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Include visual elements like colors, lighting, and composition</li>
              <li>Specify art styles like digital art, oil painting, or photography</li>
              <li>Mention the mood and atmosphere you want to convey</li>
            </ul>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Regenerate Artwork"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
