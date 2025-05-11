import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import App from "../App";

jest.mock("../integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
      insert: jest.fn().mockResolvedValue({ error: null }),
      single: jest.fn().mockResolvedValue({ data: { id: "1", full_name: "Test User" } }),
    })),
  },
}));

describe("NoteDrawer", () => {
  it("opens, submits, and closes, updating activity feed", async () => {
    render(
      <MemoryRouter initialEntries={["/team/123"]}>
        <App />
      </MemoryRouter>
    );
    // Open NoteDrawer
    const addBtn = screen.getByRole("button", { name: /add/i });
    await userEvent.click(addBtn);
    // Type note
    await userEvent.type(screen.getByPlaceholderText(/write your note/i), "Test note");
    // Submit
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    // Wait for note to appear in activity feed
    await waitFor(() => expect(screen.getByText(/test note/i)).toBeInTheDocument());
    // Drawer should close
    expect(screen.queryByPlaceholderText(/write your note/i)).not.toBeInTheDocument();
  });
}); 