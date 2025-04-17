
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Spotify API Implementation
const spotifyApi = {
  async getAccessToken() {
    const clientId = Deno.env.get('SPOTIFY_CLIENT_ID');
    const clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET');
    
    if (!clientId || !clientSecret) {
      console.error('Spotify credentials not configured');
      throw new Error('Spotify API credentials not configured');
    }
    
    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
        },
        body: 'grant_type=client_credentials'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Failed to get Spotify token: ${data.error}`);
      }
      
      return data.access_token;
    } catch (error) {
      console.error('Error getting Spotify access token:', error);
      throw error;
    }
  },
  
  async searchSpotifyTracks(query: string) {
    try {
      const token = await this.getAccessToken();
      
      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=5`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`Spotify search failed: ${data.error?.message || 'Unknown error'}`);
      }
      
      // Transform to a simpler structure
      return data.tracks.items.map((track: any) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist: any) => artist.name).join(', '),
        album: track.album.name,
        release_date: track.album.release_date,
        popularity: track.popularity,
        preview_url: track.preview_url,
        external_url: track.external_urls.spotify,
        album_image: track.album.images[0]?.url
      }));
    } catch (error) {
      console.error('Error searching Spotify:', error);
      return [];
    }
  }
};

// YouTube API Implementation
const youtubeApi = {
  async searchYouTubeVideos(query: string) {
    const apiKey = Deno.env.get('YOUTUBE_API_KEY');
    
    if (!apiKey) {
      console.error('YouTube API key not configured');
      throw new Error('YouTube API key not configured');
    }
    
    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=5&key=${apiKey}`
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`YouTube search failed: ${data.error?.message || 'Unknown error'}`);
      }
      
      // Transform to a simpler structure
      return data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        description: item.snippet.description,
        thumbnail: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
        published_at: item.snippet.publishedAt,
        url: `https://www.youtube.com/watch?v=${item.id.videoId}`
      }));
    } catch (error) {
      console.error('Error searching YouTube:', error);
      return [];
    }
  }
};

// MusicBrainz API Implementation
const musicbrainzApi = {
  async searchRecordings(query: string) {
    try {
      // MusicBrainz requires a user agent with contact info
      const response = await fetch(
        `https://musicbrainz.org/ws/2/recording/?query=${encodeURIComponent(query)}&fmt=json&limit=5`, {
          headers: {
            'User-Agent': 'Tuneator/1.0.0 (https://tuneator.com)'
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`MusicBrainz search failed: ${data.error || 'Unknown error'}`);
      }
      
      // Transform to a simpler structure
      return data.recordings.map((recording: any) => ({
        id: recording.id,
        title: recording.title,
        artist: recording.artist_credit?.map((credit: any) => credit.name).join(', ') || 'Unknown Artist',
        release: recording.releases?.[0]?.title,
        release_date: recording.releases?.[0]?.date,
        length: recording.length,
        isrcs: recording.isrcs || [],
        tags: recording.tags?.map((tag: any) => tag.name) || []
      }));
    } catch (error) {
      console.error('Error searching MusicBrainz:', error);
      return [];
    }
  },
  
  async lookupByISRC(isrc: string) {
    try {
      const response = await fetch(
        `https://musicbrainz.org/ws/2/isrc/${isrc}?fmt=json&inc=recordings`, {
          headers: {
            'User-Agent': 'Tuneator/1.0.0 (https://tuneator.com)'
          }
        }
      );
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(`MusicBrainz ISRC lookup failed: ${data.error || 'Unknown error'}`);
      }
      
      // Transform to a simpler structure
      return data.recordings.map((recording: any) => ({
        id: recording.id,
        title: recording.title,
        artist: recording.artist_credit?.map((credit: any) => credit.name).join(', ') || 'Unknown Artist',
        isrc: isrc
      }));
    } catch (error) {
      console.error('Error looking up ISRC on MusicBrainz:', error);
      return [];
    }
  }
};

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

    // Optional ISRC check for more accurate searches
    const isrc = search_context?.isrc;
    let mbResults = [];
    
    // If ISRC is provided, use it for MusicBrainz lookup
    if (isrc) {
      mbResults = await musicbrainzApi.lookupByISRC(isrc);
    }
    
    // If no results from ISRC or no ISRC provided, perform standard search
    if (mbResults.length === 0) {
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
          search_context: search_context || {},
          audit_status
        })
      });

      // Return search results
      return new Response(JSON.stringify({ 
        results,
        audit_status,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } else {
      // We have results from ISRC lookup
      // Perform additional searches using the information from ISRC
      const firstMatch = mbResults[0];
      const enhancedQuery = `${firstMatch.artist} ${firstMatch.title}`;
      
      const [spotifyResults, youtubeResults] = await Promise.allSettled([
        spotifyApi.searchSpotifyTracks(enhancedQuery),
        youtubeApi.searchYouTubeVideos(enhancedQuery)
      ]);
      
      const results = {
        spotify: spotifyResults.status === 'fulfilled' ? spotifyResults.value : [],
        youtube: youtubeResults.status === 'fulfilled' ? youtubeResults.value : [],
        musicbrainz: mbResults
      };
      
      // Log search to Supabase
      await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/metadata_search_logs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': Deno.env.get('SUPABASE_ANON_KEY'),
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          user_id,
          search_query: `ISRC:${isrc}`,
          results,
          search_context: search_context || {},
          audit_status: 'completed'
        })
      });
      
      // Return search results
      return new Response(JSON.stringify({ 
        results,
        audit_status: 'completed',
        timestamp: new Date().toISOString(),
        isrc_match: true
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
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
