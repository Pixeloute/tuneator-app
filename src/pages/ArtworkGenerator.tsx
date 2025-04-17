
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { ArtGeneratorForm } from "@/components/artwork/art-generator-form";
import { ImageGallery } from "@/components/artwork/image-gallery";
import { PromptEditorModal } from "@/components/artwork/prompt-editor-modal";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { uploadAssetToStorage } from "@/lib/asset-utils";
import { supabase } from "@/integrations/supabase/client";

const ArtworkGenerator = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [enhancedPrompt, setEnhancedPrompt] = useState("");
  const [isPromptEditorOpen, setIsPromptEditorOpen] = useState(false);
  
  const handleImagesGenerated = (images: string[], prompt: string) => {
    setGeneratedImages(images);
    setEnhancedPrompt(prompt);
    window.scrollTo({ top: document.getElementById('resultsSection')?.offsetTop || 0, behavior: 'smooth' });
  };
  
  const handleSaveToAssets = async (imageUrl: string) => {
    if (!user) return;
    
    try {
      // First, fetch the image as a blob
      const response = await fetch(imageUrl);
      if (!response.ok) throw new Error('Failed to fetch image');
      
      const imageBlob = await response.blob();
      
      // Create a File object from the blob
      const fileName = `ai-artwork-${Date.now()}.png`;
      const imageFile = new File([imageBlob], fileName, { type: 'image/png' });
      
      // Upload the file to storage
      const { path } = await uploadAssetToStorage(imageFile, user.id);
      
      // Save a reference in the assets table
      const { error: assetError } = await supabase
        .from('assets')
        .insert({
          name: fileName,
          type: "image",
          file_path: path,
          file_size: imageFile.size,
          thumbnail_path: path,
          user_id: user.id,
          metadata: {
            ai_generated: true,
            prompt: enhancedPrompt,
            generation_type: "artwork"
          },
          metadata_score: 100 // AI-generated artwork is fully tagged
        });
      
      if (assetError) throw assetError;
      
      toast({
        title: "Artwork Saved",
        description: "The image has been added to your assets library.",
      });
    } catch (error: any) {
      console.error("Error saving artwork:", error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save the artwork to your assets.",
        variant: "destructive",
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    setGeneratedImages(prev => prev.filter((_, i) => i !== index));
    if (generatedImages.length <= 1) {
      setEnhancedPrompt("");
    }
  };
  
  const handleRegenerateWithPrompt = () => {
    setIsPromptEditorOpen(true);
  };
  
  const handlePromptEdited = async (editedPrompt: string) => {
    if (!user) return;
    
    try {
      const { data: response, error } = await supabase.functions.invoke('artwork-generator', {
        body: {
          user_id: user.id,
          description: editedPrompt, // Use the edited prompt directly
          mood: "",
          genre: ""
        }
      });
      
      if (error) throw error;
      
      setGeneratedImages(response.images);
      setEnhancedPrompt(response.enhancedPrompt);
      
      toast({
        title: "Artwork Regenerated",
        description: "New artwork has been created with your edited prompt.",
      });
    } catch (error: any) {
      console.error("Error regenerating artwork:", error);
      toast({
        title: "Generation Failed",
        description: error.message || "Failed to regenerate artwork. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" />;
  }
  
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-8 pb-16">
            <h1 className="text-2xl font-bold">AI Artwork Vision Generator</h1>
            
            <ArtGeneratorForm onImagesGenerated={handleImagesGenerated} />
            
            {generatedImages.length > 0 && (
              <div id="resultsSection" className="space-y-4">
                <h2 className="text-xl font-semibold">Generated Artwork Concepts</h2>
                <ImageGallery 
                  images={generatedImages}
                  prompt={enhancedPrompt}
                  onSave={handleSaveToAssets}
                  onRemove={handleRemoveImage}
                  onRegenerateWithPrompt={handleRegenerateWithPrompt}
                />
              </div>
            )}
            
            <PromptEditorModal 
              isOpen={isPromptEditorOpen}
              onClose={() => setIsPromptEditorOpen(false)}
              initialPrompt={enhancedPrompt}
              onRegenerateWithPrompt={handlePromptEdited}
            />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ArtworkGenerator;
