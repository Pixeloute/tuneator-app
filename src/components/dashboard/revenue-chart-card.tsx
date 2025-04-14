
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

interface RevenueData {
  month: string;
  spotify: number;
  apple: number;
  youtube: number;
  other: number;
}

interface RevenueChartCardProps {
  data: RevenueData[];
}

export const RevenueChartCard = ({ data }: RevenueChartCardProps) => {
  return (
    <Card className="col-span-full">
      <CardHeader>
        <CardTitle>Revenue Insights</CardTitle>
        <CardDescription>Track your earnings across platforms</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 30,
                left: 0,
                bottom: 5,
              }}
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
                dataKey="other"
                name="Other"
                stackId="a"
                fill="#8B5CF6"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
