
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { TrackList } from "./batch-editor/track-list";
import { BulkEditPanel } from "./batch-editor/bulk-edit-panel";
import { FilterSelect } from "./batch-editor/filter-select";
import { Track } from "./batch-editor/types";

const initialTracks: Track[] = [
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
];

export const BatchEditor = () => {
  const [tracks, setTracks] = useState<Track[]>(initialTracks);
  const [filter, setFilter] = useState("all");
  const [bulkField, setBulkField] = useState("");
  const [bulkValue, setBulkValue] = useState("");
  const [selectedCount, setSelectedCount] = useState(0);

  const toggleSelectAll = () => {
    const allSelected = tracks.every(track => track.selected);
    const updatedTracks = tracks.map(track => ({
      ...track,
      selected: !allSelected
    }));
    setTracks(updatedTracks);
    setSelectedCount(allSelected ? 0 : updatedTracks.length);
  };

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
          <FilterSelect value={filter} onChange={setFilter} />
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <TrackList
            tracks={filteredTracks}
            onToggleTrack={toggleTrackSelection}
            onToggleAll={toggleSelectAll}
          />

          <BulkEditPanel
            selectedCount={selectedCount}
            bulkField={bulkField}
            bulkValue={bulkValue}
            onFieldChange={setBulkField}
            onValueChange={setBulkValue}
            onApply={applyBulkEdit}
          />
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
