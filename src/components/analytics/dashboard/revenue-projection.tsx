
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { PlatformRoyaltyData } from "@/services/revenue-service";

interface RevenueProjectionProps {
  platformData: PlatformRoyaltyData;
}

export function RevenueProjection({ platformData }: RevenueProjectionProps) {
  const getCombinedChartData = () => {
    if (!platformData) return [];
    
    const { spotify, apple, youtube, others } = platformData;
    const combinedData: any[] = [];
    
    spotify.forEach((item, index) => {
      combinedData.push({
        month: item.month,
        total: item.revenue + (apple[index]?.revenue || 0) + (youtube[index]?.revenue || 0) + (others[index]?.revenue || 0)
      });
    });
    
    return [
      ...combinedData,
      { month: 'Jan', total: 1250, projected: true },
      { month: 'Feb', total: 1320, projected: true },
      { month: 'Mar', total: 1410, projected: true },
      { month: 'Apr', total: 1510, projected: true },
      { month: 'May', total: 1630, projected: true },
      { month: 'Jun', total: 1750, projected: true }
    ];
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Revenue Projection (Next 6 Months)</h3>
        <div className="h-[350px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={getCombinedChartData()}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis dataKey="month" className="text-xs fill-muted-foreground" />
              <YAxis className="text-xs fill-muted-foreground" />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const isProjected = payload[0].payload.projected;
                    return (
                      <div className="bg-background border border-border p-3 rounded-md shadow-md">
                        <p className="text-sm font-medium mb-2">{label} {isProjected ? '(Projected)' : ''}</p>
                        {payload.map((entry) => (
                          <div
                            key={entry.name}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="flex items-center gap-1" style={{ color: entry.color }}>
                              <div className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.color }} />
                              {entry.name === 'total' ? 'Total Revenue' : entry.name}:
                            </span>
                            <span className="font-medium">
                              ${typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value}
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
                dataKey="total"
                name="total"
                stroke="#8B5CF6"
                strokeWidth={2}
                dot={(props) => {
                  const isProjected = props.payload.projected;
                  if (isProjected) {
                    return (
                      <svg
                        x={props.cx - 5}
                        y={props.cy - 5}
                        width={10}
                        height={10}
                        fill="#8B5CF6"
                        viewBox="0 0 10 10"
                      >
                        <circle cx="5" cy="5" r="5" fillOpacity="0.3" />
                        <circle cx="5" cy="5" r="2.5" />
                      </svg>
                    );
                  }
                  return <circle cx={props.cx} cy={props.cy} r={4} fill="#8B5CF6" />;
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4">
          <Badge className="bg-purple-100 text-purple-800 border-none">Projection based on current growth rate</Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Your projected revenue for the next 6 months is <span className="font-semibold">${(1250 + 1320 + 1410 + 1510 + 1630 + 1750).toLocaleString()}</span>, 
            representing a <span className="text-mint">+23%</span> increase over the current period.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
