
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info, Wand2 } from "lucide-react";
import { validateISRC, validateISWC } from "@/lib/metadata-validator";
import { MetadataFormState } from "./metadata-form";

interface PublishingRightsTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const PublishingRightsTab = ({ formState, updateForm }: PublishingRightsTabProps) => {
  // Local validation states
  const [isrcError, setIsrcError] = useState("");
  const [iswcError, setIswcError] = useState("");
  
  // Handle ISRC validation
  const handleIsrcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('isrc', value);
    
    if (value && !validateISRC(value)) {
      setIsrcError("ISRC format should be CC-XXX-YY-NNNNN");
    } else {
      setIsrcError("");
    }
  };
  
  // Handle ISWC validation
  const handleIswcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('iswc', value);
    
    if (value && !validateISWC(value)) {
      setIswcError("ISWC format should be T-XXXXXXXXX-Y");
    } else {
      setIswcError("");
    }
  };
  
  // AI suggestions for publishing info
  const getAiSuggestions = () => {
    // Generate ISWC if missing
    if (!formState.iswc) {
      const generatedISWC = "T-034.524.680-1"; // Simulated AI-generated ISWC
      updateForm('iswc', generatedISWC);
      setIswcError(""); // Clear any errors since we're setting a valid ISWC
    }
    
    // Add or update P-Line if missing or generic
    if (!formState.pLine) {
      const currentYear = new Date().getFullYear();
      const pLine = `℗ ${currentYear} ${formState.label || (formState.companyName || formState.artistName)}`;
      updateForm('pLine', pLine);
    }
    
    // Add or update C-Line if missing or generic
    if (!formState.cLine) {
      const currentYear = new Date().getFullYear();
      const cLine = `© ${currentYear} ${formState.companyName || formState.artistName}`;
      updateForm('cLine', cLine);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="isrc" className="text-sm font-medium">
                  ISRC <span className="text-destructive">*</span>
                </Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">International Standard Recording Code</h4>
                      <p className="text-xs text-muted-foreground">
                        Unique identifier for sound recordings. Format: CC-XXX-YY-NNNNN
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="isrc"
                value={formState.isrc}
                onChange={handleIsrcChange}
                className={isrcError ? "border-destructive" : ""}
                placeholder="e.g., USRC17607839"
              />
              {isrcError && (
                <p className="text-xs text-destructive">{isrcError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="iswc" className="text-sm font-medium">ISWC</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      International Standard Musical Work Code. Identifies musical compositions.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="iswc"
                value={formState.iswc}
                onChange={handleIswcChange}
                className={iswcError ? "border-destructive" : ""}
                placeholder="e.g., T-034.524.680-1"
              />
              {iswcError && (
                <p className="text-xs text-destructive">{iswcError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="tunecode" className="text-sm font-medium">Tunecode</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Tunecode identifier used by some PROs for works registration.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="tunecode"
                value={formState.tunecode}
                onChange={(e) => updateForm('tunecode', e.target.value)}
                placeholder="Tunecode identifier"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="iceWorkKey" className="text-sm font-medium">ICE Work Key</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      ICE Work Key identifier used for works in Europe.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="iceWorkKey"
                value={formState.iceWorkKey}
                onChange={(e) => updateForm('iceWorkKey', e.target.value)}
                placeholder="ICE Work Key"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="bowi" className="text-sm font-medium">BOWI</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Broadcast Music Inc (BMI) Work Identifier.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="bowi"
                value={formState.bowi}
                onChange={(e) => updateForm('bowi', e.target.value)}
                placeholder="BOWI number"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="copyrightYear" className="text-sm font-medium">Copyright Year</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The year of copyright for this work (YYYY).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="copyrightYear"
                value={formState.copyrightYear}
                onChange={(e) => updateForm('copyrightYear', e.target.value)}
                placeholder="e.g., 2023"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="copyrightOwner" className="text-sm font-medium">Copyright Owner</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Legal entity that owns the copyright to this work.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="copyrightOwner"
                value={formState.copyrightOwner}
                onChange={(e) => updateForm('copyrightOwner', e.target.value)}
                placeholder="e.g., Artist Name, Company Name"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="pLine" className="text-sm font-medium">P-Line</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Sound recording copyright line, beginning with ℗ symbol (e.g., ℗ 2023 Label Name).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="pLine"
                value={formState.pLine}
                onChange={(e) => updateForm('pLine', e.target.value)}
                placeholder="e.g., ℗ 2023 Label Name"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="cLine" className="text-sm font-medium">C-Line</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Composition copyright line, beginning with © symbol (e.g., © 2023 Publishing Name).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="cLine"
                value={formState.cLine}
                onChange={(e) => updateForm('cLine', e.target.value)}
                placeholder="e.g., © 2023 Publishing Name"
              />
            </div>
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center space-x-2"
            onClick={getAiSuggestions}
          >
            <Wand2 className="h-4 w-4" />
            <span>AI Suggestions</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
