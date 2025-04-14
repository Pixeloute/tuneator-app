
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface TechnicalMetadataProps {
  bpm: string;
  setBpm: (value: string) => void;
  key: string;
  setKey: (value: string) => void;
}

export const TechnicalMetadata = ({ bpm, setBpm, key: musicKey, setKey }: TechnicalMetadataProps) => {
  return (
    <div className="grid gap-4">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="bpm" className="text-sm font-medium">BPM (Beats Per Minute)</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The tempo of the track measured in beats per minute</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="bpm"
          type="text"
          value={bpm}
          onChange={(e) => setBpm(e.target.value)}
          placeholder="e.g. 120"
        />
        <p className="text-sm text-muted-foreground">The speed or tempo of the track</p>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <label htmlFor="key" className="text-sm font-medium">Musical Key</label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </TooltipTrigger>
              <TooltipContent>
                <p>The musical key of the track (e.g. C Major, A Minor)</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <Input
          id="key"
          type="text"
          value={musicKey}
          onChange={(e) => setKey(e.target.value)}
          placeholder="e.g. C Major"
        />
        <p className="text-sm text-muted-foreground">The musical key of the track</p>
      </div>
    </div>
  );
};
