
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PlatformRoyaltyData } from "@/services/revenue-service";

interface RevenueOverviewProps {
  platformData: PlatformRoyaltyData;
}

export function RevenueOverview({ platformData }: RevenueOverviewProps) {
  const getCombinedChartData = () => {
    if (!platformData) return [];
    
    const { spotify, apple, youtube, others } = platformData;
    const combinedData: any[] = [];
    
    spotify.forEach((item, index) => {
      combinedData.push({
        month: item.month,
        spotify: item.revenue,
        apple: apple[index]?.revenue || 0,
        youtube: youtube[index]?.revenue || 0,
        others: others[index]?.revenue || 0
      });
    });
    
    return combinedData;
  };

  return (
    <div className="h-[400px] mt-6">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={getCombinedChartData()}
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
                          ${typeof entry.value === 'number' 
                            ? entry.value.toFixed(2) 
                            : entry.value}
                        </span>
                      </div>
                    ))}
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar
            dataKey="spotify"
            name="Spotify"
            stackId="a"
            fill="#1DB954"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="apple"
            name="Apple Music"
            stackId="a"
            fill="#FC3C44"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="youtube"
            name="YouTube"
            stackId="a"
            fill="#FF0000"
            radius={[0, 0, 0, 0]}
          />
          <Bar
            dataKey="others"
            name="Other"
            stackId="a"
            fill="#8B5CF6"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
