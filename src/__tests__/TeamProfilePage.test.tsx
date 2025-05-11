import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import App from "../App";

const pagesWithGlobalLayout = [
  { path: "/dashboard", name: "Dashboard" },
  { path: "/catalog", name: "Catalog" },
  { path: "/assets", name: "Assets" },
  { path: "/metadata", name: "Metadata" },
  { path: "/analytics", name: "Analytics" },
  { path: "/insights", name: "Royalty Insights" },
  { path: "/pricing-engine", name: "Pricing Engine" },
  { path: "/team", name: "Team" },
  { path: "/team/123", name: "Team Profile Page" },
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
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>
      );
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('app-topbar')).toBeInTheDocument();
    }
  );
}); 