import React from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { TopBar } from "@/components/navigation/top-bar";
import { StatusCardsSection } from "@/components/dashboard/StatusCardsSection";
import { MetadataAndAssetsSection } from "@/components/dashboard/MetadataAndAssetsSection";
import { RevenueChartCard } from "@/components/dashboard/revenue-chart-card";
import { RoyaltyAndInsightsSection } from "@/components/dashboard/RoyaltyAndInsightsSection";
import { AppSidebar } from "@/components/navigation/app-sidebar";
import { PageLayout } from "@/components/layout/page-layout";

// Mock data for revenue chart
const revenueData = [
  {
    month: "Jan",
    spotify: 320,
    apple: 220,
    youtube: 180,
    other: 120,
  },
  {
    month: "Feb",
    spotify: 380,
    apple: 250,
    youtube: 190,
    other: 140,
  },
  {
    month: "Mar",
    spotify: 350,
    apple: 210,
    youtube: 220,
    other: 110,
  },
  {
    month: "Apr",
    spotify: 410,
    apple: 290,
    youtube: 240,
    other: 130,
  },
  {
    month: "May",
    spotify: 460,
    apple: 310,
    youtube: 260,
    other: 170,
  },
  {
    month: "Jun",
    spotify: 520,
    apple: 350,
    youtube: 290,
    other: 220,
  },
];

const Dashboard = () => (
  <PageLayout>
    <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
    <StatusCardsSection />
    <MetadataAndAssetsSection />
    <RevenueChartCard data={revenueData} />
    <RoyaltyAndInsightsSection />
  </PageLayout>
);

export default Dashboard;
