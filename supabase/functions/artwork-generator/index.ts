
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
    const { user_id, track_name, description, mood, genre, custom_prompt } = await req.json();

    // Validate user authentication
    if (!user_id) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Use either custom prompt or generate one
    let prompt;
    if (custom_prompt) {
      prompt = custom_prompt;
    } else {
      prompt = await generateEnhancedPrompt(track_name, description, mood, genre);
    }
    
    // Generate images using the prompt
    const imageUrls = await generateImages(prompt);
    
    // Return the generated images and prompt
    return new Response(JSON.stringify({ 
      images: imageUrls,
      enhancedPrompt: prompt,
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
  
  const systemPrompt = `You are an expert in creating descriptive prompts for album artwork. 
  Create a detailed prompt that will produce high-quality album cover art based on the provided information.
  Focus on visual elements only - colors, style, composition, and mood. Keep it concise (100 words max).`;
  
  const userPrompt = `Track: "${trackName || 'Untitled'}"
  Description: ${description || ''}
  Mood: ${mood || ''}
  Genre: ${genre || ''}`;
  
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
    
    return data.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating enhanced prompt:', error);
    throw error;
  }
}

// Function to generate images using the DALL-E API
async function generateImages(prompt: string) {
  const openAiKey = Deno.env.get('OPENAI_API_KEY');
  
  if (!openAiKey) {
    throw new Error('OpenAI API key not configured');
  }
  
  try {
    console.log("Generating images with prompt:", prompt);
    
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${openAiKey}`
      },
      body: JSON.stringify({
        model: 'dall-e-2',  // Using DALL-E 2 instead of DALL-E 3 for more reliable results
        prompt: prompt,
        n: 2,
        size: '1024x1024',
        response_format: 'url'
      })
    });
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(`DALL-E API error: ${data.error.message || JSON.stringify(data.error)}`);
    }
    
    // Extract the image URLs from the response
    const imageUrls = data.data.map((item: any) => item.url);
    return imageUrls;
  } catch (error) {
    console.error('Error generating images:', error);
    throw error;
  }
}
