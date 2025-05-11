import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRef, useState } from "react";
import { FileText, X } from "lucide-react";

const DUMMY_FILES = [
  { id: 1, name: "Contract.pdf", type: "pdf", size: "120KB" },
  { id: 2, name: "PressKit.zip", type: "zip", size: "2MB" },
];

export const FileDropzone = () => {
  const [files, setFiles] = useState(DUMMY_FILES);
  const inputRef = useRef<HTMLInputElement>(null);

  const removeFile = (id: number) => setFiles(files.filter(f => f.id !== id));

  // Drag/drop logic omitted for brevity (add if needed)

  return (
    <Card className="p-3 space-y-3">
      <div
        className="flex items-center justify-center border-2 border-dashed border-muted-foreground/30 rounded-md p-4 cursor-pointer hover:bg-muted/10"
        onClick={() => inputRef.current?.click()}
      >
        <FileText className="h-5 w-5 mr-2 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Drop files or click to upload</span>
        <input ref={inputRef} type="file" className="hidden" multiple aria-label="Upload files" />
      </div>
      <div className="space-y-2 max-h-32 overflow-y-auto">
        {files.length === 0 && <div className="text-muted-foreground text-center py-4">No files.</div>}
        {files.map(f => (
          <div key={f.id} className="flex items-center gap-2 border-b last:border-0 pb-2">
            <FileText className="h-4 w-4 text-muted-foreground" />
            <div className="flex-1 text-sm truncate">{f.name}</div>
            <div className="text-xs text-muted-foreground">{f.size}</div>
            <Button size="icon" variant="ghost" onClick={() => removeFile(f.id)}><X className="h-4 w-4" /></Button>
          </div>
        ))}
      </div>
    </Card>
  );
}; 