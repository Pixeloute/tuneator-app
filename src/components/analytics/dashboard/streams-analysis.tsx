
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PlatformRoyaltyData } from "@/services/revenue-service";

interface StreamsAnalysisProps {
  platformData: PlatformRoyaltyData;
}

export function StreamsAnalysis({ platformData }: StreamsAnalysisProps) {
  const getStreamsChartData = () => {
    if (!platformData) return [];
    
    const { spotify, apple, youtube } = platformData;
    const streamsData: any[] = [];
    
    spotify.forEach((item, index) => {
      streamsData.push({
        month: item.month,
        spotify: item.streams,
        apple: apple[index]?.streams || 0,
        youtube: youtube[index]?.streams || 0
      });
    });
    
    return streamsData;
  };

  return (
    <div className="h-[400px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={getStreamsChartData()}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
          <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
          <YAxis className="text-xs fill-muted-foreground" />
          <Tooltip
            content={({ active, payload, label }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-background border border-border p-3 rounded-md shadow-md">
                    <p className="text-sm font-medium mb-2">{label}</p>
                    {payload.map((entry) => (
                      <div
                        key={entry.name}
                        className="flex items-center justify-between text-xs"
                      >
                        <span
                          className="flex items-center gap-1"
                          style={{ color: entry.color }}
                        >
                          <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                          {entry.name}:
                        </span>
                        <span className="font-medium">
                          {typeof entry.value === 'number' 
                            ? entry.value.toLocaleString() 
                            : entry.value} streams
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Line
            type="monotone"
            dataKey="spotify"
            name="Spotify"
            stroke="#1DB954"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="apple"
            name="Apple Music"
            stroke="#FC3C44"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="youtube"
            name="YouTube"
            stroke="#FF0000"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
