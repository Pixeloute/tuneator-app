
import { FileMusic, Image as ImageIcon, Video, FileText } from 'lucide-react';

export const FileTypeIndicators = () => {
  return (
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
  );
};
