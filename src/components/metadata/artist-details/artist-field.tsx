
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info } from "lucide-react";
import { ChangeEvent } from "react";

interface ArtistFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  tooltipText: string;
  required?: boolean;
  error?: boolean;
}

export const ArtistField = ({
  id,
  label,
  value,
  onChange,
  placeholder,
  tooltipText,
  required = false,
  error = false
}: ArtistFieldProps) => {
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
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">{label}</h4>
              <p className="text-xs text-muted-foreground">
                {tooltipText}
              </p>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
      <Input
        id={id}
        value={value}
        onChange={onChange}
        className={error ? "border-destructive" : ""}
        placeholder={placeholder}
      />
      {error && (
        <p className="text-xs text-destructive">Required field</p>
      )}
    </div>
  );
};
