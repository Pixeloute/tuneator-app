
import { Badge } from "@/components/ui/badge";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrackData } from "@/types/catalog-types";
import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";

interface TrackTableProps {
  tracks: TrackData[];
}

export const TrackTable = ({ tracks }: TrackTableProps) => {
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  const toggleRow = (id: string) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const getStatusBadge = (status: TrackData["status"]) => {
    switch (status) {
      case "complete":
        return <Badge variant="outline" className="bg-mint/10 text-mint border-mint/20">Complete</Badge>;
      case "incomplete":
        return <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Incomplete</Badge>;
      case "warning":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "mint";
    if (score >= 60) return "electric";
    return "destructive";
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-10"></TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>ISRC</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <>
              <TableRow key={track.id} className="cursor-pointer hover:bg-muted/50">
                <TableCell className="p-2" onClick={() => toggleRow(track.id)}>
                  {expandedRows[track.id] ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </TableCell>
                <TableCell onClick={() => toggleRow(track.id)}>
                  <div>
                    <div className="font-medium">{track.title}</div>
                    <div className="text-sm text-muted-foreground">{track.artist}</div>
                  </div>
                </TableCell>
                <TableCell onClick={() => toggleRow(track.id)}>{track.album}</TableCell>
                <TableCell onClick={() => toggleRow(track.id)}>
                  {track.isrc === "PENDING" ? (
                    <span className="text-yellow-500">PENDING</span>
                  ) : (
                    track.isrc
                  )}
                </TableCell>
                <TableCell onClick={() => toggleRow(track.id)}>
                  <div className="flex items-center">
                    <ProgressCircle
                      value={track.metadataScore}
                      size={36}
                      strokeWidth={4}
                      showPercentage={false}
                      color={getScoreColor(track.metadataScore)}
                      className="mr-2"
                    />
                    <span className="font-medium">{track.metadataScore}%</span>
                  </div>
                </TableCell>
                <TableCell onClick={() => toggleRow(track.id)}>{getStatusBadge(track.status)}</TableCell>
              </TableRow>
              {expandedRows[track.id] && (
                <TableRow className="bg-muted/30">
                  <TableCell colSpan={6} className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium mb-2">Release Details</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Release Date:</span>
                            <span className="text-sm">{track.release}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Genre:</span>
                            <span className="text-sm">{track.genre || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Duration:</span>
                            <span className="text-sm">{track.duration || "Not specified"}</span>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium mb-2">Credits</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Writers:</span>
                            <span className="text-sm">{track.writers?.join(", ") || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Producers:</span>
                            <span className="text-sm">{track.producers?.join(", ") || "Not specified"}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-muted-foreground text-sm">Primary Artist:</span>
                            <span className="text-sm">{track.artist}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
