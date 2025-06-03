import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    {
      global: {
        headers: { Authorization: req.headers.get('Authorization')! },
      },
    }
  );

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    if (action === 'authorize') {
      // Step 1: Generate authorization URL
      const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
      const redirectUri = Deno.env.get('SPOTIFY_REDIRECT_URI');
      const scopes = [
        'user-read-email',
        'user-read-private',
        'user-top-read',
        'streaming',
        'user-read-playback-state',
        'user-modify-playback-state'
      ].join(' ');

      const state = crypto.randomUUID();
      const authUrl = new URL('https://accounts.spotify.com/authorize');
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('client_id', clientId!);
      authUrl.searchParams.set('scope', scopes);
      authUrl.searchParams.set('redirect_uri', redirectUri!);
      authUrl.searchParams.set('state', state);

      return new Response(
        JSON.stringify({ 
          authUrl: authUrl.toString(),
          state 
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'callback') {
      // Step 2: Handle callback and exchange code for tokens
      const body = await req.json();
      const { code, state } = body;

      if (!code) {
        throw new Error('Authorization code is required');
      }

      // Exchange code for access token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${Deno.env.get('SPOTIFY_CLIENT_ID')}:${Deno.env.get('SPOTIFY_CLIENT_SECRET')}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          code,
          redirect_uri: Deno.env.get('SPOTIFY_REDIRECT_URI')!,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Spotify token exchange failed: ${error}`);
      }

      const tokens: SpotifyTokenResponse = await tokenResponse.json();

      // Get user profile from Spotify
      const profileResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          'Authorization': `Bearer ${tokens.access_token}`,
        },
      });

      if (!profileResponse.ok) {
        throw new Error('Failed to fetch Spotify profile');
      }

      const profile = await profileResponse.json();

      // Get current user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Calculate token expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

      // Store connection in database
      const { data: connection, error: dbError } = await supabaseClient
        .from('platform_connections')
        .upsert({
          user_id: user.id,
          platform_name: 'Spotify',
          platform_id: profile.id,
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token,
          token_expires_at: expiresAt.toISOString(),
          account_info: {
            display_name: profile.display_name,
            email: profile.email,
            followers: profile.followers?.total || 0,
            country: profile.country,
            profile_url: profile.external_urls?.spotify,
            images: profile.images
          },
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

      return new Response(
        JSON.stringify({
          success: true,
          connection: {
            id: connection.id,
            platform_name: connection.platform_name,
            account_info: connection.account_info,
            connection_status: connection.connection_status
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'refresh') {
      // Step 3: Refresh expired tokens
      const body = await req.json();
      const { connectionId } = body;

      // Get current user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Get connection
      const { data: connection, error: connectionError } = await supabaseClient
        .from('platform_connections')
        .select('*')
        .eq('id', connectionId)
        .eq('user_id', user.id)
        .single();

      if (connectionError || !connection) {
        throw new Error('Connection not found');
      }

      if (!connection.refresh_token) {
        throw new Error('No refresh token available');
      }

      // Refresh the token
      const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${Deno.env.get('SPOTIFY_CLIENT_ID')}:${Deno.env.get('SPOTIFY_CLIENT_SECRET')}`)}`,
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: connection.refresh_token,
        }),
      });

      if (!tokenResponse.ok) {
        const error = await tokenResponse.text();
        throw new Error(`Token refresh failed: ${error}`);
      }

      const tokens: SpotifyTokenResponse = await tokenResponse.json();

      // Calculate new expiration
      const expiresAt = new Date();
      expiresAt.setSeconds(expiresAt.getSeconds() + tokens.expires_in);

      // Update connection
      const { error: updateError } = await supabaseClient
        .from('platform_connections')
        .update({
          access_token: tokens.access_token,
          refresh_token: tokens.refresh_token || connection.refresh_token, // Some refreshes don't return new refresh token
          token_expires_at: expiresAt.toISOString(),
          connection_status: 'connected',
          updated_at: new Date().toISOString()
        })
        .eq('id', connectionId);

      if (updateError) {
        throw new Error('Failed to update tokens');
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      throw new Error('Invalid action parameter');
    }

  } catch (error) {
    console.error('Spotify OAuth error:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Internal server error',
        success: false 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
}); 