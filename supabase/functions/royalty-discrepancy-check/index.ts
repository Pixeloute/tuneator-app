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
    const { artistId, revenue } = await req.json();
    if (!artistId || !revenue) throw new Error('Missing artistId or revenue data');

    // Detect discrepancies: missing/late payments, >30% drop
    let discrepancy: any = null;
    for (let i = 1; i < revenue.length; i++) {
      const prev = revenue[i - 1].amount;
      const curr = revenue[i].amount;
      if (curr < prev * 0.7) {
        discrepancy = {
          period: revenue[i].period,
          drop: ((prev - curr) / prev) * 100,
          message: `Revenue dropped by ${Math.round(((prev - curr) / prev) * 100)}% in ${revenue[i].period}`
        };
        break;
      }
    }
    // Check for missing payments (gap in periods)
    for (let i = 1; i < revenue.length; i++) {
      const prevPeriod = new Date(revenue[i - 1].period);
      const currPeriod = new Date(revenue[i].period);
      if ((currPeriod.getMonth() - prevPeriod.getMonth() > 1) || (currPeriod.getFullYear() > prevPeriod.getFullYear() && currPeriod.getMonth() !== 0)) {
        discrepancy = {
          period: revenue[i].period,
          message: `Missing royalty payment for period before ${revenue[i].period}`
        };
        break;
      }
    }

    if (discrepancy) {
      const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
      await supabase.from('insight_alerts').insert({
        track_id: null,
        type: 'royalties',
        severity: 'critical',
        message: discrepancy.message,
        details: discrepancy,
        created_at: new Date().toISOString(),
        is_read: false,
      });
    }

    return new Response(JSON.stringify({ success: true, discrepancy }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
}); 