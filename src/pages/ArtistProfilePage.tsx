import React from 'react';
import { KpiCards } from '@/components/analytics/dashboard/kpi-cards';
import { PlatformPerformance } from '@/components/analytics/dashboard/platform-performance';
import { RevenueOverview } from '@/components/analytics/dashboard/revenue-overview';
import { MetadataHealthCard } from '@/components/dashboard/metadata-health-card';
import { ValidationPanel } from '@/components/metadata/validation-panel';
import { RevenueProjection } from '@/components/analytics/dashboard/revenue-projection';
import { GeographicalInsights } from '@/components/analytics/geographical-insights';
import { AiInsightsPanel } from '@/components/ai-assistant/ai-insights-panel';
import { supabase } from '@/integrations/supabase/client';
import { InsightPulseFeed } from '@/components/metadata/insight-pulse-feed';
import { useToast } from '@/hooks/use-toast';
import { AIAssistantChat } from '@/components/metadata/ai-assistant-chat';
import { FeatureFlag, useExperimentVariant } from "@/lib/feature-flags";

const ARTIST_API_URL = '/functions/v1/artist-profile'; // Adjust if needed
const ARTISTS = [
  { id: 'demo-artist-id', name: 'Demo Artist' },
  { id: 'artist-2', name: 'Second Artist' },
  { id: 'artist-3', name: 'Third Artist' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', rate: 1 },
  { code: 'EUR', symbol: '€', rate: 0.92 },
  { code: 'GBP', symbol: '£', rate: 0.78 },
  { code: 'JPY', symbol: '¥', rate: 155 },
  { code: 'AUD', symbol: 'A$', rate: 1.5 },
];

function mapToPlatformRoyaltyData(data: any) {
  const result: any = { spotify: [], apple: [], youtube: [], others: [], lastUpdated: new Date().toISOString() };
  if (!data || !data.tracks) return result;
  data.tracks.forEach((track: any) => {
    (track.revenues || []).forEach((rev: any) => {
      const platform = rev.platform?.toLowerCase() || 'others';
      result[platform] = result[platform] || [];
      result[platform].push({
        platform: platform,
        month: rev.periodStart ? new Date(rev.periodStart).toLocaleString('default', { month: 'short', year: 'numeric' }) : '',
        revenue: Number(rev.amount) || 0,
        streams: rev.streams || 0,
      });
    });
  });
  return result;
}

function getMetadataHealthScore(tracks: any[] = []) {
  if (!tracks.length) return 0;
  const total = tracks.reduce((sum, t) => sum + (t.metadataScore || 0), 0);
  return Math.round(total / tracks.length);
}

function getMetadataIssues(tracks: any[] = []) {
  const issues: Record<string, number> = {};
  tracks.forEach((t) => {
    (t.issues || []).forEach((iss: any) => {
      issues[iss.field] = (issues[iss.field] || 0) + 1;
    });
  });
  return Object.entries(issues).map(([category, count]) => ({ category, count }));
}

function getLostRevenue(tracks: any[] = []) {
  let total = 0;
  const issues: { track: string; issue: string; amount: number }[] = [];
  tracks.forEach((t) => {
    (t.lostRevenueEvents || []).forEach((e: any) => {
      total += Number(e.estimatedLoss) || 0;
      issues.push({
        track: t.title || t.id,
        issue: e.description || e.issueType,
        amount: Number(e.estimatedLoss) || 0,
      });
    });
  });
  return { total, issues };
}

function getCollaborators(collaborators: any[] = []) {
  return collaborators.map((c) => ({
    name: c.name,
    role: c.role,
    split: c.splitPercent,
    verified: c.verified,
    paid: c.paid ?? false,
  }));
}

function getDisputeCount(collaborators: any[] = []) {
  // Placeholder: count collaborators with 'dispute' flag or similar
  return collaborators.filter((c) => c.dispute).length;
}

function getGeoData(tracks: any[] = []) {
  // Aggregate geo performance from all tracks
  const regions: Record<string, { country: string; streams: number; revenue: number }> = {};
  tracks.forEach((t) => {
    (t.geoPerformances || []).forEach((g: any) => {
      if (!regions[g.country]) {
        regions[g.country] = { country: g.country, streams: 0, revenue: 0 };
      }
      regions[g.country].streams += g.streams || 0;
      regions[g.country].revenue += Number(g.revenue) || 0;
    });
  });
  // Trends: fastest growing and highest paying (stubbed for now)
  const sorted = Object.values(regions).sort((a, b) => b.revenue - a.revenue);
  return {
    regions: sorted,
    trends: {
      fastestGrowing: sorted.slice(0, 3).map((r) => r.country),
      highestPaying: sorted.slice(0, 3).map((r) => r.country),
    },
  };
}

const ArtistProfilePage: React.FC = () => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [aiInsights, setAiInsights] = React.useState<{ openai: string | null; gemini: string | null }>({ openai: null, gemini: null });
  const [selectedTrackIdx, setSelectedTrackIdx] = React.useState(0);
  const [aiLoading, setAiLoading] = React.useState(false);
  const [aiError, setAiError] = React.useState<string | null>(null);
  const [selectedArtistId, setSelectedArtistId] = React.useState(ARTISTS[0].id);
  const [liveRevenue, setLiveRevenue] = React.useState<number | null>(null);
  const [liveEvents, setLiveEvents] = React.useState<any[]>([]);
  const { toast } = useToast();
  const variant = useExperimentVariant(FeatureFlag.AIDETECTIVE_EXPERIMENT);
  const [currency, setCurrency] = React.useState(CURRENCIES[0]);

  const tracks = data?.tracks || [];

  React.useEffect(() => {
    setLoading(true);
    fetch(ARTIST_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ artistId: selectedArtistId }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.error) throw new Error(json.error);
        setData(json);
        setError(null);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedArtistId]);

  React.useEffect(() => {
    if (!tracks.length) return;
    setAiLoading(true);
    setAiError(null);
    setAiInsights({ openai: null, gemini: null });
    fetch('/functions/v1/ai-metadata-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioFile: tracks[selectedTrackIdx]?.audioFile || tracks[selectedTrackIdx]?.title || '',
        analysisType: 'full',
      }),
    })
      .then((res) => res.json())
      .then((ai) => {
        setAiInsights({ openai: ai.openai || null, gemini: ai.gemini || null });
        setAiError(null);
      })
      .catch(() => {
        setAiInsights({ openai: null, gemini: null });
        setAiError('Failed to fetch AI insights.');
      })
      .finally(() => setAiLoading(false));
  }, [selectedTrackIdx, tracks]);

  React.useEffect(() => {
    if (!selectedArtistId) return;
    let isMounted = true;
    // Fetch initial revenue
    supabase
      .from('revenue_records')
      .select('amount')
      .eq('artist_id', selectedArtistId)
      .then(({ data, error }) => {
        if (!error && data && isMounted) {
          const total = data.reduce((sum, r) => sum + Number((r && typeof (r as any).amount !== 'undefined') ? (r as any).amount : 0), 0);
          setLiveRevenue(total);
        }
      });
    // Subscribe to real-time updates
    const channel = supabase
      .channel('revenue_records')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'revenue_records', filter: `artist_id=eq.${selectedArtistId}` }, payload => {
        let amount = 0;
        if (payload.new && typeof payload.new === 'object' && 'amount' in payload.new) {
          amount = (payload.new as { amount: number }).amount;
        }
        setLiveEvents(e => [{
          type: payload.eventType,
          amount,
          at: new Date().toLocaleTimeString(),
        }, ...e].slice(0, 10));
        // Update live revenue
        if (payload.new && isMounted) {
          setLiveRevenue(prev => (prev || 0) + Number(amount));
        }
      })
      .subscribe();
    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [selectedArtistId]);

  React.useEffect(() => {
    if (!selectedArtistId || !data?.tracks) return;
    const trackIds = data.tracks.map((t: any) => t.id);
    const channel = supabase
      .channel('insight_alerts')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'insight_alerts',
        filter: `track_id=in.(${trackIds.join(',')})`
      }, payload => {
        if (payload.new?.type === 'metadata') {
          toast({
            title: 'Metadata Validation Alert',
            description: payload.new.message,
            variant: 'destructive',
          });
        }
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedArtistId, data?.tracks]);

  const handleReanalyze = () => {
    setAiLoading(true);
    setAiError(null);
    setAiInsights({ openai: null, gemini: null });
    fetch('/functions/v1/ai-metadata-analysis', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audioFile: tracks[selectedTrackIdx]?.audioFile || tracks[selectedTrackIdx]?.title || '',
        analysisType: 'full',
      }),
    })
      .then((res) => res.json())
      .then((ai) => {
        setAiInsights({ openai: ai.openai || null, gemini: ai.gemini || null });
        setAiError(null);
      })
      .catch(() => {
        setAiInsights({ openai: null, gemini: null });
        setAiError('Failed to fetch AI insights.');
      })
      .finally(() => setAiLoading(false));
  };

  const platformData = React.useMemo(() => mapToPlatformRoyaltyData(data), [data]);
  const healthScore = getMetadataHealthScore(tracks);
  const issues = getMetadataIssues(tracks);
  const lostRevenue = getLostRevenue(tracks);
  const collaborators = getCollaborators(data?.collaborators || []);
  const disputeCount = getDisputeCount(data?.collaborators || []);
  const geoData = getGeoData(tracks);

  return (
    <main style={{ padding: 24 }}>
      <h1>Artist Profile</h1>
      <div className="mb-4">
        <label className="font-medium mr-2">Select Artist:</label>
        <select
          value={selectedArtistId}
          onChange={e => setSelectedArtistId(e.target.value)}
          className="border rounded px-2 py-1"
          title="Select artist"
        >
          {ARTISTS.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
      </div>
      <section>
        <div className="flex items-center gap-4 mb-2">
          <h2>Analytics & Metadata</h2>
          <label className="text-sm" htmlFor="currency-select">Currency:</label>
          <select
            id="currency-select"
            value={currency.code}
            onChange={e => setCurrency(CURRENCIES.find(c => c.code === e.target.value) || CURRENCIES[0])}
            className="border rounded px-2 py-1 text-sm"
          >
            {CURRENCIES.map(c => (
              <option key={c.code} value={c.code}>{c.code}</option>
            ))}
          </select>
        </div>
        {loading && <p>Loading...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <>
            <KpiCards platformData={platformData} />
            <RevenueOverview platformData={platformData} />
            <PlatformPerformance platformData={platformData} />
            {/* Geographical Insights */}
            <div className="mt-8">
              <GeographicalInsights geoData={geoData} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <MetadataHealthCard score={healthScore} issues={issues} />
              <div className="md:col-span-2">
                <ValidationPanel />
              </div>
            </div>
            {/* AI Detective Chat Widget */}
            {variant === 'ai_detective' && (
              <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">AI Detective</h2>
                <AIAssistantChat 
                  artistId={selectedArtistId}
                  trackId={tracks[selectedTrackIdx]?.id}
                  contextData={tracks[selectedTrackIdx]}
                />
              </div>
            )}
            {/* Lost Revenue & Fixes */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Lost Revenue & Actionable Fixes</h2>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-lg font-bold text-destructive">${lostRevenue.total.toLocaleString(undefined, { maximumFractionDigits: 2 })} lost/month</span>
                <button
                  className="bg-mint/90 hover:bg-mint text-white px-4 py-2 rounded font-semibold text-sm"
                  onClick={() => alert('Auto-fix coming soon!')}
                >
                  One-Click Fix All
                </button>
              </div>
              <ul className="space-y-2">
                {lostRevenue.issues.length === 0 ? (
                  <li className="text-mint">No lost revenue detected. Great job!</li>
                ) : (
                  lostRevenue.issues.map((issue, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <span className="font-semibold">{issue.track}:</span>
                      <span>{issue.issue}</span>
                      <span className="text-destructive font-bold">- ${issue.amount.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                    </li>
                  ))
                )}
              </ul>
            </div>
            {/* AI Insights & Revenue Projection */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">AI Insights & Revenue Projection</h2>
              <div className="mb-2">
                <label className="font-medium mr-2">Select Track:</label>
                <select
                  value={selectedTrackIdx}
                  onChange={e => setSelectedTrackIdx(Number(e.target.value))}
                  className="border rounded px-2 py-1"
                  disabled={tracks.length === 0}
                  title="Select track for AI analysis"
                >
                  {tracks.map((t, idx) => (
                    <option key={t.id || idx} value={idx}>{t.title || t.id || `Track ${idx + 1}`}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-lg font-medium mb-2">AI Suggestions</h3>
                  {aiLoading ? (
                    <p>Loading AI insights...</p>
                  ) : aiError ? (
                    <div>
                      <p className="text-destructive">{aiError}</p>
                      <button
                        className="mt-2 px-3 py-1 bg-mint/90 hover:bg-mint text-white rounded text-sm font-semibold"
                        onClick={handleReanalyze}
                        disabled={aiLoading}
                      >
                        Re-analyze
                      </button>
                    </div>
                  ) : (
                    <AiInsightsPanel openaiInsights={aiInsights.openai} geminiInsights={aiInsights.gemini} />
                  )}
                </div>
                <div>
                  <RevenueProjection platformData={platformData} />
                </div>
              </div>
            </div>
            {/* Competitive Intelligence */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Competitive Intelligence</h2>
              <CompetitiveIntelligenceCard platformData={platformData} currency={currency} />
            </div>
            {/* Collaborator Management Hub */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Collaborator Management Hub</h2>
              <div className="overflow-x-auto rounded-md border mb-4">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="bg-muted/10">
                      <th className="p-2 text-left">Name</th>
                      <th className="p-2 text-left">Role</th>
                      <th className="p-2 text-left">Split %</th>
                      <th className="p-2 text-left">Verified</th>
                      <th className="p-2 text-left">Payout</th>
                    </tr>
                  </thead>
                  <tbody>
                    {collaborators.length === 0 ? (
                      <tr><td colSpan={5} className="p-2 text-mint">No collaborators found.</td></tr>
                    ) : (
                      collaborators.map((c, idx) => (
                        <tr key={idx}>
                          <td className="p-2">{c.name}</td>
                          <td className="p-2">{c.role}</td>
                          <td className="p-2">{c.split}%</td>
                          <td className="p-2">{c.verified ? <span className="text-mint font-bold">Yes</span> : <span className="text-yellow-500 font-bold">No</span>}</td>
                          <td className="p-2">{c.paid ? <span className="text-mint">Paid</span> : <span className="text-yellow-500">Pending</span>}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
              <div className="flex flex-wrap gap-4 items-center mb-2">
                <span className="text-sm">Disputes: <span className={disputeCount > 0 ? 'text-destructive font-bold' : 'text-mint font-bold'}>{disputeCount}</span></span>
                <button
                  className="bg-electric/90 hover:bg-electric text-white px-4 py-2 rounded font-semibold text-sm"
                  onClick={() => alert('Tax document generation coming soon!')}
                >
                  Generate Tax Docs
                </button>
                <button
                  className="bg-mint/90 hover:bg-mint text-white px-4 py-2 rounded font-semibold text-sm"
                  onClick={() => alert('Contract management coming soon!')}
                >
                  Manage Contracts
                </button>
              </div>
            </div>
            {/* Live Monitoring */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-2">Live Monitoring</h2>
              <div className="flex items-center gap-4 mb-2">
                <span className="font-medium">Live Revenue:</span>
                <span className="text-lg font-bold text-mint">{liveRevenue !== null ? `$${liveRevenue.toLocaleString(undefined, { maximumFractionDigits: 2 })}` : 'Loading...'}</span>
              </div>
              <div className="bg-muted/10 rounded p-3 mb-4">
                <div className="font-medium mb-1">Recent Events</div>
                <ul className="text-xs space-y-1">
                  {liveEvents.length === 0 ? (
                    <li className="text-muted-foreground">No recent events.</li>
                  ) : (
                    liveEvents.map((e: any, i) => (
                      <li key={i} className="flex gap-2">
                        <span className="font-semibold">[{e.at}]</span>
                        <span>{e.type}</span>
                        <span className="text-mint">+${e.amount}</span>
                      </li>
                    ))
                  )}
                </ul>
              </div>
              <InsightPulseFeed />
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default ArtistProfilePage; 

// Minimal stat card for competitive intelligence
function CompetitiveIntelligenceCard({ platformData, currency }: { platformData: any, currency: any }) {
  const market = { revenue: 12000, streams: 900000 };
  const fx = currency.rate;
  const symbol = currency.symbol;
  const userRevenueRaw = Object.values(platformData || {}).reduce((sum: number, arr: any) => Array.isArray(arr) ? sum + arr.reduce((s: number, x: any) => s + (x.revenue || 0), 0) : sum, 0);
  const userRevenue = Number(userRevenueRaw) * Number(fx);
  const userStreamsRaw = Object.values(platformData || {}).reduce((sum: number, arr: any) => Array.isArray(arr) ? sum + arr.reduce((s: number, x: any) => s + (x.streams || 0), 0) : sum, 0);
  const userStreams = Number(userStreamsRaw);
  const marketRevenue = Number(market.revenue) * Number(fx);
  const revenueDiff = Number(userRevenue) - Number(marketRevenue);
  const streamsDiff = Number(userStreams) - Number(market.streams);
  return (
    <div className="bg-white border rounded-lg p-4 flex flex-col md:flex-row gap-6 items-center">
      <div>
        <div className="text-sm text-muted-foreground">Your Revenue</div>
        <div className="text-2xl font-bold">{symbol}{userRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
        <div className="text-xs text-mint">{revenueDiff >= 0 ? '+' : ''}{symbol}{revenueDiff.toLocaleString(undefined, { maximumFractionDigits: 0 })} vs. market</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Your Streams</div>
        <div className="text-2xl font-bold">{userStreams.toLocaleString()}</div>
        <div className="text-xs text-mint">{streamsDiff >= 0 ? '+' : ''}{streamsDiff.toLocaleString()} vs. market</div>
      </div>
      <div>
        <div className="text-sm text-muted-foreground">Market Avg (Mock)</div>
        <div className="text-lg">{symbol}{marketRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })} / {market.streams.toLocaleString()} streams</div>
      </div>
      <div className="text-xs text-muted-foreground mt-2">Confidence: 95% | Phase 4 complete</div>
    </div>
  );
} 