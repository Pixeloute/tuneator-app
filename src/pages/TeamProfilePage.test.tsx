import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom'; // Import to extend expect with jest-dom matchers

import App from "../App"; // Import the main App to get all providers

// You may need to mock providers, supabase, or data fetching for a real test
// For simplicity, we're testing navigation to actual page components via App's routing

const pagesWithGlobalLayout = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/catalog", name: "Catalog" },
  { path: "/assets", name: "Assets" },
  { path: "/metadata", name: "Metadata" },
  { path: "/analytics", name: "Analytics" },
  { path: "/insights", name: "Royalty Insights" },
  { path: "/pricing-engine", name: "Pricing Engine" },
  { path: "/team", name: "Team" },
  { path: "/team/123", name: "Team Profile Page" }, // Using a sample ID
  { path: "/assistant", name: "Smart Metadata Assistant" },
  { path: "/artwork-generator", name: "Artwork Generator" },
  { path: "/profile", name: "Profile" },
  { path: "/settings", name: "Settings" },
];

describe("Global App Layout Contract", () => {
  test.each(pagesWithGlobalLayout)(
    "$name page (%s) renders with sidebar and topbar",
    async ({ path }) => {
      render(
        // Render the whole App to ensure all contexts/providers are present
        // MemoryRouter will handle the navigation to the specified path
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );

      // Check for AppSidebar (via a common element or label it provides)
      // Assuming AppSidebar always renders TeamProfileOverview or a similar identifiable component/label
      // This might need adjustment based on AppSidebar's actual content
      // For now, we'll use the Profile Overview label as a stand-in, 
      // but ideally AppSidebar itself or a direct child should have a consistent test ID or ARIA label.
      // If a page doesn't show Profile Overview (e.g. Dashboard), this assertion will fail.
      // A more robust check would be for a unique element within AppSidebar itself.
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
      
      // Check for TopBar (e.g., by looking for a brand name or a unique TopBar element)
      // Adjust "Tuneator" if your TopBar has a different consistent brand identifier
      expect(screen.getByTestId('app-topbar')).toBeInTheDocument();

      // You could add a check for a <main> element or a specific data-testid for the content area
      // expect(screen.getByRole('main')).toBeInTheDocument();
    }
  );
}); 