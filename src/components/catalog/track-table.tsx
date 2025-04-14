
import { Badge } from "@/components/ui/badge";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TrackData } from "@/types/catalog-types";

interface TrackTableProps {
  tracks: TrackData[];
}

export const TrackTable = ({ tracks }: TrackTableProps) => {
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
            <TableHead>Title</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>ISRC</TableHead>
            <TableHead>Metadata</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.map((track) => (
            <TableRow key={track.id}>
              <TableCell>
                <div>
                  <div className="font-medium">{track.title}</div>
                  <div className="text-sm text-muted-foreground">{track.artist}</div>
                </div>
              </TableCell>
              <TableCell>{track.album}</TableCell>
              <TableCell>
                {track.isrc === "PENDING" ? (
                  <span className="text-yellow-500">PENDING</span>
                ) : (
                  track.isrc
                )}
              </TableCell>
              <TableCell>
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
              <TableCell>{getStatusBadge(track.status)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
