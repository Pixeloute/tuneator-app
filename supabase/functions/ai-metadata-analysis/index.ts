
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY')

async function analyzeWithOpenAI(audioData: any) {
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a music metadata analysis expert. Analyze the following aspects and provide specific, actionable insights:
            1. Genre classification and subgenres
            2. Mood and emotional characteristics
            3. Musical elements (tempo, key, instrumentation)
            4. Target audience and playlist potential
            5. Metadata optimization recommendations
            Keep responses concise and focused on actionable metadata enhancements.`
          },
          {
            role: 'user',
            content: `Analyze this audio track and provide specific recommendations: ${JSON.stringify(audioData)}`
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      }),
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0].message.content
  } catch (error) {
    console.error('OpenAI API error:', error)
    return `OpenAI Analysis Error: ${error.message}`
  }
}

async function analyzeWithGemini(audioData: any) {
  try {
    const response = await fetch('https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': GOOGLE_GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: `As a music metadata expert, provide a structured analysis of this audio track focusing on:
            1. Primary and secondary genre classifications
            2. Mood characteristics and emotional impact
            3. Key musical elements and production style
            4. Playlist categorization suggestions
            5. Specific metadata optimization recommendations
            
            Audio data: ${JSON.stringify(audioData)}`
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 40
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    })
    
    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    return data.candidates[0].content.parts[0].text
  } catch (error) {
    console.error('Gemini API error:', error)
    return `Gemini Analysis Error: ${error.message}`
  }
}

function generateMockAnalysis(audioFile: string) {
  // Generate more detailed mock analysis data
  return {
    danceability: Math.round(Math.random() * 100),
    energy: Math.round(Math.random() * 100),
    instrumentalness: Math.round(Math.random() * 100),
    acousticness: Math.round(Math.random() * 100),
    valence: Math.round(Math.random() * 100),
    tempo: Math.round(70 + Math.random() * 100),
    key: ["C", "G", "D", "A", "E", "B", "F"][Math.floor(Math.random() * 7)],
    timeSignature: ["4/4", "3/4", "6/8"][Math.floor(Math.random() * 3)]
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { audioFile, analysisType } = await req.json()

    console.log(`Starting AI analysis for file: ${audioFile}`)
    console.time('ai-analysis')

    // Run AI analyses in parallel with timeout handling
    const aiPromises = await Promise.allSettled([
      Promise.race([
        analyzeWithOpenAI(audioFile),
        new Promise((_, reject) => setTimeout(() => reject(new Error('OpenAI timeout')), 15000))
      ]),
      Promise.race([
        analyzeWithGemini(audioFile),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), 15000))
      ])
    ])

    console.timeEnd('ai-analysis')

    // Generate enhanced mock audio analysis
    const mockAudioAnalysis = generateMockAnalysis(audioFile)

    // Process results with enhanced error handling
    const results = {
      audioAnalysis: mockAudioAnalysis,
      openai: aiPromises[0].status === 'fulfilled' ? aiPromises[0].value : null,
      gemini: aiPromises[1].status === 'fulfilled' ? aiPromises[1].value : null,
      genres: ["Electronic", "Ambient", "Pop", "Downtempo", "Experimental"],
      recommendedTags: ["chillout", "electronic", "ambient", "downtempo", "atmospheric"],
      moodTags: ["relaxed", "atmospheric", "dreamy", "introspective", "smooth"],
      genreConfidence: {
        "Electronic": 0.85,
        "Ambient": 0.72,
        "Pop": 0.65,
        "Downtempo": 0.58,
        "Experimental": 0.45
      },
      analysisMetadata: {
        timestamp: new Date().toISOString(),
        duration: console.timeEnd('ai-analysis'),
        apiStatus: {
          openai: aiPromises[0].status,
          gemini: aiPromises[1].status
        }
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error in AI analysis:', error)
    return new Response(JSON.stringify({ 
      error: 'Failed to complete AI analysis', 
      details: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

