
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY')
const GOOGLE_GEMINI_API_KEY = Deno.env.get('GOOGLE_GEMINI_API_KEY')

async function analyzeWithOpenAI(contextData: any) {
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
            content: `You are a music metadata analysis expert. Analyze the following aspects and provide specific, actionable insights:\n1. Genre classification and subgenres\n2. Mood and emotional characteristics\n3. Musical elements (tempo, key, instrumentation)\n4. Target audience and playlist potential\n5. Metadata optimization recommendations\nKeep responses concise and focused on actionable metadata enhancements.`
          },
          {
            role: 'user',
            content: `Analyze this track and its metadata. Provide specific recommendations. Metadata: ${JSON.stringify(contextData)}`
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

async function analyzeWithGemini(contextData: any) {
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
            text: `As a music metadata expert, provide a structured analysis of this track and its metadata focusing on:\n1. Primary and secondary genre classifications\n2. Mood characteristics and emotional impact\n3. Key musical elements and production style\n4. Playlist categorization suggestions\n5. Specific metadata optimization recommendations\n\nMetadata: ${JSON.stringify(contextData)}`
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

async function fetchHistoricalAnalytics({ trackId, startDate, endDate, platforms }) {
  try {
    const res = await fetch('https://<YOUR_SUPABASE_PROJECT>.functions.supabase.co/custom-analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startDate,
        endDate,
        platforms: platforms || ["Spotify", "Apple Music", "YouTube", "Other"],
        tracks: trackId ? [trackId] : undefined,
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error('Error fetching historical analytics:', e);
    return null;
  }
}

function validateMetadata(meta) {
  const requiredFields = ["title", "artistName", "isrc", "genre"];
  const issues = [];
  for (const field of requiredFields) {
    if (!meta || !meta[field] || (typeof meta[field] === 'string' && meta[field].trim() === '')) {
      issues.push({ field, issue: 'Missing or empty' });
    }
  }
  // Example: ISRC format check
  if (meta && meta.isrc && !/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(meta.isrc)) {
    issues.push({ field: 'isrc', issue: 'Invalid ISRC format' });
  }
  return issues;
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

function computeRevenueProjections(analyticsData) {
  if (!Array.isArray(analyticsData) || analyticsData.length < 2) return [];
  // Group by month, sum revenue
  const monthly = {};
  analyticsData.forEach((row) => {
    const key = row.month && row.year ? `${row.month} ${row.year}` : row.month;
    if (!monthly[key]) monthly[key] = 0;
    monthly[key] += row.revenue || 0;
  });
  const months = Object.keys(monthly);
  const values = months.map((m) => monthly[m]);
  // Simple linear regression (least squares)
  const n = values.length;
  const xSum = values.reduce((sum, _, i) => sum + i, 0);
  const ySum = values.reduce((sum, y) => sum + y, 0);
  const xySum = values.reduce((sum, y, i) => sum + i * y, 0);
  const xxSum = values.reduce((sum, _, i) => sum + i * i, 0);
  const slope = (n * xySum - xSum * ySum) / (n * xxSum - xSum * xSum || 1);
  const intercept = (ySum - slope * xSum) / n;
  // Project next 3 months
  const lastMonth = months[months.length - 1];
  const [lastMonthName, lastYear] = lastMonth.split(' ');
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let idx = monthNames.indexOf(lastMonthName);
  let year = parseInt(lastYear);
  const projections = [];
  for (let i = 1; i <= 3; i++) {
    idx = (idx + 1) % 12;
    if (idx === 0) year++;
    const month = monthNames[idx];
    const revenue = Math.round(slope * (n + i - 1) + intercept);
    projections.push({ month, year, revenue });
  }
  return projections;
}

function detectFixIntent(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes('fix') || lower.includes('sync') || lower.includes('update');
}

function detectConfirmationIntent(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes('confirm') || lower.includes('yes') || lower.includes('proceed') || lower.includes('go ahead');
}

function detectReportIntent(message) {
  if (!message) return false;
  const lower = message.toLowerCase();
  return lower.includes('report') || lower.includes('analytics') || lower.includes('trend') || lower.includes('summary');
}

async function generateReport(context, type = 'monthly') {
  // TODO: Implement real report generation and return a link or summary
  return { success: true, message: `Report (${type}) generated (simulated). Download: https://example.com/report.pdf` };
}

function summarizeBulkFix(targets) {
  // For each track, summarize what will be fixed (simulate for now)
  return targets.map(track => {
    return {
      trackId: track?.id,
      summary: `Will fix metadata for track '${track?.title || track?.id || 'Unknown'}' (simulate: ISRC, genre, etc).`,
      estimatedImpact: track?.lostRevenue || 0,
      risks: [] // TODO: add real risk analysis
    };
  });
}

async function updateSpotifyMetadata(context) {
  // TODO: Implement real Spotify API call to update metadata
  // For now, just simulate success
  return { success: true, message: 'Metadata updated on Spotify (simulated).' };
}

async function updateAppleMusicMetadata(context) {
  // TODO: Implement real Apple Music API call
  return { success: true, message: 'Metadata updated on Apple Music (simulated).' };
}
async function updateYouTubeMetadata(context) {
  // TODO: Implement real YouTube API call
  return { success: true, message: 'Metadata updated on YouTube (simulated).' };
}
async function updateDiscogsMetadata(context) {
  // TODO: Implement real Discogs API call
  return { success: true, message: 'Metadata updated on Discogs (simulated).' };
}
async function updateMusicBrainzMetadata(context) {
  // TODO: Implement real MusicBrainz API call
  return { success: true, message: 'Metadata updated on MusicBrainz (simulated).' };
}

async function orchestrateBulkFix(context, bulk = false) {
  // If bulk, context is an array of tracks; else, single track
  const targets = bulk && Array.isArray(context) ? context : [context];
  const results = [];
  for (const track of targets) {
    const res = await Promise.all([
      updateSpotifyMetadata(track),
      updateAppleMusicMetadata(track),
      updateYouTubeMetadata(track),
      updateDiscogsMetadata(track),
      updateMusicBrainzMetadata(track),
    ]);
    results.push({ trackId: track?.id, results: res });
  }
  return results;
}

function parseWorkflowSteps(message) {
  if (!message) return [];
  return message.split(/\bthen\b|\band\b|,/i).map(s => s.trim()).filter(Boolean);
}

async function handleWorkflowStep(step, context) {
  if (detectFixIntent(step)) {
    // For demo: only call orchestrateBulkFix
    const bulk = step.toLowerCase().includes('all');
    return await orchestrateBulkFix(context, bulk);
  }
  if (step.toLowerCase().includes('report')) {
    // TODO: Implement real report generation
    return { success: true, message: 'Report generated (simulated).' };
  }
  if (step.toLowerCase().includes('sync')) {
    // TODO: Implement real sync logic
    return { success: true, message: 'Sync completed (simulated).' };
  }
  return { success: false, message: `Unknown action: ${step}` };
}

function parseMentions(message) {
  if (!message) return [];
  const matches = message.match(/@([a-zA-Z0-9_]+)/g);
  return matches ? matches.map(m => m.slice(1)) : [];
}

async function logTeamAction({ userId, teamId, action, assignee }) {
  // TODO: Implement real logging/audit (e.g., save to DB)
  return { userId, teamId, action, assignee, timestamp: new Date().toISOString() };
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { audioFile, analysisType, contextData, message } = await req.json();

    console.log(`Starting AI analysis for file: ${audioFile}`)
    console.time('ai-analysis')

    // Fetch historical analytics (6 months, all platforms)
    let analyticsData = null;
    let revenueProjections = [];
    if (contextData && contextData.id) {
      const now = new Date();
      const endDate = now.toISOString().split('T')[0];
      const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
      const startDate = start.toISOString().split('T')[0];
      analyticsData = await fetchHistoricalAnalytics({
        trackId: contextData.id,
        startDate,
        endDate,
        platforms: undefined,
      });
      revenueProjections = computeRevenueProjections(analyticsData);
    }
    let fixResult = null;
    let workflowSummary = null;
    let teamActions = [];
    // Team collaboration: parse mentions and log actions
    const mentions = parseMentions(message);
    if (mentions.length && contextData && contextData.userId && contextData.teamId) {
      for (const assignee of mentions) {
        const actionLog = await logTeamAction({
          userId: contextData.userId,
          teamId: contextData.teamId,
          action: message,
          assignee
        });
        teamActions.push(actionLog);
      }
    }
    // Workflow control
    if (message && (message.toLowerCase().includes('pause') || message.toLowerCase().includes('cancel'))) {
      fixResult = { message: 'Workflow paused or cancelled by user.' };
    } else if (message && message.toLowerCase().includes('resume')) {
      fixResult = { message: 'Workflow resumed (simulated).' };
    } else if (detectReportIntent(message)) {
      fixResult = await generateReport(contextData);
    } else {
      const steps = parseWorkflowSteps(message);
      if (steps.length > 1) {
        workflowSummary = [];
        for (let i = 0; i < steps.length; i++) {
          const step = steps[i];
          const result = await handleWorkflowStep(step, contextData);
          workflowSummary.push({ step, result, progress: `${i + 1}/${steps.length}` });
        }
        fixResult = { workflowSummary };
      } else if (detectFixIntent(message)) {
        let bulk = false;
        let confirmation = false;
        if (message && message.toLowerCase().includes('all')) bulk = true;
        confirmation = detectConfirmationIntent(message);
        const targets = bulk && Array.isArray(contextData) ? contextData : [contextData];
        if (!confirmation) {
          fixResult = {
            summary: summarizeBulkFix(targets),
            prompt: 'Bulk fix detected. Please confirm to proceed with automated fixes (reply with "confirm").'
          };
        } else {
          fixResult = await orchestrateBulkFix(contextData, bulk);
        }
      }
    }
    const aiContext = { ...contextData, analyticsData, revenueProjections, fixResult, workflowSummary, teamActions: teamActions.length ? teamActions : undefined };

    // Run AI analyses in parallel with timeout handling
    const aiPromises = await Promise.allSettled([
      Promise.race([
        analyzeWithOpenAI(aiContext || audioFile),
        new Promise((_, reject) => setTimeout(() => reject(new Error('OpenAI timeout')), 15000))
      ]),
      Promise.race([
        analyzeWithGemini(aiContext || audioFile),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Gemini timeout')), 15000))
      ])
    ])

    console.timeEnd('ai-analysis')

    // Generate enhanced mock audio analysis
    const mockAudioAnalysis = generateMockAnalysis(audioFile)

    // Simple revenue impact calculation
    let revenueImpact = null;
    if (contextData && typeof contextData === 'object') {
      // Try to estimate lost revenue from contextData
      if ('lostRevenue' in contextData && typeof contextData.lostRevenue === 'number') {
        revenueImpact = contextData.lostRevenue;
      } else if ('issues' in contextData && Array.isArray(contextData.issues)) {
        // Sum up estimatedLoss from issues if present
        revenueImpact = contextData.issues.reduce((sum, i) => sum + (i.estimatedLoss || 0), 0);
      }
    }

    // Metadata validation
    const validationIssues = validateMetadata(contextData || {});
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
      },
      revenueImpact,
      validationIssues,
      revenueProjections,
      fixResult,
      teamActions: teamActions.length ? teamActions : undefined
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

