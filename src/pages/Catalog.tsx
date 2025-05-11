
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
    // Safety check for mockTrackData
    const safeTrackData = Array.isArray(mockTrackData) ? mockTrackData : [];
    
    if (!term) {
      setFilteredTracks(safeTrackData);
      return;
    }
    
    const termLower = term.toLowerCase();
    const filtered = safeTrackData.filter(track => 
      (track.title || '').toLowerCase().includes(termLower) ||
      (track.artist || '').toLowerCase().includes(termLower) ||
      (track.album || '').toLowerCase().includes(termLower) ||
      (track.isrc || '').toLowerCase().includes(termLower)
    );
    
    setFilteredTracks(filtered);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 overflow-hidden">
          <TopBar />
          <main className="container mx-auto p-4 md:p-6 space-y-6 pb-16">
            <CatalogHeader searchTerm={searchTerm} onSearch={handleSearch} />
            <CatalogTabs tracks={filteredTracks} />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Catalog;
