import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileUp, Image as ImageIcon, FileMusic, Video, FileText, Upload, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState, useRef } from "react";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

type FileWithPreview = {
  file: File;
  preview?: string;
  progress: number;
  status: "waiting" | "uploading" | "error" | "success";
  error?: string;
};

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
    
    const filesWithPreview: FileWithPreview[] = validFiles.map(file => {
      let preview: string | undefined = undefined;
      
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      }
      
      return {
        file,
        preview,
        progress: 0,
        status: "waiting"
      };
    });
    
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
  
  const uploadAllFiles = async () => {
    const waitingFiles = files.filter(f => f.status === "waiting");
    
    if (waitingFiles.length === 0) return;
    
    waitingFiles.forEach((file, i) => {
      const index = files.findIndex(f => f === file);
      uploadFile(file, index);
    });
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
            Select Files
          </Button>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
            multiple 
          />
          
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
        
        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Files to upload ({files.length})</h3>
              <Button variant="outline" size="sm" onClick={uploadAllFiles}>
                <Upload className="h-4 w-4 mr-2" />
                Upload All
              </Button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {files.map((fileWithPreview, index) => (
                <div key={index} className="flex items-center gap-3 border rounded-md p-3">
                  <div className="flex-shrink-0">
                    {fileWithPreview.preview ? (
                      <img src={fileWithPreview.preview} alt="Preview" className="h-10 w-10 object-cover rounded" />
                    ) : (
                      getFileIcon(fileWithPreview.file)
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <div className="truncate pr-2">
                        <p className="text-sm font-medium truncate">{fileWithPreview.file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(fileWithPreview.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 flex-shrink-0"
                        onClick={() => removeFile(index)}
                        disabled={fileWithPreview.status === "uploading"}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="w-full mt-1">
                      <Progress
                        value={fileWithPreview.progress}
                        className="h-1.5"
                      />
                    </div>
                    {fileWithPreview.status === "error" && (
                      <p className="text-xs text-destructive mt-0.5">{fileWithPreview.error}</p>
                    )}
                  </div>
                  {fileWithPreview.status === "waiting" && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-shrink-0 h-7 px-2"
                      onClick={() => uploadFile(fileWithPreview, index)}
                    >
                      <Upload className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
