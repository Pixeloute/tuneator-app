
import { Info } from "lucide-react";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";

interface GenreLabelProps {
  id: string;
  label: string;
  tooltip: string;
  required?: boolean;
}

export function GenreLabel({ id, label, tooltip, required = false }: GenreLabelProps) {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      <HoverCard>
        <HoverCardTrigger>
          <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <p className="text-xs">{tooltip}</p>
        </HoverCardContent>
      </HoverCard>
    </div>
  );
}
