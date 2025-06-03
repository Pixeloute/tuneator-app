import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.7';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface AppleMusicTokenResponse {
  access_token: string;
  token_type: string;
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
      // Step 1: Generate Music Kit JS authorization
      const teamId = Deno.env.get('APPLE_TEAM_ID');
      const keyId = Deno.env.get('APPLE_KEY_ID');
      const bundleId = Deno.env.get('APPLE_BUNDLE_ID');
      
      if (!teamId || !keyId || !bundleId) {
        throw new Error('Missing Apple Music configuration');
      }

      // For Apple Music, we use Music Kit JS which requires different setup
      // The frontend will handle the actual authorization using Music Kit JS
      return new Response(
        JSON.stringify({ 
          setupRequired: true,
          teamId,
          keyId,
          bundleId,
          instructions: 'Apple Music uses Music Kit JS for authorization. The frontend will handle the auth flow.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'connect') {
      // Step 2: Store Apple Music connection after frontend auth
      const body = await req.json();
      const { musicUserToken, userProfile } = body;

      if (!musicUserToken) {
        throw new Error('Music user token is required');
      }

      // Get current user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Store connection in database
      const { data: connection, error: dbError } = await supabaseClient
        .from('platform_connections')
        .upsert({
          user_id: user.id,
          platform_name: 'Apple Music',
          platform_id: userProfile?.id || 'apple_music_user',
          access_token: musicUserToken,
          // Apple Music tokens don't expire in the traditional sense
          token_expires_at: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
          account_info: {
            subscription_status: userProfile?.subscription_status || 'unknown',
            storefront: userProfile?.storefront || 'us',
            profile_url: 'https://music.apple.com/',
            platform_type: 'streaming'
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

    } else if (action === 'sync-data') {
      // Step 3: Sync Apple Music data (playlists, listening history, etc.)
      const body = await req.json();
      const { connectionId, musicUserToken } = body;

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

      // Note: Apple Music API has limited data access compared to Spotify
      // We can mainly get user's library and basic listening data
      
      // For now, we'll simulate successful sync
      // In production, you'd make requests to Apple Music API here
      const mockSyncData = {
        library_tracks: 1250,
        playlists: 15,
        last_played: new Date().toISOString(),
        subscription_type: 'individual'
      };

      // Update last sync time
      await supabaseClient
        .from('platform_connections')
        .update({
          last_sync_at: new Date().toISOString(),
          account_info: {
            ...connection.account_info,
            ...mockSyncData
          }
        })
        .eq('id', connectionId);

      return new Response(
        JSON.stringify({
          success: true,
          syncData: mockSyncData
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else if (action === 'disconnect') {
      // Step 4: Disconnect Apple Music
      const body = await req.json();
      const { connectionId } = body;

      // Get current user
      const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
      
      if (userError || !user) {
        throw new Error('User not authenticated');
      }

      // Update connection status
      const { error: updateError } = await supabaseClient
        .from('platform_connections')
        .update({
          connection_status: 'disconnected',
          updated_at: new Date().toISOString()
        })
        .eq('id', connectionId)
        .eq('user_id', user.id);

      if (updateError) {
        throw new Error('Failed to disconnect');
      }

      return new Response(
        JSON.stringify({ success: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } else {
      throw new Error('Invalid action parameter');
    }

  } catch (error) {
    console.error('Apple Music OAuth error:', error);
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