import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import App from "../App";
import { Sidebar } from '../components/ui/sidebar';

const sidebarLinks = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Catalog", path: "/catalog" },
  { name: "Assets", path: "/assets" },
  { name: "Metadata", path: "/metadata" },
  { name: "Analytics", path: "/analytics" },
  { name: "Royalty Insights", path: "/insights" },
  { name: "Pricing Engine", path: "/pricing-engine" },
  { name: "Team", path: "/team" },
  { name: "AI Assistant", path: "/assistant" },
  { name: "Art Generator", path: "/artwork-generator" },
];

describe("Sidebar navigation", () => {
  it("routes to correct page and highlights active link", async () => {
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <App />
      </MemoryRouter>
    );
    for (const link of sidebarLinks) {
      const navLink = screen.getByRole("link", { name: link.name });
      await userEvent.click(navLink);
      // Check URL
      expect(window.location.pathname).toBe(link.path);
      // Check active state (isActive prop sets a class or aria-current)
      expect(navLink).toHaveAttribute("aria-current", "page");
    }
  });

  it('renders and navigates to dashboard', () => {
    render(<Sidebar />);
    fireEvent.click(screen.getByText(/dashboard/i));
    expect(window.location.pathname).toBe('/dashboard');
  });
}); 