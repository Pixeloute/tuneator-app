import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import { CheckCircle2, Filter, MoreHorizontal } from "lucide-react";

interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  isrc: string;
  selected: boolean;
  hasIssues: boolean;
}

export const BatchEditor = () => {
  const [tracks, setTracks] = useState<Track[]>([
    { 
      id: "1", 
      title: "Midnight Dreams", 
      artist: "The Electric Sound", 
      album: "Neon Horizons", 
      isrc: "USRC17607839", 
      selected: false, 
      hasIssues: false 
    },
    { 
      id: "2", 
      title: "Urban Pulse", 
      artist: "The Electric Sound", 
      album: "Neon Horizons", 
      isrc: "", 
      selected: false, 
      hasIssues: true 
    },
    { 
      id: "3", 
      title: "Digital Dreams", 
      artist: "The Electric Sound", 
      album: "Neon Horizons", 
      isrc: "", 
      selected: false, 
      hasIssues: true 
    },
    { 
      id: "4", 
      title: "Synth Wave", 
      artist: "The Electric Sound", 
      album: "Neon Horizons", 
      isrc: "USRC17607841", 
      selected: false, 
      hasIssues: false 
    },
  ]);
  
  const [filter, setFilter] = useState("all");
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);

  // Select/deselect all tracks
  const toggleSelectAll = () => {
    const allSelected = tracks.every(track => track.selected);
    const updatedTracks = tracks.map(track => ({
      ...track,
      selected: !allSelected
    }));
    setTracks(updatedTracks);
    setSelectedCount(allSelected ? 0 : updatedTracks.length);
  };

  // Toggle selection for a single track
  const toggleTrackSelection = (trackId: string) => {
    const updatedTracks = tracks.map(track => {
      if (track.id === trackId) {
        const newSelectedState = !track.selected;
        return { ...track, selected: newSelectedState };
      }
      return track;
    });
    
    setTracks(updatedTracks);
    setSelectedCount(updatedTracks.filter(t => t.selected).length);
  };

  // Apply bulk edit to selected tracks
  const applyBulkEdit = () => {
    if (!bulkField || !bulkValue) {
      toast({
        title: "Incomplete Information",
        description: "Please select a field and enter a value to apply.",
        variant: "destructive",
      });
      return;
    }

    const updatedTracks = tracks.map(track => {
      if (track.selected) {
        return {
          ...track,
          [bulkField]: bulkValue,
          hasIssues: bulkField === "isrc" ? false : track.hasIssues
        };
      }
      return track;
    });
    
    setTracks(updatedTracks);
    
    toast({
      title: "Bulk Update Applied",
      description: `Updated ${selectedCount} tracks with new ${bulkField} value.`,
    });
  };

  // Filter tracks based on selected filter
  const filteredTracks = tracks.filter(track => {
    if (filter === "all") return true;
    if (filter === "issues") return track.hasIssues;
    if (filter === "noIssues") return !track.hasIssues;
    return true;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Batch Metadata Editor</CardTitle>
            <CardDescription>Edit metadata for multiple tracks at once</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-40">
                <div className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tracks</SelectItem>
                <SelectItem value="issues">Has Issues</SelectItem>
                <SelectItem value="noIssues">No Issues</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={tracks.length > 0 && tracks.every(track => track.selected)} 
                      onCheckedChange={toggleSelectAll}
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
                {filteredTracks.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                      No tracks match the selected filter
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredTracks.map((track) => (
                    <TableRow key={track.id}>
                      <TableCell>
                        <Checkbox 
                          checked={track.selected} 
                          onCheckedChange={() => toggleTrackSelection(track.id)}
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

          <div className="p-4 rounded-md border border-border bg-secondary/20">
            <h3 className="text-sm font-medium mb-3">Bulk Edit {selectedCount > 0 && `(${selectedCount} tracks selected)`}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Select 
                  value={bulkField} 
                  onValueChange={setBulkField}
                  disabled={selectedCount === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select field to edit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="album">Album</SelectItem>
                    <SelectItem value="artist">Artist</SelectItem>
                    <SelectItem value="isrc">ISRC</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <div className="flex gap-2">
                  <Input 
                    placeholder={`Enter new ${bulkField || 'value'}`}
                    value={bulkValue}
                    onChange={(e) => setBulkValue(e.target.value)}
                    disabled={selectedCount === 0 || !bulkField}
                  />
                  <Button 
                    onClick={applyBulkEdit}
                    disabled={selectedCount === 0 || !bulkField || !bulkValue}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Total: {tracks.length} tracks | With Issues: {tracks.filter(t => t.hasIssues).length}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          disabled={tracks.filter(t => t.hasIssues).length === 0}
          onClick={() => toast({
            title: "Fix All Issues",
            description: "This feature will be available in the next update.",
          })}
        >
          Auto-Fix All Issues
        </Button>
      </CardFooter>
    </Card>
  );
};
