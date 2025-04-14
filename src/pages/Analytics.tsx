
import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { StatusCard } from "@/components/dashboard/status-card";
import { BarChart3, Globe, Music, Users } from "lucide-react";

const Analytics = () => {
  useEffect(() => {
    document.title = "Tuneator - Analytics";
  }, []);
  
  // Sample analytics data
  const revenueData = [
    { month: "Jan", revenue: 1200 },
    { month: "Feb", revenue: 1900 },
    { month: "Mar", revenue: 1500 },
    { month: "Apr", revenue: 2200 },
    { month: "May", revenue: 1800 },
    { month: "Jun", revenue: 2400 },
    { month: "Jul", revenue: 2100 },
    { month: "Aug", revenue: 2800 },
    { month: "Sep", revenue: 3200 },
    { month: "Oct", revenue: 2600 },
    { month: "Nov", revenue: 2900 },
    { month: "Dec", revenue: 3500 },
  ];
  
  const platformData = [
    { name: "Spotify", value: 42 },
    { name: "Apple Music", value: 28 },
    { name: "YouTube", value: 18 },
    { name: "Others", value: 12 },
  ];
  
  const platformColors = ["#1DB954", "#FC3C44", "#FF0000", "#8B5CF6"];
  
  const audienceData = [
    { country: "USA", listeners: 45000 },
    { country: "UK", listeners: 28000 },
    { country: "Germany", listeners: 18500 },
    { country: "Canada", listeners: 15000 },
    { country: "France", listeners: 12000 },
    { country: "Australia", listeners: 9800 },
    { country: "Japan", listeners: 8200 },
    { country: "Brazil", listeners: 7500 },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
              <div className="flex items-center gap-2">
                <Select defaultValue="year">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Time Period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Last 30 Days</SelectItem>
                    <SelectItem value="quarter">Last Quarter</SelectItem>
                    <SelectItem value="year">Last Year</SelectItem>
                    <SelectItem value="all">All Time</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatusCard
                title="Total Revenue"
                value="$28,547"
                description="Year to date"
                icon={BarChart3}
                trend="up"
                trendValue="+24%"
                colorScheme="mint"
              />
              <StatusCard
                title="Monthly Streams"
                value="328,592"
                description="Across platforms"
                icon={Music}
                trend="up"
                trendValue="+12%"
                colorScheme="electric"
              />
              <StatusCard
                title="Avg. Listeners"
                value="145,279"
                description="Monthly active"
                icon={Users}
                trend="up"
                trendValue="+8%"
                colorScheme="mint"
              />
              <StatusCard
                title="Countries"
                value="42"
                description="With active listeners"
                icon={Globe}
                colorScheme="electric"
              />
            </div>
            
            <Tabs defaultValue="revenue">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="revenue">Revenue</TabsTrigger>
                <TabsTrigger value="platforms">Platforms</TabsTrigger>
                <TabsTrigger value="audience">Audience</TabsTrigger>
              </TabsList>
              <TabsContent value="revenue" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue across all platforms</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart
                          data={revenueData}
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
                                    <p className="text-sm font-medium mb-1">{label}</p>
                                    <p className="text-sm text-electric">
                                      Revenue: ${payload[0].value}
                                    </p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Area
                            type="monotone"
                            dataKey="revenue"
                            stroke="#00D1FF"
                            fill="url(#colorRevenue)"
                            strokeWidth={2}
                          />
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#00D1FF" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#00D1FF" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Highest Month</div>
                        <div className="text-lg font-bold">December</div>
                        <div className="text-sm text-mint">$3,500</div>
                      </div>
                      <div className="p-4 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Average Monthly</div>
                        <div className="text-lg font-bold">$2,379</div>
                        <div className="text-sm text-electric">+18% YoY</div>
                      </div>
                      <div className="p-4 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Growth Rate</div>
                        <div className="text-lg font-bold">24.2%</div>
                        <div className="text-sm text-mint">Year-over-year</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="platforms" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="md:col-span-1">
                    <CardHeader>
                      <CardTitle>Platform Distribution</CardTitle>
                      <CardDescription>Revenue share by platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={platformData}
                              cx="50%"
                              cy="50%"
                              innerRadius={60}
                              outerRadius={90}
                              paddingAngle={2}
                              dataKey="value"
                              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                              labelLine={false}
                            >
                              {platformData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={platformColors[index]} />
                              ))}
                            </Pie>
                            <Tooltip
                              content={({ active, payload }) => {
                                if (active && payload && payload.length) {
                                  return (
                                    <div className="bg-background border border-border p-3 rounded-md shadow-md">
                                      <p className="text-sm font-medium">{payload[0].name}</p>
                                      <p className="text-sm">{`${payload[0].value}% of revenue`}</p>
                                    </div>
                                  );
                                }
                                return null;
                              }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                    </CardContent>
                  </Card>
                  <Card className="md:col-span-2">
                    <CardHeader>
                      <CardTitle>Platform Performance</CardTitle>
                      <CardDescription>Monthly metrics by platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-[#1DB954]"></div>
                              <h3 className="text-sm font-medium">Spotify</h3>
                            </div>
                            <span className="text-sm font-medium">256,782 streams</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Revenue</span>
                              <span>$1,053</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Avg. per stream</span>
                              <span>$0.0041</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Growth</span>
                              <span className="text-mint">+15.2%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-[#FC3C44]"></div>
                              <h3 className="text-sm font-medium">Apple Music</h3>
                            </div>
                            <span className="text-sm font-medium">124,567 streams</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Revenue</span>
                              <span>$748</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Avg. per stream</span>
                              <span>$0.0060</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Growth</span>
                              <span className="text-mint">+12.8%</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="p-3 rounded-md bg-secondary/50 hover:bg-secondary transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <div className="h-3 w-3 rounded-full bg-[#FF0000]"></div>
                              <h3 className="text-sm font-medium">YouTube</h3>
                            </div>
                            <span className="text-sm font-medium">98,324 views</span>
                          </div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Revenue</span>
                              <span>$482</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Avg. per view</span>
                              <span>$0.0049</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-muted-foreground">Growth</span>
                              <span className="text-mint">+22.5%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
              <TabsContent value="audience" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Audience Demographics</CardTitle>
                    <CardDescription>Listener distribution by country</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                          data={audienceData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 5,
                          }}
                          layout="vertical"
                        >
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted/30" />
                          <XAxis type="number" className="text-xs fill-muted-foreground" />
                          <YAxis 
                            dataKey="country" 
                            type="category" 
                            className="text-xs fill-muted-foreground" 
                            width={80}
                          />
                          <Tooltip
                            content={({ active, payload, label }) => {
                              if (active && payload && payload.length) {
                                return (
                                  <div className="bg-background border border-border p-3 rounded-md shadow-md">
                                    <p className="text-sm font-medium">{label}</p>
                                    <p className="text-sm">{`${payload[0].value.toLocaleString()} listeners`}</p>
                                  </div>
                                );
                              }
                              return null;
                            }}
                          />
                          <Bar dataKey="listeners" fill="#00F5C3" radius={[0, 4, 4, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="p-4 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Total Listeners</div>
                        <div className="text-lg font-bold">145,279</div>
                        <div className="text-sm text-mint">Monthly active</div>
                      </div>
                      <div className="p-4 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Top Market</div>
                        <div className="text-lg font-bold">USA</div>
                        <div className="text-sm text-electric">31% of listeners</div>
                      </div>
                      <div className="p-4 rounded-md bg-secondary/50">
                        <div className="text-xs text-muted-foreground mb-1">Growth Markets</div>
                        <div className="text-lg font-bold">Brazil, Japan</div>
                        <div className="text-sm text-mint">+35% growth</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Analytics;
