
import { RevenueKpiCard } from "./cards/revenue-kpi-card";
import { StreamsKpiCard } from "./cards/streams-kpi-card";
import { PlatformKpiCard } from "./cards/platform-kpi-card";
import { PlatformRoyaltyData } from "@/services/revenue-service";

interface KpiCardsProps {
  platformData: PlatformRoyaltyData;
}

export function KpiCards({ platformData }: KpiCardsProps) {
  const getTotalRevenue = () => {
    const platforms = ['spotify', 'apple', 'youtube', 'others'] as const;
    let total = 0;
    
    platforms.forEach(platform => {
      if (platformData[platform]) {
        platformData[platform].forEach((item) => {
          total += item.revenue;
        });
      }
    });
    
    return total.toFixed(2);
  };
  
  const getTotalStreams = () => {
    const platforms = ['spotify', 'apple', 'youtube', 'others'] as const;
    let total = 0;
    
    platforms.forEach(platform => {
      if (platformData[platform]) {
        platformData[platform].forEach((item) => {
          total += item.streams;
        });
      }
    });
    
    return total.toLocaleString();
  };
  
  const getRevenueGrowth = () => {
    if (!platformData || !platformData.spotify || platformData.spotify.length < 2) return "0";
    
    const platforms = ['spotify', 'apple', 'youtube', 'others'] as const;
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
    
    if (firstMonth === 0) return "0";
    const growth = ((lastMonth - firstMonth) / firstMonth) * 100;
    return growth.toFixed(1);
  };

  const platformConfigs = {
    spotify: {
      name: 'Spotify',
      color: '#1DB954',
      icon: () => (
        <svg className="h-6 w-6 text-[#1DB954]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      ),
    },
    apple: {
      name: 'Apple Music',
      color: '#FC3C44',
      icon: () => (
        <svg className="h-6 w-6 text-[#FC3C44]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.97 6.688a9.744 9.744 0 0 0-.033-.776c-.023-.311-.05-.622-.108-.932a4.46 4.46 0 0 0-.265-.91c-.13-.295-.291-.573-.487-.826a4.088 4.088 0 0 0-.706-.699c-.271-.205-.56-.37-.868-.496a4.43 4.43 0 0 0-.98-.259c-.321-.054-.643-.082-.966-.101-.143-.01-.279-.021-.421-.021L12 .03 3.862.636c-.143 0-.279.011-.421.021-.323.02-.645.047-.966.101-.329.054-.655.142-.98.259-.308.126-.597.291-.868.496a4.068 4.068 0 0 0-.707.699c-.195.253-.357.531-.486.826-.119.295-.212.599-.266.91-.058.31-.085.621-.107.932-.01.142-.023.284-.023.426v.35L0 6.688v10.628l.038 1.162c.023.312.05.623.108.932.053.311.146.615.265.911.13.294.292.573.487.826.198.259.44.486.706.698.272.206.56.37.868.496.325.118.651.206.98.26.321.053.643.08.966.1.143.011.278.022.421.022l8.138.606 8.138-.606c.143 0 .278-.01.42-.022.323-.02.645-.047.967-.1.328-.054.655-.142.98-.26.308-.126.596-.29.867-.496.266-.212.509-.44.706-.698.196-.253.358-.532.487-.826.12-.296.212-.6.266-.911.058-.31.085-.62.108-.932.01-.142.022-.284.022-.427l.038-.735V6.688h-.038zm-6.568 7.826c-.012 1.284-.925 2.391-2.19 2.636-1.454.27-2.787-.636-3.282-1.778-.07-.156-.165-.305-.234-.467-.118-.26-.224-.531-.364-.78-.14-.26-.34-.486-.566-.686-.566-.509-1.454-.602-2.144-.26-.706.35-1.186 1.063-1.231 1.854-.058 1.297.937 2.392 2.202 2.637 1.454.27 2.787-.637 3.282-1.779.07-.156.165-.305.234-.467.118-.259.224-.531.364-.78.14-.259.34-.485.566-.685.566-.51 1.454-.602 2.144-.26.706.35 1.186 1.063 1.231 1.854 0 .012-.012.036-.012.061z"/>
        </svg>
      ),
    },
    youtube: {
      name: 'YouTube',
      color: '#FF0000',
      icon: () => (
        <svg className="h-6 w-6 text-[#FF0000]" viewBox="0 0 24 24" fill="currentColor">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
    },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <RevenueKpiCard 
        totalRevenue={getTotalRevenue()} 
        revenueGrowth={getRevenueGrowth()} 
      />
      
      <StreamsKpiCard totalStreams={getTotalStreams()} />
      
      {(['spotify', 'apple', 'youtube'] as const).map((platform) => {
        const config = platformConfigs[platform];
        const data = platformData[platform] || [];
        const totalRevenue = data.reduce((sum, item) => sum + item.revenue, 0).toFixed(2);
        const latestStreams = data.length > 0 ? data[data.length - 1].streams.toLocaleString() : "0";
        
        return (
          <PlatformKpiCard
            key={platform}
            config={config}
            revenue={totalRevenue}
            streams={latestStreams}
          />
        );
      })}
    </div>
  );
}
