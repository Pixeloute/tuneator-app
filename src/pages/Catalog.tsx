
import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { CatalogHeader } from "@/components/catalog/catalog-header";
import { CatalogTabs } from "@/components/catalog/catalog-tabs";
import { mockTrackData } from "@/components/catalog/mock-data";
import { TrackData } from "@/types/catalog-types";

const Catalog = () => {
  useEffect(() => {
    document.title = "Tuneator - Catalog";
  }, []);

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTracks, setFilteredTracks] = useState<TrackData[]>(mockTrackData);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    filterTracks(term);
  };

  const filterTracks = (term: string) => {
    if (!term) {
      setFilteredTracks(mockTrackData);
      return;
    }
    
    const filtered = mockTrackData.filter(track => 
      track.title.toLowerCase().includes(term.toLowerCase()) ||
      track.artist.toLowerCase().includes(term.toLowerCase()) ||
      track.album.toLowerCase().includes(term.toLowerCase()) ||
      track.isrc.toLowerCase().includes(term.toLowerCase())
    );
    
    setFilteredTracks(filtered);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <CatalogHeader searchTerm={searchTerm} onSearch={handleSearch} />
            <CatalogTabs tracks={filteredTracks} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Catalog;
