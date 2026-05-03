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


import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import BoothFinder from '../pages/BoothFinder';
import { AuthProvider } from '../context/AuthContext';

// Mock the AuthContext values
vi.mock('../context/AuthContext', async () => {
  const actual = await vi.importActual('../context/AuthContext');
  return {
    ...actual,
    useAuth: () => ({
      userData: { state: 'Delhi', district: 'Central District' },
      currentUser: { uid: 'test-user' }
    })
  };
});

// Helper to render with Router and Provider
const renderWithProviders = (ui) => {
  return render(
    <BrowserRouter>
      {ui}
    </BrowserRouter>
  );
};

describe('BoothFinder Component', () => {
  it('renders correctly with initial state', () => {
    renderWithProviders(<BoothFinder />);
    expect(screen.getByText(/Booth Finder/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter Pincode or Locality/i)).toBeInTheDocument();
  });

  it('handles empty search input', () => {
    renderWithProviders(<BoothFinder />);
    const searchBtn = screen.getByText(/Find Booth/i);
    fireEvent.click(searchBtn);
    
    // Should not show searching state if empty
    expect(screen.queryByText(/Locating the nearest booth/i)).not.toBeInTheDocument();
  });

  it('shows searching state and then results for valid input', async () => {
    renderWithProviders(<BoothFinder />);
    const input = screen.getByPlaceholderText(/Enter Pincode or Locality/i);
    const searchBtn = screen.getByText(/Find Booth/i);

    fireEvent.change(input, { target: { value: 'Ghaziabad' } });
    fireEvent.click(searchBtn);

    expect(screen.getByText(/Locating the nearest booth/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText(/Govt Inter College/i)).toBeInTheDocument();
    }, { timeout: 2000 });

    expect(screen.getByText(/Ghaziabad, Central District, Delhi/i)).toBeInTheDocument();
  });

  it('shows interactive map button after search', async () => {
    renderWithProviders(<BoothFinder />);
    const input = screen.getByPlaceholderText(/Enter Pincode or Locality/i);
    fireEvent.change(input, { target: { value: 'Ghaziabad' } });
    fireEvent.click(screen.getByText(/Find Booth/i));

    await waitFor(() => {
      expect(screen.getByText(/Click to load interactive map/i)).toBeInTheDocument();
    }, { timeout: 2000 });
  });
});
