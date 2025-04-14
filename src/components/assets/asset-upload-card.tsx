
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Image as ImageIcon, FileMusic, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

export const AssetUploadCard = () => {
  const { toast } = useToast();
  const [isDragging, setIsDragging] = useState(false);
  
  const handleUploadClick = () => {
    toast({
      title: "Upload Feature",
      description: "Full upload functionality will be available after Supabase integration.",
    });
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    toast({
      title: "Files Received",
      description: `Dropped ${e.dataTransfer.files.length} files. Full upload will be available after Supabase integration.`,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Assets</CardTitle>
        <CardDescription>Add new content to your catalog</CardDescription>
      </CardHeader>
      <CardContent>
        <div 
          className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors ${
            isDragging ? "border-electric bg-electric/5" : "border-border"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium mb-1">Drag & Drop Files</h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            Or click the button below to browse files
          </p>
          <Button 
            onClick={handleUploadClick}
            className="bg-electric hover:bg-electric/90 text-primary-foreground"
          >
            Upload Files
          </Button>
          
          <div className="flex justify-between w-full mt-6">
            <div className="flex items-center text-xs text-muted-foreground">
              <FileMusic className="h-4 w-4 mr-1" />
              <span>Audio</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <ImageIcon className="h-4 w-4 mr-1" />
              <span>Images</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <Video className="h-4 w-4 mr-1" />
              <span>Videos</span>
            </div>
            <div className="flex items-center text-xs text-muted-foreground">
              <FileText className="h-4 w-4 mr-1" />
              <span>Documents</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
