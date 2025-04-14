
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, LineChart, Line } from "recharts";
import { fetchStreamingRoyaltyData } from "@/services/google-api";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Music, TrendingUp, DollarSign, Users } from "lucide-react";

export function RoyaltyDashboard() {
  const [timeRange, setTimeRange] = useState<string>("6months");
  const [platformData, setPlatformData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>("overview");
  
  useEffect(() => {
    const loadRoyaltyData = async () => {
      setIsLoading(true);
      try {
        const data = await fetchStreamingRoyaltyData('all', timeRange);
        setPlatformData(data);
      } catch (error) {
        console.error("Failed to load royalty data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRoyaltyData();
  }, [timeRange]);
  
  // Format data for combined chart
  const getCombinedChartData = () => {
    if (!platformData) return [];
    
    const { spotify, apple, youtube, others } = platformData;
    const combinedData: any[] = [];
    
    spotify.forEach((item: any, index: number) => {
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
  
  // Format data for streams chart
  const getStreamsChartData = () => {
    if (!platformData) return [];
    
    const { spotify, apple, youtube } = platformData;
    const streamsData: any[] = [];
    
    spotify.forEach((item: any, index: number) => {
      streamsData.push({
        month: item.month,
        spotify: item.streams,
        apple: apple[index]?.streams || 0,
        youtube: youtube[index]?.streams || 0
      });
    });
    
    return streamsData;
  };
  
  // Calculate total revenue
  const getTotalRevenue = () => {
    if (!platformData) return 0;
    
    const platforms = ['spotify', 'apple', 'youtube', 'others'];
    let total = 0;
    
    platforms.forEach(platform => {
      if (platformData[platform]) {
        platformData[platform].forEach((item: any) => {
          total += item.revenue;
        });
      }
    });
    
    return total.toFixed(2);
  };
  
  // Calculate total streams
  const getTotalStreams = () => {
    if (!platformData) return 0;
    
    const platforms = ['spotify', 'apple', 'youtube', 'others'];
    let total = 0;
    
    platforms.forEach(platform => {
      if (platformData[platform]) {
        platformData[platform].forEach((item: any) => {
          total += item.streams;
        });
      }
    });
    
    return total.toLocaleString();
  };
  
  // Calculate revenue growth
  const getRevenueGrowth = () => {
    if (!platformData || !platformData.spotify || platformData.spotify.length < 2) return 0;
    
    const platforms = ['spotify', 'apple', 'youtube', 'others'];
    let firstMonth = 0;
    let lastMonth = 0;
    
    platforms.forEach(platform => {
      if (platformData[platform]) {
        const data = platformData[platform];
        if (data.length > 0) {
          firstMonth += data[0].revenue;
          lastMonth += data[data.length - 1].revenue;
        }
      }
    });
    
    if (firstMonth === 0) return 0;
    const growth = ((lastMonth - firstMonth) / firstMonth) * 100;
    return growth.toFixed(1);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle>Royalty Dashboard</CardTitle>
            <CardDescription>Track your earnings across streaming platforms</CardDescription>
          </div>
          
          <div className="flex items-center gap-2">
            <Label htmlFor="time-range">Time Range:</Label>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger id="time-range" className="w-[160px]">
                <SelectValue placeholder="Select time range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1month">Last Month</SelectItem>
                <SelectItem value="3months">Last 3 Months</SelectItem>
                <SelectItem value="6months">Last 6 Months</SelectItem>
                <SelectItem value="1year">Last Year</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {isLoading ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-[350px] w-full" />
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">${getTotalRevenue()}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-electric/10 flex items-center justify-center">
                      <DollarSign className="h-6 w-6 text-electric" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Badge variant="outline" className={`flex items-center gap-1 ${Number(getRevenueGrowth()) >= 0 ? 'bg-mint/10 text-mint' : 'bg-destructive/10 text-destructive'}`}>
                      <TrendingUp className="h-3 w-3" />
                      {getRevenueGrowth()}%
                    </Badge>
                    <span className="text-muted-foreground ml-2">vs previous period</span>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Streams</p>
                      <h3 className="text-2xl font-bold mt-1">{getTotalStreams()}</h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-mint/10 flex items-center justify-center">
                      <Music className="h-6 w-6 text-mint" />
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Badge variant="outline" className="bg-mint/10 text-mint">
                      Across all platforms
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Spotify Revenue</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ${platformData.spotify.reduce((sum: number, item: any) => sum + item.revenue, 0).toFixed(2)}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-[#1DB954]/10 flex items-center justify-center">
                      <svg className="h-6 w-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Badge variant="outline" className="bg-[#1DB954]/10 text-[#1DB954]">
                      {platformData.spotify.length > 0 ? platformData.spotify[platformData.spotify.length - 1].streams.toLocaleString() : 0} streams
                    </Badge>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Apple Music</p>
                      <h3 className="text-2xl font-bold mt-1">
                        ${platformData.apple.reduce((sum: number, item: any) => sum + item.revenue, 0).toFixed(2)}
                      </h3>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-[#FC3C44]/10 flex items-center justify-center">
                      <svg className="h-6 w-6 text-[#FC3C44]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.97 6.688a9.744 9.744 0 0 0-.033-.776c-.023-.311-.05-.622-.108-.932a4.46 4.46 0 0 0-.265-.91c-.13-.295-.291-.573-.487-.826a4.088 4.088 0 0 0-.706-.699c-.271-.205-.56-.37-.868-.496a4.43 4.43 0 0 0-.98-.259c-.321-.054-.643-.082-.966-.101-.143-.01-.279-.021-.421-.021L12 .03 3.862.636c-.143 0-.279.011-.421.021-.323.02-.645.047-.966.101-.329.054-.655.142-.98.259-.308.126-.597.291-.868.496a4.068 4.068 0 0 0-.707.699c-.195.253-.357.531-.486.826-.119.295-.212.599-.266.91-.058.31-.085.621-.107.932-.01.142-.023.284-.023.426v.35L0 6.688v10.628l.038 1.162c.023.312.05.623.108.932.053.311.146.615.265.911.13.294.292.573.487.826.198.259.44.486.706.698.272.206.56.37.868.496.325.118.651.206.98.26.321.053.643.08.966.1.143.011.278.022.421.022l8.138.606 8.138-.606c.143 0 .278-.01.42-.022.323-.02.645-.047.967-.1.328-.054.655-.142.98-.26.308-.126.596-.29.867-.496.266-.212.509-.44.706-.698.196-.253.358-.532.487-.826.12-.296.212-.6.266-.911.058-.31.085-.62.108-.932.01-.142.022-.284.022-.427l.038-.735V6.688h-.038zm-6.568 7.826c-.012 1.284-.925 2.391-2.19 2.636-1.454.27-2.787-.636-3.282-1.778-.07-.156-.165-.305-.234-.467-.118-.26-.224-.531-.364-.78-.14-.26-.34-.486-.566-.686-.566-.509-1.454-.602-2.144-.26-.706.35-1.186 1.063-1.231 1.854-.058 1.297.937 2.392 2.202 2.637 1.454.27 2.787-.637 3.282-1.779.07-.156.165-.305.234-.467.118-.259.224-.531.364-.78.14-.259.34-.485.566-.685.566-.51 1.454-.602 2.144-.26.706.35 1.186 1.063 1.231 1.854 0 .012-.012.036-.012.061-.024 1.506-1.267 2.739-2.798 2.842-1.557.102-2.891-.954-3.19-2.35-.119.022-.249.033-.38.033-1.256 0-2.274-1.026-2.274-2.287 0-1.26 1.018-2.286 2.274-2.286.132 0 .261.01.38.033.299-1.396 1.634-2.453 3.19-2.35 1.53.103 2.775 1.336 2.798 2.842 0 .024.012.047.012.07z"/>
                      </svg>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center text-xs">
                    <Badge variant="outline" className="bg-[#FC3C44]/10 text-[#FC3C44]">
                      {platformData.apple.length > 0 ? platformData.apple[platformData.apple.length - 1].streams.toLocaleString() : 0} streams
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="overview">Revenue Overview</TabsTrigger>
                <TabsTrigger value="streams">Streams Analysis</TabsTrigger>
                <TabsTrigger value="projection">Revenue Projection</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-4">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {['spotify', 'apple', 'youtube', 'others'].map((platform) => {
                    const platformData = {
                      spotify: { name: 'Spotify', color: '#1DB954' },
                      apple: { name: 'Apple Music', color: '#FC3C44' },
                      youtube: { name: 'YouTube', color: '#FF0000' },
                      others: { name: 'Other Platforms', color: '#8B5CF6' }
                    };
                    
                    return (
                      <Card key={platform}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: platformData[platform as keyof typeof platformData].color }} />
                            {platformData[platform as keyof typeof platformData].name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold">
                            ${getCombinedChartData().reduce((sum, item) => sum + (item[platform] || 0), 0).toFixed(2)}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Total revenue</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="streams" className="space-y-4">
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
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['spotify', 'apple', 'youtube'].map((platform) => {
                    const platformData = {
                      spotify: { name: 'Spotify', color: '#1DB954' },
                      apple: { name: 'Apple Music', color: '#FC3C44' },
                      youtube: { name: 'YouTube', color: '#FF0000' },
                    };
                    
                    const totalStreams = getStreamsChartData().reduce((sum, item) => sum + (item[platform] || 0), 0);
                    
                    return (
                      <Card key={platform}>
                        <CardHeader className="p-4">
                          <CardTitle className="text-sm flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: platformData[platform as keyof typeof platformData].color }} />
                            {platformData[platform as keyof typeof platformData].name}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="p-4 pt-0">
                          <div className="text-2xl font-bold">
                            {totalStreams.toLocaleString()}
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">Total streams</p>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="projection" className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-medium mb-4">Revenue Projection (Next 6 Months)</h3>
                    <div className="h-[350px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                          data={[
                            ...getCombinedChartData().map(item => ({
                              ...item,
                              total: item.spotify + item.apple + item.youtube + item.others
                            })),
                            // Add projected months
                            { month: 'Jan', total: 1250, projected: true },
                            { month: 'Feb', total: 1320, projected: true },
                            { month: 'Mar', total: 1410, projected: true },
                            { month: 'Apr', total: 1510, projected: true },
                            { month: 'May', total: 1630, projected: true },
                            { month: 'Jun', total: 1750, projected: true }
                          ]}
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
              </TabsContent>
            </Tabs>
          </>
        )}
      </CardContent>
    </Card>
  );
}
