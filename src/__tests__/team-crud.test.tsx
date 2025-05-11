import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import '@testing-library/jest-dom';
import App from "../App";
import Team from '../pages/Team';

jest.mock("../integrations/supabase/client", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: { id: "1", full_name: "Test User" } }),
      insert: jest.fn().mockResolvedValue({ error: null }),
      update: jest.fn().mockResolvedValue({ error: null }),
      delete: jest.fn().mockResolvedValue({ error: null }),
    })),
  },
}));

describe("Team CRUD", () => {
  it("creates, edits, and deletes a team member", async () => {
    render(
      <MemoryRouter initialEntries={["/team"]}>
        <App />
      </MemoryRouter>
    );
    // Create
    const createBtn = screen.getByRole("button", { name: /create contact/i });
    await userEvent.click(createBtn);
    await userEvent.type(screen.getByPlaceholderText(/first name/i), "Jane");
    await userEvent.type(screen.getByPlaceholderText(/last name/i), "Doe");
    await userEvent.click(screen.getByRole("button", { name: /create$/i }));
    await waitFor(() => expect(screen.getByText(/jane doe/i)).toBeInTheDocument());
    // Edit
    await userEvent.click(screen.getByText(/jane doe/i));
    await userEvent.type(screen.getByPlaceholderText(/first name/i), "Janet");
    await userEvent.click(screen.getByRole("button", { name: /save/i }));
    await waitFor(() => expect(screen.getByText(/janet doe/i)).toBeInTheDocument());
    // Delete
    await userEvent.click(screen.getByRole("button", { name: /delete/i }));
    await waitFor(() => expect(screen.queryByText(/janet doe/i)).not.toBeInTheDocument());
  });

  it('renders team list and allows adding a member', () => {
    render(<Team />);
    expect(screen.getByText(/team/i)).toBeInTheDocument();
    fireEvent.click(screen.getByText(/add member/i));
    expect(screen.getByPlaceholderText(/name/i)).toBeInTheDocument();
  });
}); 