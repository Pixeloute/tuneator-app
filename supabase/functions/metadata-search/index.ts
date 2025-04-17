
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

import spotifyApi from './spotify-api.ts';
import youtubeApi from './youtube-api.ts';
import musicbrainzApi from './musicbrainz-api.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Extract data from request
    const { user_id, search_query, search_context } = await req.json();

    // Validate user authentication
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Perform multi-source search
    const [spotifyResults, youtubeResults, musicbrainzResults] = await Promise.allSettled([
      spotifyApi.searchSpotifyTracks(search_query),
      youtubeApi.searchYouTubeVideos(search_query),
      musicbrainzApi.searchRecordings(search_query)
    ]);

    // Prepare results object
    const results = {
      spotify: spotifyResults.status === 'fulfilled' ? spotifyResults.value : [],
      youtube: youtubeResults.status === 'fulfilled' ? youtubeResults.value : [],
      musicbrainz: musicbrainzResults.status === 'fulfilled' ? musicbrainzResults.value : []
    };

    // Determine audit status
    const audit_status = 
      (spotifyResults.status === 'fulfilled' && 
       youtubeResults.status === 'fulfilled' && 
       musicbrainzResults.status === 'fulfilled') 
      ? 'completed' 
      : 'incomplete';

    // Log search to Supabase
    const logResponse = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/metadata_search_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('SUPABASE_ANON_KEY'),
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id,
        search_query,
        results,
        search_context,
        audit_status
      })
    });

    // Return search results
    return new Response(JSON.stringify({ 
      results,
      audit_status 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Metadata search error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to perform metadata search', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Dummy API implementations (these would be replaced with actual API calls)
const spotifyApi = {
  async searchSpotifyTracks(query: string) {
    // Simulated Spotify search
    return [];
  }
};

const youtubeApi = {
  async searchYouTubeVideos(query: string) {
    // Simulated YouTube search
    return [];
  }
};

const musicbrainzApi = {
  async searchRecordings(query: string) {
    // Simulated MusicBrainz search
    return [];
  }
};

