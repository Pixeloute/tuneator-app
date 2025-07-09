import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { track } = await req.json();
    if (!track || !track.id) throw new Error('Missing track data');

    // Validate metadata
    const issues: Array<{ field: string; message: string }> = [];
    if (!track.isrc) issues.push({ field: 'isrc', message: 'ISRC missing' });
    if (!track.credits || track.credits.length === 0) issues.push({ field: 'credits', message: 'No credits listed' });
    // Add more rules as needed

    if (issues.length > 0) {
      // Insert alert into insight_alerts
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      await supabase.from('insight_alerts').insert({
        track_id: track.id,
        type: 'metadata',
        severity: 'moderate',
        message: `Metadata issues detected: ${issues.map(i => i.message).join(', ')}`,
        details: issues,
        created_at: new Date().toISOString(),
        is_read: false,
      });
    }

    return new Response(JSON.stringify({ success: true, issues }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 