
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ProgressCircle } from "@/components/ui/progress-circle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface TrackData {
  id: string;
  title: string;
  artist: string;
  album: string;
  isrc: string;
  metadataScore: number;
  status: "complete" | "incomplete" | "warning";
  release: string;
}

const Catalog = () => {
  useEffect(() => {
    document.title = "Tuneator - Catalog";
  }, []);

  const trackData: TrackData[] = [
    {
      id: "1",
      title: "Midnight Dreams",
      artist: "The Electric Sound",
      album: "Neon Horizons",
      isrc: "USRC17607839",
      metadataScore: 95,
      status: "complete",
      release: "2023-09-15",
    },
    {
      id: "2",
      title: "Urban Pulse",
      artist: "The Electric Sound",
      album: "Neon Horizons",
      isrc: "PENDING",
      metadataScore: 68,
      status: "warning",
      release: "2023-09-15",
    },
    {
      id: "3",
      title: "Digital Dreams",
      artist: "The Electric Sound",
      album: "Neon Horizons",
      isrc: "USRC17607841",
      metadataScore: 92,
      status: "complete",
      release: "2023-09-15",
    },
    {
      id: "4",
      title: "Synth Wave",
      artist: "The Electric Sound",
      album: "Neon Horizons",
      isrc: "USRC17607842",
      metadataScore: 88,
      status: "complete",
      release: "2023-09-15",
    },
    {
      id: "5",
      title: "Neon Lights",
      artist: "The Electric Sound",
      album: "City Vibes",
      isrc: "USRC17607843",
      metadataScore: 76,
      status: "warning",
      release: "2023-05-22",
    },
    {
      id: "6",
      title: "Downtown",
      artist: "The Electric Sound",
      album: "City Vibes",
      isrc: "PENDING",
      metadataScore: 55,
      status: "incomplete",
      release: "2023-05-22",
    },
    {
      id: "7",
      title: "City Pulse",
      artist: "The Electric Sound",
      album: "City Vibes",
      isrc: "USRC17607845",
      metadataScore: 82,
      status: "complete",
      release: "2023-05-22",
    },
  ];

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTracks, setFilteredTracks] = useState<TrackData[]>(trackData);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterTracks(term);
  };

  const filterTracks = (term: string) => {
    if (!term) {
      setFilteredTracks(trackData);
      return;
    }
    
    const filtered = trackData.filter(track => 
      track.title.toLowerCase().includes(term.toLowerCase()) ||
      track.artist.toLowerCase().includes(term.toLowerCase()) ||
      track.album.toLowerCase().includes(term.toLowerCase()) ||
      track.isrc.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredTracks(filtered);
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
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Catalog Management</h1>
              <div className="relative w-full md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search catalog..."
                  className="pl-8"
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
            
            <Tabs defaultValue="tracks">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="tracks">Tracks</TabsTrigger>
                <TabsTrigger value="albums">Albums</TabsTrigger>
                <TabsTrigger value="releases">Releases</TabsTrigger>
              </TabsList>
              <TabsContent value="tracks" className="mt-4">
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
                      {filteredTracks.map((track) => (
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
              </TabsContent>
              <TabsContent value="albums" className="mt-4">
                <div className="rounded-md border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Album View Coming Soon</h3>
                  <p className="text-muted-foreground">This feature will be available in the next update.</p>
                </div>
              </TabsContent>
              <TabsContent value="releases" className="mt-4">
                <div className="rounded-md border border-dashed p-8 text-center">
                  <h3 className="text-lg font-medium mb-2">Release Management Coming Soon</h3>
                  <p className="text-muted-foreground">This feature will be available in the next update.</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Catalog;
