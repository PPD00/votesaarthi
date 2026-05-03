import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import ProcessFlow from "../pages/ProcessFlow";

const renderWithRouter = (ui) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("ProcessFlow Component", () => {

  it("renders initial step (Register as Voter)", () => {
    renderWithRouter(<ProcessFlow />);

    expect(
      screen.getAllByText(/Register as Voter/i)[0]
    ).toBeInTheDocument();

    expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
  });

  it("navigates to next step on button click", async () => {
    renderWithRouter(<ProcessFlow />);

    fireEvent.click(screen.getByText(/Next Step/i));

    await waitFor(() => {
      expect(
        screen.getAllByText(/Verify Identity/i)[0]
      ).toBeInTheDocument();
    });
  });

  it("can go back to previous step", async () => {
    renderWithRouter(<ProcessFlow />);

    fireEvent.click(screen.getByText(/Next Step/i));

    await waitFor(() => {
      expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText(/Previous/i));

    await waitFor(() => {
      expect(
        screen.getAllByText(/Register as Voter/i)[0]
      ).toBeInTheDocument();
    });
  });

  it("shows completion banner on final step", async () => {
    renderWithRouter(<ProcessFlow />);

    for (let i = 0; i < 4; i++) {
      fireEvent.click(screen.getByText(/Next Step/i));
    }

    await waitFor(() => {
      expect(
        screen.getAllByText(/Track Results/i)[0]
      ).toBeInTheDocument();

      expect(
        screen.getByText(/You're informed and ready!/i)
      ).toBeInTheDocument();
    });
  });

});