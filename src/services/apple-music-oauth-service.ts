import { supabase } from "@/integrations/supabase/client";

interface AppleMusicConfig {
  setupRequired: boolean;
  teamId: string;
  keyId: string;
  bundleId: string;
  instructions: string;
}

interface AppleMusicConnection {
  id: string;
  platform_name: string;
  account_info: {
    subscription_status: string;
    storefront: string;
    profile_url: string;
    platform_type: string;
  };
  connection_status: string;
}

interface AppleMusicResponse {
  success: boolean;
  connection?: AppleMusicConnection;
  error?: string;
}

// Declare Music Kit JS types
declare global {
  interface Window {
    MusicKit: {
      configure: (config: any) => void;
      getInstance: () => any;
      formatArtworkURL: (artwork: any, height: number, width: number) => string;
    };
  }
}

export class AppleMusicOAuthService {
  private static instance: AppleMusicOAuthService;
  private musicKit: any = null;
  private isConfigured = false;

  static getInstance(): AppleMusicOAuthService {
    if (!AppleMusicOAuthService.instance) {
      AppleMusicOAuthService.instance = new AppleMusicOAuthService();
    }
    return AppleMusicOAuthService.instance;
  }

  /**
   * Load Music Kit JS script
   */
  private async loadMusicKitJS(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.MusicKit) {
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://js-cdn.music.apple.com/musickit/v1/musickit.js';
      script.async = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Failed to load Music Kit JS'));
      document.head.appendChild(script);
    });
  }

  /**
   * Configure Music Kit JS
   */
  private async configureMusicKit(): Promise<AppleMusicConfig> {
    try {
      const { data, error } = await supabase.functions.invoke('apple-music-oauth', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to get Apple Music configuration');
      }

      return data;
    } catch (error) {
      console.error('Apple Music config error:', error);
      throw error;
    }
  }

  /**
   * Initialize Music Kit JS
   */
  private async initializeMusicKit(config: AppleMusicConfig): Promise<void> {
    if (this.isConfigured) return;

    await this.loadMusicKitJS();

    // Configure Music Kit
    window.MusicKit.configure({
      developerToken: await this.generateDeveloperToken(config),
      app: {
        name: 'Tuneator',
        build: '1.0.0'
      }
    });

    this.musicKit = window.MusicKit.getInstance();
    this.isConfigured = true;
  }

  /**
   * Generate developer token (in production, this should be done server-side)
   */
  private async generateDeveloperToken(config: AppleMusicConfig): Promise<string> {
    // For development, we'll use a mock token
    // In production, this should be generated server-side using your Apple private key
    return 'mock-developer-token-' + Date.now();
  }

  /**
   * Connect to Apple Music
   */
  async connect(): Promise<boolean> {
    try {
      // Get configuration from backend
      const config = await this.configureMusicKit();
      
      // Initialize Music Kit
      await this.initializeMusicKit(config);

      // Check if user is already authorized
      if (this.musicKit.isAuthorized) {
        return await this.saveConnection();
      }

      // Request authorization
      const authResult = await this.musicKit.authorize();
      
      if (authResult === 'authorized') {
        return await this.saveConnection();
      } else {
        throw new Error('Apple Music authorization failed');
      }
    } catch (error) {
      console.error('Apple Music connect error:', error);
      
      // For development, we'll simulate a successful connection
      // Remove this in production
      if (error.message?.includes('mock-developer-token')) {
        return await this.mockConnection();
      }
      
      throw error;
    }
  }

  /**
   * Save connection to backend
   */
  private async saveConnection(): Promise<boolean> {
    try {
      const musicUserToken = this.musicKit.musicUserToken;
      
      // Get user profile information
      const userProfile = {
        id: 'apple_music_user_' + Date.now(),
        subscription_status: 'active',
        storefront: this.musicKit.storefrontId || 'us'
      };

      const { data, error } = await supabase.functions.invoke('apple-music-oauth', {
        body: {
          action: 'connect',
          musicUserToken,
          userProfile
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to save Apple Music connection');
      }

      return data?.success || false;
    } catch (error) {
      console.error('Apple Music save connection error:', error);
      throw error;
    }
  }

  /**
   * Mock connection for development
   */
  private async mockConnection(): Promise<boolean> {
    try {
      const mockUserProfile = {
        id: 'mock_apple_music_user',
        subscription_status: 'active',
        storefront: 'us'
      };

      const { data, error } = await supabase.functions.invoke('apple-music-oauth', {
        body: {
          action: 'connect',
          musicUserToken: 'mock-music-user-token-' + Date.now(),
          userProfile: mockUserProfile
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to save Apple Music connection');
      }

      return data?.success || false;
    } catch (error) {
      console.error('Mock Apple Music connection error:', error);
      throw error;
    }
  }

  /**
   * Get user's Apple Music connections
   */
  async getConnections(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('platform_name', 'Apple Music')
        .eq('connection_status', 'connected');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get Apple Music connections error:', error);
      throw error;
    }
  }

  /**
   * Disconnect Apple Music account
   */
  async disconnect(connectionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('apple-music-oauth', {
        body: {
          action: 'disconnect',
          connectionId
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to disconnect Apple Music');
      }

      // Also disconnect from Music Kit if available
      if (this.musicKit && this.musicKit.unauthorize) {
        await this.musicKit.unauthorize();
      }

      return data?.success || false;
    } catch (error) {
      console.error('Apple Music disconnect error:', error);
      throw error;
    }
  }

  /**
   * Sync Apple Music data
   */
  async syncData(connectionId: string): Promise<any> {
    try {
      let musicUserToken = null;
      
      if (this.musicKit && this.musicKit.musicUserToken) {
        musicUserToken = this.musicKit.musicUserToken;
      }

      const { data, error } = await supabase.functions.invoke('apple-music-oauth', {
        body: {
          action: 'sync-data',
          connectionId,
          musicUserToken
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to sync Apple Music data');
      }

      return data?.syncData || {};
    } catch (error) {
      console.error('Apple Music sync data error:', error);
      throw error;
    }
  }

  /**
   * Check if Music Kit is available and authorized
   */
  isAuthorized(): boolean {
    return this.musicKit && this.musicKit.isAuthorized;
  }
}

export const appleMusicOAuthService = AppleMusicOAuthService.getInstance(); 