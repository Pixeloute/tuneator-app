
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Info, Wand2 } from "lucide-react";
import { validateUPC, validateDate } from "@/lib/metadata-validator";
import { MetadataFormState } from "./metadata-form";

interface ReleaseInfoTabProps {
  formState: MetadataFormState;
  updateForm: (field: keyof MetadataFormState, value: any) => void;
}

export const ReleaseInfoTab = ({ formState, updateForm }: ReleaseInfoTabProps) => {
  // Local validation states
  const [upcError, setUpcError] = useState("");
  const [releaseDateError, setReleaseDateError] = useState("");
  
  // Handle UPC validation
  const handleUpcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    updateForm('upc', value);
    
    if (value && !validateUPC(value)) {
      setUpcError("UPC must be 12-13 digits");
    } else {
      setUpcError("");
    }
  };
  
  // Handle date validation
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'releaseDate' | 'preReleaseDate' | 'previousReleaseDate') => {
    const value = e.target.value;
    updateForm(field, value);
    
    if (field === 'releaseDate') {
      if (value && !validateDate(value)) {
        setReleaseDateError("Date must be in YYYY-MM-DD format");
      } else {
        setReleaseDateError("");
      }
    }
  };
  
  // AI suggestions for release info
  const getAiSuggestions = () => {
    // Generate UPC if missing
    if (!formState.upc) {
      const generatedUPC = "884385672382"; // Simulated AI-generated UPC
      updateForm('upc', generatedUPC);
      setUpcError(""); // Clear any errors since we're setting a valid UPC
    }
    
    // Suggest catalog number if missing or generic
    if (!formState.catalogNumber || formState.catalogNumber === "NR2023-01") {
      const suggestedCatalog = formState.label 
        ? `${formState.label.substring(0, 2).toUpperCase()}${new Date().getFullYear()}-${Math.floor(Math.random() * 99).toString().padStart(2, '0')}`
        : `CAT-${new Date().getFullYear()}-${Math.floor(Math.random() * 999)}`;
      
      updateForm('catalogNumber', suggestedCatalog);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="productTitle" className="text-sm font-medium">Product Title</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <div className="space-y-2">
                      <h4 className="text-sm font-semibold">Product Title</h4>
                      <p className="text-xs text-muted-foreground">
                        The title of the album or EP this track belongs to.
                      </p>
                    </div>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="productTitle"
                value={formState.productTitle}
                onChange={(e) => updateForm('productTitle', e.target.value)}
                placeholder="Album or EP title"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="label" className="text-sm font-medium">Label</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The record label releasing this track or album.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="label"
                value={formState.label}
                onChange={(e) => updateForm('label', e.target.value)}
                placeholder="e.g., Neon Records"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="catalogNumber" className="text-sm font-medium">Catalog Number</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      A unique identifier assigned by the label for this release.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="catalogNumber"
                value={formState.catalogNumber}
                onChange={(e) => updateForm('catalogNumber', e.target.value)}
                placeholder="e.g., NR2023-01"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="upc" className="text-sm font-medium">UPC/EAN</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Universal Product Code (12-13 digits) - a unique identifier for your product.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="upc"
                value={formState.upc}
                onChange={handleUpcChange}
                className={upcError ? "border-destructive" : ""}
                placeholder="e.g., 884385672382"
              />
              {upcError && (
                <p className="text-xs text-destructive">{upcError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="format" className="text-sm font-medium">Format</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The format of the release (Digital, CD, Vinyl, etc.).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="format"
                value={formState.format}
                onChange={(e) => updateForm('format', e.target.value)}
                placeholder="e.g., Digital, CD, Vinyl"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="productType" className="text-sm font-medium">Product Type</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The type of release (Single, EP, Album, etc.).
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="productType"
                value={formState.productType}
                onChange={(e) => updateForm('productType', e.target.value)}
                placeholder="e.g., Single, EP, Album"
              />
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="releaseDate" className="text-sm font-medium">Release Date</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The official release date in YYYY-MM-DD format.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="releaseDate"
                type="date"
                value={formState.releaseDate}
                onChange={(e) => handleDateChange(e, 'releaseDate')}
                className={releaseDateError ? "border-destructive" : ""}
              />
              {releaseDateError && (
                <p className="text-xs text-destructive">{releaseDateError}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="preReleaseDate" className="text-sm font-medium">Pre-Release Date</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Date when pre-orders or pre-saves begin, in YYYY-MM-DD format.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="preReleaseDate"
                type="date"
                value={formState.preReleaseDate}
                onChange={(e) => handleDateChange(e, 'preReleaseDate')}
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="preReleaseUrl" className="text-sm font-medium">Pre-Release URL</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to pre-save or pre-order page.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="preReleaseUrl"
                value={formState.preReleaseUrl}
                onChange={(e) => updateForm('preReleaseUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="releaseUrl" className="text-sm font-medium">Release URL</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Link to the release landing page.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="releaseUrl"
                value={formState.releaseUrl}
                onChange={(e) => updateForm('releaseUrl', e.target.value)}
                placeholder="https://..."
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="distributionCompany" className="text-sm font-medium">Distribution Company</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      The company handling distribution of this release.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <Input
                id="distributionCompany"
                value={formState.distributionCompany}
                onChange={(e) => updateForm('distributionCompany', e.target.value)}
                placeholder="e.g., DistroKid, CD Baby"
              />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Label htmlFor="previouslyReleased" className="text-sm font-medium">Previously Released</Label>
                <HoverCard>
                  <HoverCardTrigger>
                    <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
                  </HoverCardTrigger>
                  <HoverCardContent className="w-80">
                    <p className="text-xs">
                      Toggle on if this track was previously released in another format or territory.
                    </p>
                  </HoverCardContent>
                </HoverCard>
              </div>
              <div className="flex items-center space-x-2">
                <Switch
                  id="previouslyReleased"
                  checked={formState.previouslyReleased}
                  onCheckedChange={(checked) => updateForm('previouslyReleased', checked)}
                />
                <Label htmlFor="previouslyReleased">Previously released elsewhere</Label>
              </div>
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
