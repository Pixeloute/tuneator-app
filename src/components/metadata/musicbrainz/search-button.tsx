
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { MusicBrainzSearchModal } from "./musicbrainz-search-modal";

interface SearchButtonProps {
  onSelect: (data: { 
    title?: string;
    artist?: string;
    isrc?: string;
    duration?: number;
  }) => void;
  className?: string;
}

export function MusicBrainzSearchButton({ onSelect, className }: SearchButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className={className}
        onClick={() => setIsModalOpen(true)}
      >
        <Search className="h-4 w-4 mr-2" />
        Search MusicBrainz
      </Button>

      <MusicBrainzSearchModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={onSelect}
      />
    </>
  );
}
