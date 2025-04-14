
import { CatalogSearch } from "./catalog-search";

interface CatalogHeaderProps {
  searchTerm: string;
  onSearch: (term: string) => void;
}

export const CatalogHeader = ({ searchTerm, onSearch }: CatalogHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <h1 className="text-2xl font-bold">Catalog Management</h1>
      <CatalogSearch searchTerm={searchTerm} onSearch={onSearch} />
    </div>
  );
};
