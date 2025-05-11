import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import '@testing-library/jest-dom';
import App from "../App";

describe("Tab keyboard navigation", () => {
  it("arrow keys move between tabs and show correct content", async () => {
    render(
      <MemoryRouter initialEntries={["/team/123"]}>
        <App />
      </MemoryRouter>
    );
    // Focus first tab
    const overviewTab = screen.getByRole("tab", { name: /overview/i });
    overviewTab.focus();
    expect(overviewTab).toHaveFocus();
    // Right arrow to Activity
    fireEvent.keyDown(overviewTab, { key: "ArrowRight" });
    const activityTab = screen.getByRole("tab", { name: /activity/i });
    expect(activityTab).toHaveFocus();
    expect(screen.getByText(/no activity found/i)).toBeInTheDocument();
    // Right arrow to Tasks
    fireEvent.keyDown(activityTab, { key: "ArrowRight" });
    const tasksTab = screen.getByRole("tab", { name: /tasks/i });
    expect(tasksTab).toHaveFocus();
    expect(screen.getByText(/no tasks assigned/i)).toBeInTheDocument();
    // Left arrow back to Activity
    fireEvent.keyDown(tasksTab, { key: "ArrowLeft" });
    expect(activityTab).toHaveFocus();
  });
}); 