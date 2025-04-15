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
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const Assets = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [assets, setAssets] = useState<Asset[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    document.title = "Tuneator - Assets";
    if (user) {
      fetchAssets();
    }
  }, [user]);

  const fetchAssets = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      
      let query = supabase
        .from('assets')
        .select('*')
        .order('created_at', { ascending: false });
      
      // Apply type filter if not "all"
      if (typeFilter !== "all") {
        query = query.eq('type', typeFilter);
      }
      
      // Apply search filter if present
      if (searchTerm) {
        query = query.ilike('name', `%${searchTerm}%`);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Process the assets to add thumbnail URLs for image assets
      const assetsWithThumbnails = await Promise.all(
        (data as Asset[]).map(async (asset) => {
          if (asset.type === "image" && asset.thumbnail_path) {
            const signedUrl = await getAssetUrl(asset.file_path);
            if (signedUrl) {
              return {
                ...asset,
                thumbnail: signedUrl
              };
            }
          }
          return asset;
        })
      );
      
      setAssets(assetsWithThumbnails);
    } catch (error: any) {
      console.error("Error fetching assets:", error);
      toast({
        title: "Error Loading Assets",
        description: error.message || "Failed to load your assets",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    fetchAssets();
  };

  const handleTypeFilter = (type: string) => {
    setTypeFilter(type);
    fetchAssets();
  };

  const handleAssetDeleted = () => {
    fetchAssets();
  };

  // Redirect to auth if not logged in
  if (!authLoading && !user) {
    return <Navigate to="/auth" />;
  }

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
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && fetchAssets()}
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
                      <SelectItem value="document">Documents</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <AssetUploadCard />
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold">Your Assets</h2>
                <Button variant="outline" size="sm" onClick={fetchAssets}>
                  <Filter className="h-4 w-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <AssetGrid 
                assets={assets} 
                isLoading={isLoading} 
                onAssetDeleted={handleAssetDeleted} 
              />
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Assets;
