
import { FileMusic, Image as ImageIcon, Video, FileText, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { type FileWithPreview } from './types';

interface FileListProps {
  files: FileWithPreview[];
  onRemove: (index: number) => void;
  onUpload: (file: FileWithPreview, index: number) => void;
  getFileIcon: (file: File) => JSX.Element;
}

export const FileList = ({ files, onRemove, onUpload, getFileIcon }: FileListProps) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Files to upload ({files.length})</h3>
        <Button variant="outline" size="sm" onClick={() => files.forEach((_, i) => onUpload(files[i], i))}>
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
                  onClick={() => onRemove(index)}
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
                onClick={() => onUpload(fileWithPreview, index)}
              >
                <Upload className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
