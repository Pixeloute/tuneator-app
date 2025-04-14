import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, Info } from "lucide-react";
import { MusicBrainzSearchModal } from "./musicbrainz/musicbrainz-search-modal";

interface MetadataFeedbackProps {
  score: number;
  issues: { type: "warning" | "error" | "info"; message: string }[];
  onValidate: () => void;
}

export const MetadataFeedback = ({ score, issues, onValidate }: MetadataFeedbackProps) => {
  const [showSearch, setShowSearch] = useState(false);

  const handleMusicBrainzSelect = (data: { 
    title?: string; 
    artist?: string; 
    isrc?: string; 
    duration?: number; 
  }) => {
    // Handle metadata update
    // This will be handled by the parent component through context
    setShowSearch(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Metadata Quality
          <Badge variant="secondary">{score}%</Badge>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {issues.map((issue, index) => (
          <div
            key={index}
            className="flex items-start space-x-2 text-sm mb-2"
          >
            <div>
              {issue.type === "warning" && issue.message.includes("ISRC") && (
                <Button
                  variant="link"
                  className="h-auto p-0 text-yellow-500 hover:text-yellow-400"
                  onClick={() => setShowSearch(true)}
                >
                  🔍 Search MusicBrainz for ISRC
                </Button>
              )}
              {issue.message}
            </div>
          </div>
        ))}
      </CardContent>

      {showSearch && (
        <MusicBrainzSearchModal
          isOpen={showSearch}
          onClose={() => setShowSearch(false)}
          onSelect={handleMusicBrainzSelect}
        />
      )}
    </Card>
  );
};
