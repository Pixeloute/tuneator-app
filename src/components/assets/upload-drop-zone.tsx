
import { FileUp } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadDropZoneProps {
  isDragging: boolean;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onClick: () => void;
}

export const UploadDropZone = ({
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onClick
}: UploadDropZoneProps) => {
  return (
    <div 
      className={`border-2 border-dashed rounded-md p-6 flex flex-col items-center justify-center transition-colors ${
        isDragging ? "border-electric bg-electric/5" : "border-border"
      }`}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      <FileUp className="h-10 w-10 text-muted-foreground mb-4" />
      <h3 className="text-lg font-medium mb-1">Drag & Drop Files</h3>
      <p className="text-sm text-muted-foreground text-center mb-4">
        Or click the button below to browse files
      </p>
      <Button 
        onClick={onClick}
        className="bg-electric hover:bg-electric/90 text-primary-foreground"
      >
        Select Files
      </Button>
    </div>
  );
};
