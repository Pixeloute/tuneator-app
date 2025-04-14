
import { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";

export interface FormFieldWithInfoProps {
  id: string;
  label: string;
  tooltip?: string;
  tooltipText?: string; // Added for backward compatibility
  required?: boolean;
  children?: ReactNode; // Make children optional since we can use renderInput instead
  renderInput?: () => ReactNode;
  // Allow any other props to pass through
  [key: string]: any;
}

export function FormFieldWithInfo({ 
  id, 
  label, 
  tooltip, 
  tooltipText, 
  required = false, 
  children,
  renderInput,
  ...rest
}: FormFieldWithInfoProps) {
  // Use tooltip or tooltipText, whichever is provided
  const tooltipContent = tooltip || tooltipText || "";
  
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
            <p className="text-xs">{tooltipContent}</p>
          </HoverCardContent>
        </HoverCard>
      </div>
      {renderInput ? renderInput() : children}
    </div>
  );
}
