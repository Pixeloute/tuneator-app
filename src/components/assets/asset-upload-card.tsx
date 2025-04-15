
import { useState, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileMusic, Image as ImageIcon, Video, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { uploadAssetToStorage, getAssetType } from "@/lib/asset-utils";
import { supabase } from "@/integrations/supabase/client";
import { type FileWithPreview } from "./types";
import { FileTypeIndicators } from "./file-type-indicators";
import { UploadDropZone } from "./upload-drop-zone";
import { FileList } from "./file-list";

export const AssetUploadCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
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
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload files.",
        variant: "destructive",
      });
      return;
    }
    
    const newFiles = Array.from(e.dataTransfer.files);
    addFiles(newFiles);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to upload files.",
        variant: "destructive",
      });
      return;
    }
    
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      addFiles(newFiles);
      e.target.value = '';
    }
  };

  const addFiles = (newFiles: File[]) => {
    const validFiles = newFiles.filter(file => 
      file.type.startsWith('audio/') || 
      file.type.startsWith('image/') || 
      file.type.startsWith('video/') || 
      file.type.startsWith('application/')
    );
    
    if (validFiles.length !== newFiles.length) {
      toast({
        title: "Invalid File Types",
        description: "Some files were rejected. Please upload audio, image, video, or document files.",
        variant: "destructive",
      });
    }
    
    const filesWithPreview = validFiles.map(file => ({
      file,
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      progress: 0,
      status: "waiting" as const
    }));
    
    setFiles(prev => [...prev, ...filesWithPreview]);
  };

  const removeFile = (index: number) => {
    setFiles(prev => {
      const newFiles = [...prev];
      if (newFiles[index].preview) {
        URL.revokeObjectURL(newFiles[index].preview!);
      }
      newFiles.splice(index, 1);
      return newFiles;
    });
  };

  const uploadFile = async (fileWithPreview: FileWithPreview, index: number) => {
    if (!user) return;
    
    const file = fileWithPreview.file;
    
    setFiles(prev => {
      const newFiles = [...prev];
      newFiles[index].status = "uploading";
      return newFiles;
    });
    
    try {
      const { path } = await uploadAssetToStorage(file, user.id, (progress) => {
        setFiles(prev => {
          const newFiles = [...prev];
          newFiles[index].progress = progress;
          return newFiles;
        });
      });
      
      let fileType = getAssetType(file.name);
      
      const { error: assetError } = await supabase
        .from('assets')
        .insert({
          name: file.name,
          type: fileType,
          file_path: path,
          file_size: file.size,
          thumbnail_path: fileType === "image" ? path : null,
          user_id: user.id,
          metadata_score: 0
        });
      
      if (assetError) throw assetError;
      
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[index].status = "success";
        return newFiles;
      });
      
      toast({
        title: "Upload Successful",
        description: `${file.name} has been uploaded successfully.`,
      });
      
      setTimeout(() => {
        removeFile(index);
      }, 3000);
      
    } catch (error: any) {
      console.error("Upload error:", error);
      
      setFiles(prev => {
        const newFiles = [...prev];
        newFiles[index].status = "error";
        newFiles[index].error = error.message || "Upload failed";
        return newFiles;
      });
      
      toast({
        title: "Upload Failed",
        description: `Failed to upload ${file.name}: ${error.message}`,
        variant: "destructive",
      });
    }
  };

  const getFileIcon = (file: File) => {
    if (file.type.startsWith('audio/')) return <FileMusic className="h-8 w-8 text-electric" />;
    if (file.type.startsWith('image/')) return <ImageIcon className="h-8 w-8 text-mint" />;
    if (file.type.startsWith('video/')) return <Video className="h-8 w-8 text-yellow-500" />;
    return <FileText className="h-8 w-8 text-muted-foreground" />;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Assets</CardTitle>
        <CardDescription>Add new content to your catalog</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <UploadDropZone 
          isDragging={isDragging}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleUploadClick}
        />
        <FileTypeIndicators />
        <FileList 
          files={files}
          onRemove={removeFile}
          onUpload={uploadFile}
          getFileIcon={getFileIcon}
        />
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
        />
      </CardContent>
    </Card>
  );
};
