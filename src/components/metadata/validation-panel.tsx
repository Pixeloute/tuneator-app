import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertCircle, Check, FileWarning, Music, Download, Upload, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// --- MOCK DATA (replace with real data in the future) ---
const mockTracks = [
  {
    id: "1",
    title: "Midnight Dreams",
    artist: "The Electric Sound",
    album: "Neon Horizons",
    isrc: "USRC17607839",
    complianceScore: 95,
    status: "complete",
    issues: [],
  },
  {
    id: "2",
    title: "Urban Pulse",
    artist: "The Electric Sound",
    album: "Neon Horizons",
    isrc: "",
    complianceScore: 68,
    status: "warning",
    issues: [
      { field: "isrc", message: "ISRC missing" },
      { field: "publishing", message: "Publishing info incomplete" },
    ],
  },
  {
    id: "3",
    title: "Digital Dreams",
    artist: "The Electric Sound",
    album: "Neon Horizons",
    isrc: "USRC17607841",
    complianceScore: 92,
    status: "complete",
    issues: [],
  },
  {
    id: "4",
    title: "Synth Wave",
    artist: "The Electric Sound",
    album: "Neon Horizons",
    isrc: "USRC17607842",
    complianceScore: 88,
    status: "complete",
    issues: [],
  },
  {
    id: "5",
    title: "Neon Lights",
    artist: "The Electric Sound",
    album: "City Vibes",
    isrc: "USRC17607843",
    complianceScore: 76,
    status: "warning",
    issues: [
      { field: "isrc", message: "ISRC format invalid" },
    ],
  },
  {
    id: "6",
    title: "Downtown",
    artist: "The Electric Sound",
    album: "City Vibes",
    isrc: "",
    complianceScore: 55,
    status: "incomplete",
    issues: [
      { field: "isrc", message: "ISRC missing" },
      { field: "publishing", message: "Publishing info missing" },
    ],
  },
];
// --- END MOCK DATA ---

export const ValidationPanel = () => {
  // In the future, replace mockTracks with real data from API or context
  const [tracks, setTracks] = useState(mockTracks);
  const [isValidating, setIsValidating] = useState(false);

  // Bulk actions (stubbed)
  const validateAllTracks = () => {
    setIsValidating(true);
    // TODO: Replace with real validation logic
    setTimeout(() => setIsValidating(false), 1000);
  };
  const exportAllToDDEX = () => {
    // TODO: Implement DDEX export for all tracks
    alert("DDEX export (all tracks) - stub");
  };
  const downloadAuditReport = () => {
    // TODO: Implement audit report download
    alert("Download audit report - stub");
  };
  const importDDEX = () => {
    // TODO: Implement DDEX import
    alert("Import DDEX - stub");
  };
  const exportTrackToDDEX = (trackId: string) => {
    // TODO: Implement DDEX export for a single track
    alert(`Export DDEX for track ${trackId} - stub`);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Metadata Validation</CardTitle>
            <CardDescription>Verify your track information against industry standards</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={validateAllTracks} disabled={isValidating}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Validate All
            </Button>
            <Button variant="outline" onClick={exportAllToDDEX}>
              <Download className="h-4 w-4 mr-2" />
              Export All DDEX
            </Button>
            <Button variant="outline" onClick={downloadAuditReport}>
              <Download className="h-4 w-4 mr-2" />
              Download Audit
            </Button>
            <Button variant="outline" onClick={importDDEX}>
              <Upload className="h-4 w-4 mr-2" />
              Import DDEX
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Registry Connections */}
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
                <span className="text-muted-foreground">Total Tracks</span>
                <span>{tracks.length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Compliant</span>
                <span>{tracks.filter(t => t.status === "complete").length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Warnings</span>
                <span>{tracks.filter(t => t.status === "warning").length}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Incomplete</span>
                <span>{tracks.filter(t => t.status === "incomplete").length}</span>
              </div>
            </div>
          </div>
        </div>
        {/* Compliance Table */}
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Artist</TableHead>
                <TableHead>Album</TableHead>
                <TableHead>ISRC</TableHead>
                <TableHead>Score</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Issues</TableHead>
                <TableHead>DDEX</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tracks.map((track) => (
                <TableRow key={track.id}>
                  <TableCell>{track.title}</TableCell>
                  <TableCell>{track.artist}</TableCell>
                  <TableCell>{track.album}</TableCell>
                  <TableCell>{track.isrc || <span className="text-red-500 text-xs">Missing</span>}</TableCell>
                  <TableCell>{track.complianceScore}%</TableCell>
                  <TableCell>
                    {track.status === "complete" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-mint/10 text-mint">Compliant</span>}
                    {track.status === "warning" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">Warning</span>}
                    {track.status === "incomplete" && <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-destructive/10 text-destructive">Incomplete</span>}
                  </TableCell>
                  <TableCell>
                    {track.issues.length === 0 ? (
                      <span className="text-mint text-xs">None</span>
                    ) : (
                      <ul className="list-disc pl-4 text-xs space-y-1">
                        {track.issues.map((issue, idx) => (
                          <li key={idx} className="text-destructive">{issue.field}: {issue.message}</li>
                        ))}
                      </ul>
                    )}
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => exportTrackToDDEX(track.id)}>
                      <Download className="h-4 w-4 mr-1" /> Export
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {/* Recent Validation Summary */}
        <div className="p-3 rounded-md bg-mint/10 border border-mint/20">
          <div className="flex items-center gap-2 mb-2">
            <Check className="h-5 w-5 text-mint" />
            <h4 className="text-sm font-medium">Recent Validation</h4>
          </div>
          <p className="text-xs text-muted-foreground">
            Last validated just now. {tracks.length} tracks checked. {tracks.filter(t => t.status === "complete").length} passed all validation checks.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
