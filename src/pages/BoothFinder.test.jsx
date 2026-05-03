import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll, beforeEach } from "vitest";
import BoothFinder from "../pages/BoothFinder";

/* ---------------- GOOGLE MOCK ---------------- */

beforeAll(() => {
  window.google = {
    maps: {
      Geocoder: class {
        geocode(_, callback) {
          callback(
            [
              {
                geometry: {
                  location: {
                    lat: () => 28.6139,
                    lng: () => 77.2090,
                  },
                },
              },
            ],
            "OK"
          );
        }
      },
    },
  };
});

/* ---------------- AUTH MOCK ---------------- */

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    userData: { state: "Delhi", district: "Central District" },
    currentUser: { uid: "test-user" },
  }),
}));

/* ---------------- CLEAN SETUP ---------------- */

const renderUI = () => {
  return render(<BoothFinder />);
};

describe("BoothFinder Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders correctly with initial state", () => {
    renderUI();

    expect(screen.getByText(/Booth Finder/i)).toBeInTheDocument();
  });

  it("handles empty search input", () => {
    renderUI();

    fireEvent.click(screen.getByRole("button", { name: /find booth/i }));

    expect(screen.queryByText(/Locating/i)).not.toBeInTheDocument();
  });

  it("shows search flow and results", async () => {
    renderUI();

    const input = screen.getByPlaceholderText(/enter pincode or locality/i);
    const button = screen.getByRole("button", { name: /find booth/i });

    fireEvent.change(input, { target: { value: "Ghaziabad" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/central district/i)
      ).toBeInTheDocument();
    }, { timeout: 5000 });
  });
});