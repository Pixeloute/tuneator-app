
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CatalogSearchProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const CatalogSearch = ({ searchTerm, onSearch }: CatalogSearchProps) => {
  return (
    <div className="relative w-full md:w-64">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search catalog..."
        className="pl-8"
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
};
