
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { service, endpoint, params } = await req.json()
    
    let apiKey, clientId, clientSecret
    switch (service) {
      case 'youtube':
        apiKey = Deno.env.get('YOUTUBE_API_KEY')
        break
      case 'spotify':
        clientId = Deno.env.get('SPOTIFY_CLIENT_ID')
        clientSecret = Deno.env.get('SPOTIFY_CLIENT_SECRET')
        break
      case 'discogs':
        apiKey = Deno.env.get('DISCOGS_USER_TOKEN')
        break
      default:
        throw new Error('Invalid service')
    }

    let response
    switch (service) {
      case 'youtube':
        response = await fetch(
          `https://www.googleapis.com/youtube/v3/${endpoint}?key=${apiKey}&${new URLSearchParams(params)}`
        )
        break
      case 'spotify':
        // Get Spotify access token
        const tokenResponse = await fetch('https://accounts.spotify.com/api/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Basic ${btoa(`${clientId}:${clientSecret}`)}`
          },
          body: 'grant_type=client_credentials'
        })
        const { access_token } = await tokenResponse.json()
        
        response = await fetch(`https://api.spotify.com/v1/${endpoint}`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        })
        break
      case 'discogs':
        response = await fetch(
          `https://api.discogs.com/${endpoint}?token=${apiKey}&${new URLSearchParams(params)}`
        )
        break
      default:
        throw new Error('Invalid service')
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('API Proxy error:', error)
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
