
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrackTable } from "./track-table";
import { TrackData } from "@/types/catalog-types";

interface CatalogTabsProps {
  tracks: TrackData[];
}

export const CatalogTabs = ({ tracks }: CatalogTabsProps) => {
  return (
    <Tabs defaultValue="tracks">
      <TabsList className="grid w-full max-w-md grid-cols-3">
        <TabsTrigger value="tracks">Tracks</TabsTrigger>
        <TabsTrigger value="albums">Albums</TabsTrigger>
        <TabsTrigger value="releases">Releases</TabsTrigger>
      </TabsList>
      <TabsContent value="tracks" className="mt-4">
        <TrackTable tracks={tracks} />
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
  );
};
