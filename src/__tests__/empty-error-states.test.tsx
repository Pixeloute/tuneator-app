import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import App from "../App";
import Dashboard from '../pages/Dashboard';

jest.mock("../integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "1", full_name: "Test User" } }),
      // Return empty arrays for activities and tasks
      then: jest.fn(fn => fn({ data: [] })),
    })),
  },
}));

describe("Empty/error states", () => {
  it("shows correct message when no activities or tasks", async () => {
    render(
      <MemoryRouter initialEntries={["/team/123"]}>
        <App />
      </MemoryRouter>
    );
    // Go to Activity tab
    const activityTab = screen.getByRole("tab", { name: /activity/i });
    activityTab.focus();
    activityTab.click();
    expect(await screen.findByText(/no activity found/i)).toBeInTheDocument();
    // Go to Tasks tab
    const tasksTab = screen.getByRole("tab", { name: /tasks/i });
    tasksTab.focus();
    tasksTab.click();
    expect(await screen.findByText(/no tasks assigned/i)).toBeInTheDocument();
  });
});

describe('Dashboard empty/error states', () => {
  it('shows empty state when no data', () => {
    render(<Dashboard />);
    expect(screen.getByText(/no data/i)).toBeInTheDocument();
  });
}); 