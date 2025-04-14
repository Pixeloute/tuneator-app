
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchGeographicalInsights } from "@/services/google-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Button } from "@/components/ui/button";
import { TrendingUp, Download, Globe } from "lucide-react";

export function GeographicalInsights() {
  const [geoData, setGeoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  useEffect(() => {
    const loadGeoData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchGeographicalInsights();
        setGeoData(data);
      } catch (error) {
        console.error("Failed to load geographical insights:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadGeoData();
  }, []);
  
  // Format data for pie chart
  const getPieChartData = () => {
    if (!geoData || !geoData.regions) return [];
    
    return geoData.regions.slice(0, 5).map((region: any) => ({
      name: region.country,
      value: region.revenue
    }));
  };
  
  // Generate colors for pie chart
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];
  
  const renderDownloadReport = () => {
    return (
      <Button variant="outline" size="sm" className="flex items-center gap-1">
        <Download className="h-4 w-4" />
        <span>Export Report</span>
      </Button>
    );
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-mint" />
            <div>
              <CardTitle>Geographical Insights</CardTitle>
              <CardDescription>Revenue and streaming patterns by region</CardDescription>
            </div>
          </div>
          
          {!isLoading && renderDownloadReport()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-[300px] w-full" />
              <Skeleton className="h-[300px] w-full" />
            </div>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium mb-4">Top Revenue Regions</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={getPieChartData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieChartData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Revenue']}
                        contentStyle={{ background: 'rgba(0, 0, 0, 0.8)', border: 'none', borderRadius: '4px' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div>
                <h3 className="text-lg font-medium mb-4">Regional Performance</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Country</TableHead>
                        <TableHead className="text-right">Streams</TableHead>
                        <TableHead className="text-right">Revenue</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {geoData.regions.slice(0, 8).map((region: any) => (
                        <TableRow key={region.country}>
                          <TableCell className="font-medium">{region.country}</TableCell>
                          <TableCell className="text-right">{region.streams.toLocaleString()}</TableCell>
                          <TableCell className="text-right">${region.revenue.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Fastest Growing Regions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {geoData.trends.fastestGrowing.map((country: string) => (
                      <Badge key={country} className="bg-mint/10 text-mint border-mint/20 flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        {country}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    These regions show the highest growth rate in streams and royalties over the past period.
                    Consider focusing marketing efforts in these areas.
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Highest Revenue Per Stream</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {geoData.trends.highestPaying.map((country: string) => (
                      <Badge key={country} className="bg-electric/10 text-electric border-electric/20">
                        {country}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    These regions have the highest revenue per stream. They are valuable markets
                    that provide better royalty rates for your music.
                  </p>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
