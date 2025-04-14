
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { AssetUploadCard } from "@/components/assets/asset-upload-card";
import { Asset, AssetGrid } from "@/components/assets/asset-grid";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Filter, ListFilter, Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Assets = () => {
  useEffect(() => {
    document.title = "Tuneator - Assets";
  }, []);

  // Sample assets data
  const allAssets: Asset[] = [
    {
      id: "1",
      name: "Midnight Dreams.wav",
      type: "audio",
      date: "June 18, 2023",
      metadataScore: 95,
      fileSize: "24.5 MB",
    },
    {
      id: "2",
      name: "Urban Pulse.wav",
      type: "audio",
      date: "June 15, 2023",
      metadataScore: 68,
      fileSize: "18.2 MB",
    },
    {
      id: "3",
      name: "Neon Horizons Album Cover.jpg",
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1614149162883-504ce4d13909?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bmVvbiUyMGFic3RyYWN0fGVufDB8fDB8fHww",
      date: "June 10, 2023",
      metadataScore: 100,
      fileSize: "3.8 MB",
    },
    {
      id: "4",
      name: "Electric Sound - Promo Video.mp4",
      type: "video",
      thumbnail: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjB8fG11c2ljJTIwc3R1ZGlvfGVufDB8fDB8fHww",
      date: "June 5, 2023",
      metadataScore: 72,
      fileSize: "68.4 MB",
    },
    {
      id: "5",
      name: "Synth Wave.wav",
      type: "audio",
      date: "May 28, 2023",
      metadataScore: 88,
      fileSize: "22.1 MB",
    },
    {
      id: "6",
      name: "Artist Press Photo.jpg",
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8bXVzaWMlMjBwZXJmb3JtYW5jZXxlbnwwfHwwfHx8MA%3D%3D",
      date: "May 20, 2023",
      metadataScore: 100,
      fileSize: "5.2 MB",
    },
    {
      id: "7",
      name: "Live Performance.mp4",
      type: "video",
      date: "May 15, 2023",
      metadataScore: 55,
      fileSize: "124.6 MB",
    },
    {
      id: "8",
      name: "Digital Dreams.wav",
      type: "audio",
      date: "May 10, 2023",
      metadataScore: 92,
      fileSize: "19.8 MB",
    },
    {
      id: "9",
      name: "City Lights Album Art.jpg",
      type: "image",
      thumbnail: "https://images.unsplash.com/photo-1503455637927-730bce8583c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fGNpdHklMjBsaWdodHN8ZW58MHx8MHx8fDA%3D",
      date: "May 5, 2023",
      metadataScore: 85,
      fileSize: "4.1 MB",
    },
  ];

  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(allAssets);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterAssets(term, typeFilter);
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    filterAssets(searchTerm, type);
  };

  const filterAssets = (term: string, type: string) => {
    let filtered = allAssets;
    
    // Apply search term filter
    if (term) {
      filtered = filtered.filter(asset => 
        asset.name.toLowerCase().includes(term.toLowerCase())
      );
    }
    
    // Apply type filter
    if (type !== "all") {
      filtered = filtered.filter(asset => asset.type === type);
    }
    
    setFilteredAssets(filtered);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Digital Assets</h1>
              <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search assets..."
                    className="pl-8 w-full sm:w-[260px]"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Select value={typeFilter} onValueChange={handleTypeFilter}>
                    <SelectTrigger className="w-[130px]">
                      <ListFilter className="h-4 w-4 mr-2" />
                      <SelectValue placeholder="Filter" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="audio">Audio</SelectItem>
                      <SelectItem value="image">Images</SelectItem>
                      <SelectItem value="video">Videos</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <AssetUploadCard />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Assets</h2>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
              </div>
              <AssetGrid assets={filteredAssets} />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assets;
