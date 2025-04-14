
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, CheckCircle, Info, Search } from "lucide-react";
import { MusicBrainzSearchModal } from "./musicbrainz/musicbrainz-search-modal";
import { Progress } from "@/components/ui/progress";

interface MetadataFeedbackProps {
  score: number;
  issues: { type: "warning" | "error" | "info"; message: string }[];
  onValidate: () => void;
}

export const MetadataFeedback = ({ score, issues, onValidate }: MetadataFeedbackProps) => {
  const [showSearch, setShowSearch] = useState(false);
  const [qualityColor, setQualityColor] = useState("text-yellow-500");

  useEffect(() => {
    setQualityColor(
      score >= 80 ? "text-mint" :
      score >= 60 ? "text-electric" :
      "text-yellow-500"
    );
  }, [score]);

  const handleMusicBrainzSelect = (data: { 
    title?: string; 
    artist?: string; 
    isrc?: string; 
    duration?: number; 
  }) => {
    setShowSearch(false);
  };

  const getIssueIcon = (type: "warning" | "error" | "info") => {
    switch (type) {
      case "error":
        return <AlertTriangle className="h-4 w-4 text-destructive" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Info className="h-4 w-4 text-electric" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Metadata Quality
          <Badge variant="outline" className={qualityColor}>
            {score}%
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Progress value={score} className={`h-2 ${qualityColor}`} />
          <p className="text-sm text-muted-foreground">
            {score >= 80 ? "Excellent metadata quality" :
             score >= 60 ? "Good quality, some improvements possible" :
             "Needs attention - fill in more details"}
          </p>
        </div>

        <div className="space-y-3">
          {issues.map((issue, index) => (
            <div
              key={index}
              className="flex items-start gap-2 text-sm"
            >
              {getIssueIcon(issue.type)}
              <div className="flex-1">
                {issue.type === "warning" && issue.message.includes("ISRC") ? (
                  <Button
                    variant="link"
                    className="h-auto p-0 text-yellow-500 hover:text-yellow-400"
                    onClick={() => setShowSearch(true)}
                  >
                    <Search className="h-4 w-4 mr-1" />
                    Search MusicBrainz for ISRC
                  </Button>
                ) : (
                  issue.message
                )}
              </div>
            </div>
          ))}
        </div>

        {issues.length === 0 && (
          <div className="flex items-center gap-2 text-mint text-sm">
            <CheckCircle className="h-4 w-4" />
            All required metadata is present
          </div>
        )}
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
