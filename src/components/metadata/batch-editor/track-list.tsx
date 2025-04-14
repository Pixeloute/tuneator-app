
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Track } from "./types";

interface TrackListProps {
  tracks: Track[];
  onToggleTrack: (trackId: string) => void;
  onToggleAll: () => void;
}

export const TrackList = ({ tracks, onToggleTrack, onToggleAll }: TrackListProps) => {
  const allSelected = tracks.length > 0 && tracks.every(track => track.selected);

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={allSelected} 
                onCheckedChange={onToggleAll}
              />
            </TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Artist</TableHead>
            <TableHead>Album</TableHead>
            <TableHead>ISRC</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tracks.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No tracks match the selected filter
              </TableCell>
            </TableRow>
          ) : (
            tracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <Checkbox 
                    checked={track.selected} 
                    onCheckedChange={() => onToggleTrack(track.id)}
                  />
                </TableCell>
                <TableCell>{track.title}</TableCell>
                <TableCell>{track.artist}</TableCell>
                <TableCell>{track.album}</TableCell>
                <TableCell>
                  {track.isrc || (
                    <span className="text-red-500 text-xs">Missing</span>
                  )}
                </TableCell>
                <TableCell>
                  {track.hasIssues ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-yellow-500/10 text-yellow-500">
                      Has issues
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-mint/10 text-mint">
                      Complete
                    </span>
                  )}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
