
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, Check, FileWarning } from "lucide-react";

export const HealthReport = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Metadata Health</CardTitle>
          <CardDescription>Overall catalog quality</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <ProgressCircle 
            value={78} 
            size={180} 
            color="electric"
            label="Health Score" 
          />
          <div className="mt-6 w-full space-y-1.5">
            <div className="flex justify-between text-sm">
              <span>Required Fields</span>
              <span className="font-medium text-mint">92%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-mint rounded-full" style={{ width: '92%' }}></div>
            </div>
            
            <div className="flex justify-between text-sm mt-2">
              <span>Contributor Info</span>
              <span className="font-medium text-electric">76%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-electric rounded-full" style={{ width: '76%' }}></div>
            </div>
            
            <div className="flex justify-between text-sm mt-2">
              <span>Rights & Registration</span>
              <span className="font-medium text-yellow-500">65%</span>
            </div>
            <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Metadata Issues</CardTitle>
          <CardDescription>Items requiring attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 rounded-md border border-red-500/30 bg-red-500/5 flex gap-3">
              <div className="flex-shrink-0">
                <FileWarning className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Missing ISRC Codes</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  2 tracks are missing ISRC codes which are required for proper royalty tracking.
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs bg-muted/20">Urban Pulse.wav</Badge>
                  <Badge variant="outline" className="text-xs bg-muted/20">Digital Dreams.wav</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-md border border-yellow-500/30 bg-yellow-500/5 flex gap-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Incomplete Contributors</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  5 tracks have incomplete contributor information which may affect royalty distribution.
                </p>
                <div className="flex gap-1 mt-2 flex-wrap">
                  <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Midnight Dreams.wav</Badge>
                  <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Urban Pulse.wav</Badge>
                  <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Synth Wave.wav</Badge>
                  <Badge variant="outline" className="text-xs bg-muted/20 mb-1">Digital Dreams.wav</Badge>
                </div>
              </div>
            </div>
            
            <div className="p-3 rounded-md border border-mint/30 bg-mint/5 flex gap-3">
              <div className="flex-shrink-0">
                <Check className="h-5 w-5 text-mint" />
              </div>
              <div>
                <h4 className="text-sm font-medium">Well-Documented Tracks</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  3 tracks have excellent metadata quality with no issues detected.
                </p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline" className="text-xs bg-mint/20 text-mint">Synth Wave.wav</Badge>
                  <Badge variant="outline" className="text-xs bg-mint/20 text-mint">Midnight Dreams.wav</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
