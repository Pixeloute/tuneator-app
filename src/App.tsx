
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/metadata" element={<Metadata />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/insights" element={<RoyaltyInsights />} />
            <Route path="/team" element={<Team />} />
            <Route path="/assistant" element={<SmartMetadataAssistant />} />
            <Route path="/artwork-generator" element={<ArtworkGenerator />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
