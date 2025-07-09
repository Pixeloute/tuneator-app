import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SidebarProvider } from "@/components/ui/sidebar";
import posthog from 'posthog-js';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import Assets from "./pages/Assets";
import Metadata from "./pages/Metadata";
import Analytics from "./pages/Analytics";
import RoyaltyInsights from "./pages/RoyaltyInsights";
import Team from "./pages/Team";
import SmartMetadataAssistant from "./pages/SmartMetadataAssistant";
import NotFound from "./pages/NotFound";
import ArtworkGenerator from "./pages/ArtworkGenerator";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import PricingEngine from "./pages/PricingEngine";
import TeamProfilePage from "./pages/TeamProfilePage";
import Sources from "./pages/Sources";
import SpotifyCallback from "./pages/SpotifyCallback";
import { Toaster } from "@/components/ui/toaster";
import ArtistProfilePage from "./pages/ArtistProfilePage";

const queryClient = new QueryClient();

function App() {
  const location = useLocation();
  const { user } = useAuth();
  const [showOnboarding, setShowOnboarding] = React.useState(false);
  const [loadingOnboarding, setLoadingOnboarding] = React.useState(true);

  React.useEffect(() => {
    posthog.capture('$pageview');
  }, [location.pathname]);

  React.useEffect(() => {
    if (!user) return;
    setLoadingOnboarding(true);
    supabase
      .from('user_profiles')
      .select('has_onboarded')
      .eq('user_id', user.id)
      .single()
      .then(({ data }) => {
        setShowOnboarding(!data || !data.has_onboarded);
      })
      .finally(() => setLoadingOnboarding(false));
  }, [user]);

  const handleOnboardingComplete = async () => {
    if (!user) return;
    await supabase.from('user_profiles').upsert({ user_id: user.id, has_onboarded: true });
    setShowOnboarding(false);
  };

  return (
    <>
      {/* Onboarding Modal */}
      <Dialog open={showOnboarding && !loadingOnboarding}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Welcome to Tuneator!</DialogTitle>
            <DialogDescription>
              Get started in 3 steps:
              <ol className="list-decimal pl-5 mt-2 space-y-1 text-sm">
                <li>Connect your streaming/distribution platforms</li>
                <li>Upload your first track or release</li>
                <li>Review your analytics and metadata health</li>
              </ol>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <button className="bg-mint px-4 py-2 rounded text-white font-semibold" onClick={handleOnboardingComplete}>
              Get Started
            </button>
            <button className="text-muted-foreground underline text-sm ml-2" onClick={handleOnboardingComplete}>
              Skip for now
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <AuthProvider>
        <QueryClientProvider client={queryClient}>
          <SidebarProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/catalog" element={<Catalog />} />
              <Route path="/assets" element={<Assets />} />
              <Route path="/metadata" element={<Metadata />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/insights" element={<RoyaltyInsights />} />
              <Route path="/pricing-engine" element={<PricingEngine />} />
              <Route path="/team" element={<Team />} />
              <Route path="/team/:id" element={<TeamProfilePage />} />
              <Route path="/assistant" element={<SmartMetadataAssistant />} />
              <Route path="/artwork-generator" element={<ArtworkGenerator />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/spotify/callback" element={<SpotifyCallback />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/artist" element={<ArtistProfilePage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
            <Toaster />
          </SidebarProvider>
        </QueryClientProvider>
      </AuthProvider>
    </>
  );
}

export default App;
