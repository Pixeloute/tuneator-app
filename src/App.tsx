import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import { Toaster } from "@/components/ui/toaster";

import { ThemeProvider } from "@/components/theme-provider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Metadata from "./pages/Metadata";
import Catalog from "./pages/Catalog";
import Assets from "./pages/Assets";
import Analytics from "./pages/Analytics";
import SmartMetadataAssistant from "./pages/SmartMetadataAssistant";
import Team from "./pages/Team";
import NotFound from "./pages/NotFound";
import RoyaltyInsights from "./pages/RoyaltyInsights";

const queryClient = new QueryClient();

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/metadata" element={<Metadata />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/assets" element={<Assets />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/royalty-insights" element={<RoyaltyInsights />} />
            <Route path="/ai-assistant" element={<SmartMetadataAssistant />} />
            <Route path="/team" element={<Team />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
