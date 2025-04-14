
import { Card, CardContent } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface PredictionsChartProps {
  monthlyProjections: Array<{
    month: string;
    year: number;
    revenue: number;
  }>;
}

export function PredictionsChart({ monthlyProjections }: PredictionsChartProps) {
  // Format data for chart
  const chartData = monthlyProjections.map(projection => ({
    month: `${projection.month} ${projection.year}`,
    revenue: projection.revenue
  }));
  
  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Monthly Revenue Projection</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
              <XAxis 
                dataKey="month" 
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: "rgba(100, 100, 100, 0.3)" }}
                axisLine={{ stroke: "rgba(100, 100, 100, 0.3)" }}
              />
              <YAxis
                className="text-xs fill-muted-foreground"
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `$${value}`}
                tickLine={{ stroke: "rgba(100, 100, 100, 0.3)" }}
                axisLine={{ stroke: "rgba(100, 100, 100, 0.3)" }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="bg-background border border-border p-3 rounded-md shadow-md">
                        <p className="text-sm font-medium">{label}</p>
                        <p className="text-sm text-electric font-semibold">
                          ${payload[0].value.toLocaleString()}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#00F5C3"
                strokeWidth={2}
                activeDot={{ r: 8 }}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
