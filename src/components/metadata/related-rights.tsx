
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ContributorType {
  id: string;
  name: string;
  role: string;
  share?: number;
}

interface RelatedRightsProps {
  isrc: string;
  setIsrc: (value: string) => void;
  iswc: string;
  setIswc: (value: string) => void;
  pLine: string;
  setPLine: (value: string) => void;
  cLine: string;
  setCLine: (value: string) => void;
  contributors: ContributorType[];
  addContributor: () => void;
  removeContributor: (id: string) => void;
  updateContributor: (id: string, field: keyof ContributorType, value: any) => void;
}

export const RelatedRights = ({
  isrc,
  setIsrc,
  iswc,
  setIswc,
  pLine,
  setPLine,
  cLine,
  setCLine,
  contributors,
  addContributor,
  removeContributor,
  updateContributor
}: RelatedRightsProps) => {
  // Calculate total share percentage
  const totalShare = contributors.reduce((sum, c) => sum + (c.share || 0), 0);
  
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Rights Information</CardTitle>
          <CardDescription>Manage rights and ownership details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="isrc">ISRC Code</Label>
              <Input
                id="isrc"
                value={isrc}
                onChange={(e) => setIsrc(e.target.value)}
                placeholder="e.g., USRC17607839"
              />
              <p className="text-xs text-muted-foreground">International Standard Recording Code</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="iswc">ISWC Code</Label>
              <Input
                id="iswc"
                value={iswc}
                onChange={(e) => setIswc(e.target.value)}
                placeholder="e.g., T-034.524.680-C"
              />
              <p className="text-xs text-muted-foreground">International Standard Musical Work Code</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="p_line">P-Line</Label>
              <Input
                id="p_line"
                value={pLine}
                onChange={(e) => setPLine(e.target.value)}
                placeholder="e.g., 2023 Neon Records"
              />
              <p className="text-xs text-muted-foreground">Sound recording copyright info</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="c_line">C-Line</Label>
              <Input
                id="c_line"
                value={cLine}
                onChange={(e) => setCLine(e.target.value)}
                placeholder="e.g., 2023 Neon Publishing"
              />
              <p className="text-xs text-muted-foreground">Composition copyright info</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Contributors</CardTitle>
              <CardDescription>People who worked on this track</CardDescription>
            </div>
            <div className="text-sm">
              Total Share: <span className={totalShare === 100 ? "text-mint" : "text-yellow-500"}>{totalShare}%</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {contributors.map((contributor) => (
              <div 
                key={contributor.id} 
                className="flex items-start gap-2 p-3 rounded-md border border-border"
              >
                <div className="flex-1 space-y-3">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                    <div className="md:col-span-1">
                      <Input
                        value={contributor.name}
                        onChange={(e) =>
                          updateContributor(contributor.id, "name", e.target.value)
                        }
                        placeholder="Name"
                      />
                    </div>
                    <div className="md:col-span-1">
                      <Select
                        value={contributor.role}
                        onValueChange={(value) =>
                          updateContributor(contributor.id, "role", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Producer">Producer</SelectItem>
                          <SelectItem value="Songwriter">Songwriter</SelectItem>
                          <SelectItem value="Performer">Performer</SelectItem>
                          <SelectItem value="Featured Artist">Featured Artist</SelectItem>
                          <SelectItem value="Engineer">Engineer</SelectItem>
                          <SelectItem value="Arranger">Arranger</SelectItem>
                          <SelectItem value="Mixer">Mixer</SelectItem>
                          <SelectItem value="Publisher">Publisher</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="md:col-span-1">
                      <div className="relative">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          value={contributor.share || ""}
                          onChange={(e) =>
                            updateContributor(contributor.id, "share", e.target.value)
                          }
                          placeholder="Share %"
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                          <span className="text-muted-foreground">%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeContributor(contributor.id)}
                  className="h-8 text-muted-foreground hover:text-destructive mt-1"
                >
                  Remove
                </Button>
              </div>
            ))}
            
            <Button 
              variant="outline" 
              onClick={addContributor}
              className="w-full mt-2"
            >
              Add Contributor
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
