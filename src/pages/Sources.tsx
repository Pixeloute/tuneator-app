import React, { useState, useMemo } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Music, Apple, Youtube, Disc, Radio, Building, Zap, Crown, Globe, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ConnectionModal } from "@/components/integrations/ConnectionModal";
import { DisconnectModal } from "@/components/integrations/DisconnectModal";
import { connectionManager } from "@/services/connectionManager";

interface Integration {
  name: string;
  icon: React.ReactNode;
  category: string;
  color: string;
  connected: boolean;
  description: string;
  isNew?: boolean;
}

const integrations: Integration[] = [
  { name: 'Spotify', icon: <Music className="w-6 h-6" />, category: 'streaming', color: '#1DB954', connected: true, description: 'Music streaming platform' },
  { name: 'Apple Music', icon: <Apple className="w-6 h-6" />, category: 'streaming', color: '#FA233B', connected: false, description: 'Apple music service' },
  { name: 'DISTROKID', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#1976D2', connected: true, description: 'Music distribution service' },
  { name: 'TUNECORE', icon: <Music className="w-6 h-6" />, category: 'distribution', color: '#FF6B00', connected: false, description: 'Digital music distribution' },
  { name: 'BMI', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#003366', connected: true, description: 'Performing rights organization' },
  { name: 'ASCAP', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#CC0000', connected: false, description: 'American performing rights org' },
  { name: 'AMPSUITE', icon: <Radio className="w-6 h-6" />, category: 'distribution', color: '#8B5CF6', connected: false, description: 'Music distribution platform' },
  { name: 'ANTI JOY', icon: <Disc className="w-6 h-6" />, category: 'labels', color: '#EF4444', connected: false, description: 'Independent record label', isNew: true },
  { name: 'AWAL', icon: <Globe className="w-6 h-6" />, category: 'distribution', color: '#06B6D4', connected: false, description: 'Artist services company' },
  { name: 'AUDIOMACK', icon: <Music className="w-6 h-6" />, category: 'streaming', color: '#FF8C00', connected: false, description: 'Music streaming & discovery' },
  { name: 'BANDCAMP', icon: <Music className="w-6 h-6" />, category: 'streaming', color: '#629AA0', connected: false, description: 'Music community platform' },
  { name: 'BELIEVE', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#FFD700', connected: false, description: 'Digital music company' },
  { name: 'BMG', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#1F2937', connected: false, description: 'Music publishing company' },
  { name: 'SOUND EXCHANGE', icon: <Radio className="w-6 h-6" />, category: 'pro', color: '#7C3AED', connected: false, description: 'Digital performance rights' },
  { name: 'SONGTRADR', icon: <Music className="w-6 h-6" />, category: 'publishing', color: '#F59E0B', connected: false, description: 'Music licensing platform' },
  { name: 'CD BABY', icon: <Disc className="w-6 h-6" />, category: 'distribution', color: '#10B981', connected: false, description: 'Independent music distribution' },
  { name: 'CONCORD PUBLISHING', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#6366F1', connected: false, description: 'Music publishing company' },
  { name: 'CURVE', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#EC4899', connected: false, description: 'Music distribution service', isNew: true },
  { name: 'DISTRICT', icon: <Building className="w-6 h-6" />, category: 'distribution', color: '#374151', connected: false, description: 'Music distribution platform' },
  { name: 'EMPIRE', icon: <Crown className="w-6 h-6" />, category: 'labels', color: '#DC2626', connected: false, description: 'Independent record label' },
  { name: 'IDENTITY MUSIC', icon: <Music className="w-6 h-6" />, category: 'distribution', color: '#059669', connected: false, description: 'Music distribution service' },
  { name: 'KMG', icon: <Building className="w-6 h-6" />, category: 'labels', color: '#7F1D1D', connected: false, description: 'Record label group' },
  { name: 'KOBALT', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#1E40AF', connected: false, description: 'Music technology company' },
  { name: 'KODA', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#DC143C', connected: false, description: 'Danish collecting society' },
  { name: 'LABEL ENGINE', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#16A34A', connected: false, description: 'Label distribution service' },
  { name: 'MLC', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#0F172A', connected: false, description: 'Mechanical licensing collective' },
  { name: 'MUSIC REPORTS (MRI)', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#581C87', connected: false, description: 'Music reporting service' },
  { name: 'PEER MUSIC', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#BE185D', connected: false, description: 'Independent music publisher' },
  { name: 'PRS', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#1565C0', connected: false, description: 'UK performing rights society' },
  { name: 'PROTON', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#8B5CF6', connected: false, description: 'Music distribution platform', isNew: true },
  { name: 'ROUTE NOTE', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#F97316', connected: false, description: 'Music distribution service' },
  { name: 'SACEM', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#1E3A8A', connected: false, description: 'French collecting society' },
  { name: 'SAG-AFTRA', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#991B1B', connected: false, description: 'Performers union' },
  { name: 'SONGTRUST', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#0891B2', connected: false, description: 'Publishing administration' },
  { name: 'SENTRIC', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#DC2626', connected: false, description: 'Music publishing service' },
  { name: 'SESAC', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#059669', connected: false, description: 'Performing rights organization' },
  { name: 'SOCAN', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#DC2626', connected: false, description: 'Canadian performing rights' },
  { name: 'SONY RECORDS', icon: <Disc className="w-6 h-6" />, category: 'labels', color: '#000000', connected: false, description: 'Major record label' },
  { name: 'SONY MUSIC PUBLISHING', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#1F2937', connected: false, description: 'Music publishing company' },
  { name: 'SOUNDON', icon: <Radio className="w-6 h-6" />, category: 'distribution', color: '#FF0050', connected: false, description: 'TikTok music distribution', isNew: true },
  { name: 'STEM', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#22C55E', connected: false, description: 'Music distribution platform' },
  { name: 'STIM', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#0EA5E9', connected: false, description: 'Swedish collecting society' },
  { name: 'SPARTA', icon: <Building className="w-6 h-6" />, category: 'pro', color: '#B91C1C', connected: false, description: 'Digital rights management' },
  { name: 'SYMPHONIC', icon: <Music className="w-6 h-6" />, category: 'distribution', color: '#7C2D12', connected: false, description: 'Music distribution service' },
  { name: 'THE ORCHARD', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#16A34A', connected: false, description: 'Music distribution company' },
  { name: 'TOO LOST', icon: <Disc className="w-6 h-6" />, category: 'labels', color: '#6B21A8', connected: false, description: 'Independent record label', isNew: true },
  { name: 'LIME BLUE', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#84CC16', connected: false, description: 'Music distribution service' },
  { name: 'UNITED MASTERS', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#1F2937', connected: false, description: 'Music distribution platform' },
  { name: 'VYDIA', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#8B5CF6', connected: false, description: 'Digital music company' },
  { name: 'UMPG', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#0F172A', connected: false, description: 'Universal Music Publishing' },
  { name: 'UNIVERSAL MUSIC', icon: <Globe className="w-6 h-6" />, category: 'labels', color: '#1E40AF', connected: false, description: 'Major record label' },
  { name: 'UNIVERSAL MUSIC GLOBAL', icon: <Globe className="w-6 h-6" />, category: 'labels', color: '#1565C0', connected: false, description: 'Global music company' },
  { name: 'ONERPM', icon: <Zap className="w-6 h-6" />, category: 'distribution', color: '#DC2626', connected: false, description: 'Music distribution platform' },
  { name: 'WARNER CHAPPELL', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#1F2937', connected: false, description: 'Music publishing company' },
  { name: 'WARNER MUSIC GROUP', icon: <Crown className="w-6 h-6" />, category: 'labels', color: '#374151', connected: false, description: 'Major record label' },
  { name: 'SONY MUSIC', icon: <Crown className="w-6 h-6" />, category: 'labels', color: '#000000', connected: false, description: 'Sony Music record label' },
  { name: 'UNIVERSAL MUSIC', icon: <Globe className="w-6 h-6" />, category: 'labels', color: '#1E40AF', connected: false, description: 'Universal Music Group' },
  { name: 'KOBALT', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#1E40AF', connected: false, description: 'Music technology company' },
  { name: 'SONGTRUST', icon: <Building className="w-6 h-6" />, category: 'publishing', color: '#E91E63', connected: false, description: 'Global music publishing administration' }
];

const Sources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [integrationsState, setIntegrationsState] = useState(integrations);
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disconnectIntegration, setDisconnectIntegration] = useState<Integration | null>(null);
  const [isDisconnectModalOpen, setIsDisconnectModalOpen] = useState(false);
  const { toast } = useToast();

  const filteredIntegrations = useMemo(() => {
    let filtered = integrationsState;

    // Apply category filter
    if (activeFilter !== "all") {
      if (activeFilter === "connected") {
        filtered = filtered.filter(integration => integration.connected);
      } else {
        filtered = filtered.filter(integration => integration.category === activeFilter);
      }
    }

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(integration =>
        integration.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        integration.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [integrationsState, activeFilter, searchQuery]);

  const stats = useMemo(() => {
    const connected = integrationsState.filter(int => int.connected).length;
    const total = integrationsState.length;
    const revenue = connected * 4200 + Math.random() * 1000;
    
    return {
      connected,
      total,
      revenue: `$${(revenue/1000).toFixed(1)}K`
    };
  }, [integrationsState]);

  const handleConnectClick = (integration: Integration) => {
    if (integration.connected) {
      // Open disconnect confirmation modal
      setDisconnectIntegration(integration);
      setIsDisconnectModalOpen(true);
    } else {
      // Open connection modal
      setSelectedIntegration(integration);
      setIsModalOpen(true);
    }
  };

  const handleConnect = async (platformName: string, credentials: any): Promise<boolean> => {
    try {
      const success = await connectionManager.connectPlatform(platformName, credentials);
      if (success) {
        setIntegrationsState(prev => 
          prev.map(integration => 
            integration.name === platformName 
              ? { ...integration, connected: true }
              : integration
          )
        );
        return true;
      }
      return false;
    } catch (error) {
      throw error;
    }
  };

  const handleDisconnect = async (name: string) => {
    try {
      const success = await connectionManager.disconnectPlatform(name);
      if (success) {
        setIntegrationsState(prev => 
          prev.map(integration => 
            integration.name === name 
              ? { ...integration, connected: false }
              : integration
          )
        );
        
        toast({
          title: "Integration Disconnected",
          description: `${name} has been disconnected successfully.`,
        });
      }
    } catch (error) {
      toast({
        title: "Disconnection Failed",
        description: `Failed to disconnect ${name}. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedIntegration(null);
  };

  const handleDisconnectModalClose = () => {
    setIsDisconnectModalOpen(false);
    setDisconnectIntegration(null);
  };

  const handleConfirmDisconnect = () => {
    if (disconnectIntegration) {
      handleDisconnect(disconnectIntegration.name);
      handleDisconnectModalClose();
    }
  };

  const filterTabs = [
    { id: "all", label: "All Sources" },
    { id: "streaming", label: "Streaming" },
    { id: "distribution", label: "Distribution" },
    { id: "publishing", label: "Publishing" },
    { id: "pro", label: "PROs" },
    { id: "labels", label: "Labels" },
    { id: "connected", label: "Connected" },
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <div className="flex-1 grow">
          <TopBar />
          <main className="p-4 md:p-6 space-y-6 pb-16">
            {/* Header */}
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-bold">Integrations</h1>
            </div>

            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="relative flex justify-center items-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary/80 rounded-2xl flex items-center justify-center text-3xl shadow-lg">
                  🎵
                </div>
                <div className="absolute -top-10 -left-10 w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl border-2 border-primary">
                  🎧
                </div>
                <div className="absolute -top-10 -right-10 w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl border-2 border-primary">
                  🎵
                </div>
                <div className="absolute -bottom-10 -left-10 w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl border-2 border-primary">
                  📻
                </div>
                <div className="absolute -bottom-10 -right-10 w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-xl border-2 border-primary">
                  💿
                </div>
              </div>
              
              <div>
                <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent">
                  Connect Everything!
                </h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Sync your sources so Tuneator can help you visualize your business and find you more money.
                </p>
              </div>
            </div>

            {/* Stats Bar */}
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.connected}</div>
                    <div className="text-sm text-muted-foreground">Connected</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.total}</div>
                    <div className="text-sm text-muted-foreground">Available</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-primary">{stats.revenue}</div>
                    <div className="text-sm text-muted-foreground">Tracked This Month</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search integrations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2 justify-center">
              {filterTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeFilter === tab.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setActiveFilter(tab.id)}
                  className="rounded-full"
                >
                  {tab.label}
                </Button>
              ))}
            </div>

            {/* Integrations Grid */}
            <div>
              <h3 className="text-xl font-semibold mb-4 text-primary">Popular Integrations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredIntegrations.map((integration) => (
                  <Card 
                    key={integration.name} 
                    className={`relative transition-all duration-200 hover:scale-105 hover:shadow-lg cursor-pointer ${
                      integration.connected ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    {integration.isNew && (
                      <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground">
                        NEW
                      </Badge>
                    )}
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3 mb-3">
                        <div 
                          className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: integration.color }}
                        >
                          {integration.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold truncate">{integration.name}</h4>
                          <p className="text-xs text-muted-foreground truncate">{integration.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <Button 
                        className="w-full"
                        variant={integration.connected ? "default" : "outline"}
                        onClick={() => handleConnectClick(integration)}
                      >
                        {integration.connected ? (
                          <>
                            <Settings className="h-4 w-4 mr-2" />
                            Connected ✓
                          </>
                        ) : (
                          'Connect'
                        )}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </div>

      {/* Connection Modal */}
      <ConnectionModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        integration={selectedIntegration}
        onConnect={handleConnect}
      />

      {/* Disconnect Confirmation Modal */}
      {disconnectIntegration && (
        <DisconnectModal
          isOpen={isDisconnectModalOpen}
          onClose={handleDisconnectModalClose}
          onConfirm={handleConfirmDisconnect}
          platformName={disconnectIntegration.name}
          platformIcon={disconnectIntegration.icon}
          platformColor={disconnectIntegration.color}
        />
      )}
    </SidebarProvider>
  );
};

export default Sources; 