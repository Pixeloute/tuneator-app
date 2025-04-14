
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, FileWarning, Music } from "lucide-react";

export const ValidationPanel = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Metadata Validation</CardTitle>
        <CardDescription>Verify your track information against industry standards</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">MusicBrainz</span>
              </div>
              <Badge variant="outline" className="bg-electric/10 text-electric">Connected</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">ASCAP</span>
              </div>
              <Badge variant="outline" className="bg-electric/10 text-electric">Connected</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-md bg-secondary/50">
              <div className="flex items-center gap-2">
                <Music className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm font-medium">BMI</span>
              </div>
              <Badge variant="outline" className="bg-muted/10 text-muted-foreground">Not Connected</Badge>
            </div>
          </div>
          
          <div className="rounded-md border border-border p-4">
            <h3 className="text-sm font-medium mb-2">Validation Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Artist Name</span>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-mint mr-1" />
                  <span>Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ISRC Code</span>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-mint mr-1" />
                  <span>Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Album Title</span>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-mint mr-1" />
                  <span>Verified</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">PRO Registration</span>
                <div className="flex items-center">
                  <AlertCircle className="h-4 w-4 text-yellow-500 mr-1" />
                  <span>Partial</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Publishing Info</span>
                <div className="flex items-center">
                  <FileWarning className="h-4 w-4 text-red-500 mr-1" />
                  <span>Missing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-3 rounded-md bg-mint/10 border border-mint/20">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-mint" />
            <h4 className="text-sm font-medium">Recent Validation</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Last validated 2 days ago. 8 tracks were checked against MusicBrainz and ASCAP databases.
            6 tracks passed all validation checks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
