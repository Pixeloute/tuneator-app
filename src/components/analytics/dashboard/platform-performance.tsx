
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PlatformRoyaltyData } from "@/services/revenue-service";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Separator } from "@/components/ui/separator";

interface PlatformPerformanceProps {
  platformData: PlatformRoyaltyData;
}

export function PlatformPerformance({ platformData }: PlatformPerformanceProps) {
  const getPlatformMetrics = () => {
    const platforms = ['spotify', 'apple', 'youtube', 'others'] as const;
    const platformColors = {
      spotify: '#1DB954',
      apple: '#FC3C44',
      youtube: '#FF0000',
      others: '#8B5CF6'
    };
    
    return platforms.map(platform => {
      const data = platformData[platform] || [];
      const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0);
      const totalStreams = data.reduce((sum, item) => sum + item.streams, 0);
      const revenuePerStream = totalStreams > 0 ? totalRevenue / totalStreams : 0;
      
      // Calculate growth if possible
      let growth = 0;
      if (data.length >= 2) {
        const firstMonth = data[0].revenue;
        const lastMonth = data[data.length - 1].revenue;
        growth = firstMonth > 0 ? ((lastMonth - firstMonth) / firstMonth) * 100 : 0;
      }
      
      return {
        platform: platform.charAt(0).toUpperCase() + platform.slice(1),
        color: platformColors[platform],
        revenue: totalRevenue.toFixed(2),
        streams: totalStreams.toLocaleString(),
        revenuePerStream: revenuePerStream.toFixed(6),
        revenuePerThousand: (revenuePerStream * 1000).toFixed(2),
        growth: growth.toFixed(1)
      };
    });
  };
  
  const getRevenuePerStreamData = () => {
    const metrics = getPlatformMetrics();
    return metrics.map(metric => ({
      platform: metric.platform,
      value: parseFloat(metric.revenuePerThousand),
      fill: metric.color
    }));
  };
  
  const platformMetrics = getPlatformMetrics();
  const revenuePerStreamData = getRevenuePerStreamData();
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Platform Performance Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Revenue Per 1K Streams</h3>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={revenuePerStreamData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                  <XAxis dataKey="platform" className="text-xs fill-muted-foreground" />
                  <YAxis className="text-xs fill-muted-foreground" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-background border border-border p-3 rounded-md shadow-md">
                            <p className="text-sm font-medium">{label}</p>
                            <div className="flex items-center justify-between text-xs mt-1">
                              <span
                                className="flex items-center gap-1"
                                style={{ color: payload[0].payload.fill }}
                              >
                                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: payload[0].payload.fill }} />
                                Per 1K streams:
                              </span>
                              <span className="font-medium">
                                ${payload[0].value}
                              </span>
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Bar dataKey="value" name="$ per 1K" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Platform Metrics</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Platform</TableHead>
                  <TableHead className="text-right">Revenue</TableHead>
                  <TableHead className="text-right">Streams</TableHead>
                  <TableHead className="text-right">$/1K Streams</TableHead>
                  <TableHead className="text-right">Growth</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {platformMetrics.map((metric) => (
                  <TableRow key={metric.platform}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: metric.color }}
                        />
                        {metric.platform}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">${metric.revenue}</TableCell>
                    <TableCell className="text-right">{metric.streams}</TableCell>
                    <TableCell className="text-right">${metric.revenuePerThousand}</TableCell>
                    <TableCell className="text-right">
                      <span className={parseFloat(metric.growth) >= 0 ? "text-mint" : "text-destructive"}>
                        {metric.growth}%
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            <Separator className="my-4" />
            
            <div className="text-sm text-muted-foreground">
              <p>
                <span className="font-medium">Revenue Per Stream</span> shows how much you earn for each stream on a platform. Higher values mean better monetization.
              </p>
              <p className="mt-2">
                <span className="font-medium">Growth</span> compares first and last month revenue, showing trend direction.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
