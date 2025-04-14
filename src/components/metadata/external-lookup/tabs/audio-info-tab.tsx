
import type { EnrichedMetadata } from "@/services/types/shared-types";

interface AudioInfoTabProps {
  metadata: EnrichedMetadata;
}

export const AudioInfoTab = ({ metadata }: AudioInfoTabProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-md font-medium">Audio Characteristics</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {metadata.bpm && (
          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium">Tempo (BPM)</h4>
            <p className="text-2xl font-semibold">{Math.round(metadata.bpm)}</p>
          </div>
        )}
        
        {metadata.key && (
          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium">Key</h4>
            <p className="text-2xl font-semibold">{metadata.key}</p>
          </div>
        )}
        
        {metadata.duration && (
          <div className="bg-muted p-3 rounded-md">
            <h4 className="text-sm font-medium">Duration</h4>
            <p className="text-2xl font-semibold">
              {Math.floor(metadata.duration / 60000)}:{String(Math.floor((metadata.duration % 60000) / 1000)).padStart(2, '0')}
            </p>
          </div>
        )}
      </div>
      
      {metadata.audioFeatures && (
        <div className="space-y-2 pt-2">
          <h4 className="text-sm font-medium">Audio Analysis</h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {Object.entries(metadata.audioFeatures).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <p className="text-xs capitalize">{key}</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-electric"
                    style={{ width: `${Number(value) * 100}%` }}
                  />
                </div>
                <p className="text-xs text-right">{Math.round(Number(value) * 100)}%</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
