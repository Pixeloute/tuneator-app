import { supabase } from "@/integrations/supabase/client";

interface SpotifyAuthResponse {
  authUrl: string;
  state: string;
}

interface SpotifyConnection {
  id: string;
  platform_name: string;
  account_info: {
    display_name: string;
    email: string;
    followers: number;
    country: string;
    profile_url: string;
  };
  connection_status: string;
}

interface SpotifyCallbackResponse {
  success: boolean;
  connection?: SpotifyConnection;
  error?: string;
}

export class SpotifyOAuthService {
  private static instance: SpotifyOAuthService;

  static getInstance(): SpotifyOAuthService {
    if (!SpotifyOAuthService.instance) {
      SpotifyOAuthService.instance = new SpotifyOAuthService();
    }
    return SpotifyOAuthService.instance;
  }

  /**
   * Step 1: Start OAuth flow - get authorization URL
   */
  async startAuthFlow(): Promise<SpotifyAuthResponse> {
    try {
      const { data, error } = await supabase.functions.invoke('spotify-oauth', {
        body: {},
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to start OAuth flow');
      }

      if (!data?.authUrl) {
        throw new Error('No authorization URL received');
      }

      // Store state in localStorage for validation
      localStorage.setItem('spotify_oauth_state', data.state);

      return data;
    } catch (error) {
      console.error('Spotify OAuth start error:', error);
      throw error;
    }
  }

  /**
   * Step 2: Handle OAuth callback with authorization code
   */
  async handleCallback(code: string, state: string): Promise<SpotifyCallbackResponse> {
    try {
      // Validate state parameter
      const storedState = localStorage.getItem('spotify_oauth_state');
      if (!storedState || storedState !== state) {
        throw new Error('Invalid state parameter - possible CSRF attack');
      }

      // Clear stored state
      localStorage.removeItem('spotify_oauth_state');

      const { data, error } = await supabase.functions.invoke('spotify-oauth', {
        body: {
          code,
          state,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to complete OAuth flow');
      }

      return data;
    } catch (error) {
      console.error('Spotify OAuth callback error:', error);
      throw error;
    }
  }

  /**
   * Step 3: Connect to Spotify (called from ConnectionModal)
   */
  async connect(): Promise<boolean> {
    try {
      // Start OAuth flow
      const { authUrl, state } = await this.startAuthFlow();

      // Redirect to Spotify authorization
      const popup = window.open(
        authUrl,
        'spotify-auth',
        'width=600,height=700,scrollbars=yes,resizable=yes'
      );

      if (!popup) {
        throw new Error('Popup blocked. Please allow popups for this site.');
      }

      // Wait for OAuth completion
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup.closed) {
            clearInterval(checkClosed);
            reject(new Error('Authorization cancelled by user'));
          }
        }, 1000);

        // Listen for messages from popup
        const messageListener = async (event: MessageEvent) => {
          if (event.origin !== window.location.origin) {
            return;
          }

          if (event.data.type === 'SPOTIFY_OAUTH_SUCCESS') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();

            try {
              const result = await this.handleCallback(event.data.code, event.data.state);
              resolve(result.success);
            } catch (error) {
              reject(error);
            }
          } else if (event.data.type === 'SPOTIFY_OAUTH_ERROR') {
            clearInterval(checkClosed);
            window.removeEventListener('message', messageListener);
            popup.close();
            reject(new Error(event.data.error));
          }
        };

        window.addEventListener('message', messageListener);

        // Timeout after 5 minutes
        setTimeout(() => {
          clearInterval(checkClosed);
          window.removeEventListener('message', messageListener);
          if (!popup.closed) {
            popup.close();
          }
          reject(new Error('Authorization timeout'));
        }, 300000);
      });
    } catch (error) {
      console.error('Spotify connect error:', error);
      throw error;
    }
  }

  /**
   * Get user's Spotify connections
   */
  async getConnections(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('platform_connections')
        .select('*')
        .eq('platform_name', 'Spotify')
        .eq('connection_status', 'connected');

      if (error) {
        throw new Error(error.message);
      }

      return data || [];
    } catch (error) {
      console.error('Get Spotify connections error:', error);
      throw error;
    }
  }

  /**
   * Disconnect Spotify account
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
      console.error('Spotify disconnect error:', error);
      throw error;
    }
  }

  /**
   * Refresh expired tokens
   */
  async refreshToken(connectionId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.functions.invoke('spotify-oauth', {
        body: {
          action: 'refresh',
          connectionId,
        },
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (error) {
        throw new Error(error.message || 'Failed to refresh token');
      }

      return data?.success || false;
    } catch (error) {
      console.error('Spotify token refresh error:', error);
      throw error;
    }
  }
}

export const spotifyOAuthService = SpotifyOAuthService.getInstance(); 