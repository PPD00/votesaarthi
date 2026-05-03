import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { vi, describe, test, expect, beforeEach, afterEach } from "vitest";
import BoothFinder from "../pages/BoothFinder";

/* ---------------- MOCKS ---------------- */

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    userData: {
      district: "Central District",
      state: "Delhi",
    },
  }),
}));

vi.mock("../components/GoogleMap", () => ({
  default: () => <div data-testid="map">Mock Map Loaded</div>,
}));

/* ---------------- TEST SUITE ---------------- */

describe("BoothFinder User Flow (Production Tests)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const setup = () => {
    render(<BoothFinder />);
    return {
      input: screen.getByPlaceholderText(/enter pincode or locality/i),
      button: screen.getByRole("button", { name: /find booth/i }),
    };
  };

  test("renders search input correctly", () => {
    const { input } = setup();
    expect(input).toBeInTheDocument();
  });

  test("handles valid search flow", async () => {
    const { input, button } = setup();

    fireEvent.change(input, { target: { value: "Delhi" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/central district/i)
      ).toBeInTheDocument();

      expect(
        screen.getByText(/government senior secondary school/i)
      ).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test("shows loading state during search", () => {
    const { input, button } = setup();

    fireEvent.change(input, { target: { value: "Delhi" } });
    fireEvent.click(button);

    expect(
      screen.getByText(/locating the nearest booth/i)
    ).toBeInTheDocument();
  });

  test("prevents empty submission", () => {
    const { button } = setup();

    fireEvent.click(button);

    expect(
      screen.getByText(/enter your location or pincode/i)
    ).toBeInTheDocument();
  });

  test("renders map after successful search", async () => {
    const { input, button } = setup();

    fireEvent.change(input, { target: { value: "Delhi" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId("map")).toBeInTheDocument();
    }, { timeout: 5000 });
  });

  test("sanitizes malicious input safely", async () => {
    const { input, button } = setup();

    fireEvent.change(input, {
      target: { value: "<script>alert('hack')</script>" },
    });

    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.queryByText(/government senior secondary school/i)
      ).not.toBeInTheDocument();
    }, { timeout: 5000 });
  });
});