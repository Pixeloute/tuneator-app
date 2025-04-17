
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

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
    const { user_id, track_name, description, mood, genre } = await req.json();

    // Validate user authentication
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Generate enhanced prompt with GPT-4o
    const enhancedPrompt = await generateEnhancedPrompt(track_name, description, mood, genre);
    
    // Generate images using the enhanced prompt
    const imageUrls = await generateImages(enhancedPrompt);
    
    // Log the generation to Supabase
    await logArtGeneration(user_id, track_name, description, enhancedPrompt, imageUrls, mood, genre);
    
    // Return the generated images and prompt
    return new Response(JSON.stringify({ 
      images: imageUrls,
      enhancedPrompt,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Artwork generator error:', error);
    return new Response(JSON.stringify({ 
      error: 'Failed to generate artwork', 
      details: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

// Function to generate an enhanced prompt using GPT-4o
async function generateEnhancedPrompt(trackName: string, description: string, mood: string, genre: string) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  const systemPrompt = `You are an expert in creating descriptive prompts for AI image generation. 
  Your task is to transform music descriptions into detailed visual prompts that will produce high-quality, 
  album cover-worthy artwork. Focus on visual elements, style, colors, composition, and mood. 
  Do not include any explanations, just return the enhanced prompt text.`;
  
  const userPrompt = `Track name: ${trackName || 'Untitled'}
  Description: ${description}
  Mood: ${mood}
  Genre: ${genre}
  
  Create a detailed, visually rich prompt for album artwork that captures the essence of this music.`;
  
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        max_tokens: 300,
        temperature: 0.7
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`OpenAI API error: ${data.error.message}`);
    }
    
    const enhancedPrompt = data.choices[0].message.content.trim();
    return enhancedPrompt;
  } catch (error) {
    console.error('Error generating enhanced prompt:', error);
    throw error;
  }
}

// Function to generate images using the DALL-E API
async function generateImages(prompt: string, n: number = 2) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: prompt,
        n: n,
        size: '1024x1024',
        quality: 'standard'
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`DALL-E API error: ${data.error.message}`);
    }
    
    // Extract the image URLs from the response
    const imageUrls = data.data.map((item: any) => item.url);
    return imageUrls;
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
}

// Function to log the generation to Supabase
async function logArtGeneration(
  userId: string, 
  trackName: string, 
  rawInput: string, 
  enhancedPrompt: string, 
  imageUrls: string[], 
  mood: string, 
  genre: string
) {
  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Supabase credentials not configured');
    }
    
    await fetch(`${supabaseUrl}/rest/v1/art_generation_logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseAnonKey,
        'Authorization': `Bearer ${supabaseAnonKey}`,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        user_id: userId,
        track_name: trackName,
        raw_input: rawInput,
        enhanced_prompt: enhancedPrompt,
        image_urls: imageUrls,
        mood: mood,
        genre: genre,
        timestamp: new Date().toISOString()
      })
    });
  } catch (error) {
    console.error('Error logging art generation:', error);
    // Don't throw here - we still want to return the images even if logging fails
  }
}
