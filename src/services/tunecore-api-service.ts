import { supabase } from "@/integrations/supabase/client";

interface TuneCoreCredentials {
  apiKey: string;
}

interface TuneCoreConnection {
  id: string;
  platform_name: string;
  account_info: {
    artist_name: string;
    releases_count: number;
    total_revenue: number;
    account_status: string;
  };
  connection_status: string;
}

interface TuneCoreResponse {
  success: boolean;
  connection?: TuneCoreConnection;
  error?: string;
}

export class TuneCoreAPIService {
  private static instance: TuneCoreAPIService;

  static getInstance(): TuneCoreAPIService {
    if (!TuneCoreAPIService.instance) {
      TuneCoreAPIService.instance = new TuneCoreAPIService();
    }
    return TuneCoreAPIService.instance;
  }

  /**
   * Connect using TuneCore API key
   */
  async connect(credentials: TuneCoreCredentials): Promise<boolean> {
    try {
      const { apiKey } = credentials;

      if (!apiKey || apiKey.length < 10) {
        throw new Error('Please provide a valid TuneCore API key');
      }

      // Validate API key with TuneCore
      const isValid = await this.validateAPIKey(apiKey);
      
      if (!isValid) {
        throw new Error('Invalid API key. Please check your TuneCore account settings.');
      }

      // Get account information
      const accountInfo = await this.getAccountInfo(apiKey);

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Store connection in database
      const { data: connection, error: dbError } = await supabase
        .from('platform_connections')
        .upsert({
          user_id: user.id,
          platform_name: 'TUNECORE',
          platform_id: accountInfo.account_id,
          // Encrypt API key before storing (in production, use proper encryption)
          credentials_encrypted: btoa(apiKey), // Simple base64 encoding for demo
          account_info: accountInfo,
          connection_status: 'connected',
          last_sync_at: new Date().toISOString()
        }, {
          onConflict: 'user_id,platform_name'
        })
        .select()
        .single();

      if (dbError) {
        console.error('Database error:', dbError);
        throw new Error('Failed to save connection');
      }

      return true;
    } catch (error) {
      console.error('TuneCore connect error:', error);
      throw error;
    }
  }

  /**
   * Validate API key with TuneCore
   */
  private async validateAPIKey(apiKey: string): Promise<boolean> {
    try {
      // In production, this would make a real API call to TuneCore
      // For demo, we'll simulate validation based on key format
      
      // Simulate API validation delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock validation - in production, call TuneCore API
      if (apiKey.startsWith('tc_') && apiKey.length >= 20) {
        return true;
      }

      // For demo purposes, accept any key that looks like an API key
      if (apiKey.length >= 10 && /^[A-Za-z0-9_-]+$/.test(apiKey)) {
        return true;
      }

      return false;
    } catch (error) {
      console.error('TuneCore API validation error:', error);
      return false;
    }
  }

  /**
   * Get account information from TuneCore
   */
  private async getAccountInfo(apiKey: string): Promise<any> {
    try {
      // In production, this would make real API calls to TuneCore
      // For demo, we'll return mock data
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock account data
      const mockAccountInfo = {
        account_id: 'tc_' + Date.now(),
        artist_name: 'Demo Artist',
        releases_count: 12,
        total_revenue: 2847.50,
        account_status: 'active',
        joined_date: '2022-01-15',
        last_release_date: '2024-02-15',
        territories: ['US', 'CA', 'UK', 'AU'],
        stores_count: 150,
        profile_url: 'https://www.tunecore.com/artist/demo-artist'
      };

      return mockAccountInfo;
    } catch (error) {
      console.error('TuneCore account info error:', error);
      throw new Error('Failed to fetch account information');
    }
  }

  /**
   * Get user's TuneCore connections
   */
  async getConnections(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('platform_name', 'TUNECORE')
        .eq('connection_status', 'connected');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get TuneCore connections error:', error);
      throw error;
    }
  }

  /**
   * Sync TuneCore data
   */
  async syncData(connectionId: string): Promise<any> {
    try {
      // Get connection
      const { data: connection, error: connectionError } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('id', connectionId)
        .single();

      if (connectionError || !connection) {
        throw new Error('Connection not found');
      }

      // Decrypt API key (in production, use proper decryption)
      const apiKey = atob(connection.credentials_encrypted);

      // Fetch latest data from TuneCore
      const latestData = await this.fetchLatestData(apiKey);

      // Update connection with latest data
      const { error: updateError } = await supabase
        .from('platform_connections')
        .update({
          account_info: {
            ...connection.account_info,
            ...latestData
          },
          last_sync_at: new Date().toISOString()
        })
        .eq('id', connectionId);

      if (updateError) {
        throw new Error('Failed to update connection data');
      }

      return latestData;
    } catch (error) {
      console.error('TuneCore sync data error:', error);
      throw error;
    }
  }

  /**
   * Fetch latest data from TuneCore API
   */
  private async fetchLatestData(apiKey: string): Promise<any> {
    try {
      // In production, make real API calls to get:
      // - Recent releases
      // - Revenue data
      // - Streaming statistics
      // - Store performance
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      const mockLatestData = {
        total_revenue: 3156.75,
        releases_count: 14,
        last_sync_revenue: 309.25,
        recent_releases: [
          {
            title: 'Latest Single',
            release_date: '2024-03-01',
            stores: 150,
            revenue: 245.80
          }
        ],
        monthly_revenue: {
          current_month: 309.25,
          last_month: 287.40,
          growth_percentage: 7.6
        }
      };

      return mockLatestData;
    } catch (error) {
      console.error('TuneCore fetch latest data error:', error);
      throw error;
    }
  }

  /**
   * Disconnect TuneCore account
   */
  async disconnect(connectionId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('platform_connections')
        .update({ connection_status: 'disconnected' })
        .eq('id', connectionId);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      console.error('TuneCore disconnect error:', error);
      throw error;
    }
  }
}

export const tuneCoreAPIService = TuneCoreAPIService.getInstance(); 