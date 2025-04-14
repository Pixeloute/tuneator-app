
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

interface FormFieldWithInfoProps {
  id: string;
  label: string;
  tooltip: string;
  required?: boolean;
  children: ReactNode;
}

export function FormFieldWithInfo({ 
  id, 
  label, 
  tooltip, 
  required = false, 
  children 
}: FormFieldWithInfoProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label htmlFor={id} className="text-sm font-medium">
          {label} {required && <span className="text-destructive">*</span>}
        </Label>
        <HoverCard>
          <HoverCardTrigger>
            <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
          </HoverCardTrigger>
          <HoverCardContent className="w-80">
            <p className="text-xs">{tooltip}</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      {children}
    </div>
  );
}
