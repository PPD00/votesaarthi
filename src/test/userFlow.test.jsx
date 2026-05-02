import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BoothFinder from '../pages/BoothFinder';
import { vi } from 'vitest';

// ✅ Mock Auth Context
vi.mock('../context/AuthContext', () => ({
  useAuth: () => ({
    userData: {
      district: 'Central District',
      state: 'Delhi'
    }
  })
}));

// ✅ Mock GoogleMap (VERY IMPORTANT)
vi.mock('../components/GoogleMap', () => ({
  default: ({ address }) => <div>Map for {address}</div>
}));

describe('User Flow Test - Secure Booth Finder', () => {

  test('user can search and see booth result', async () => {
    render(<BoothFinder />);

    const input = screen.getByPlaceholderText(/enter pincode or locality/i);
    fireEvent.change(input, { target: { value: 'Delhi' } });

    const button = screen.getByRole('button', { name: /find booth/i });
    fireEvent.click(button);

    // ✅ Wait for async result (IMPORTANT)
    await waitFor(() => {
      expect(
        screen.getByText(/government senior secondary school/i)
      ).toBeInTheDocument();
    }, { timeout: 2000 });

    // ✅ Check address appears
    expect(
      screen.getByText(/central district/i)
    ).toBeInTheDocument();
  });

  test('loading state appears during search', () => {
    render(<BoothFinder />);

    const input = screen.getByPlaceholderText(/enter pincode or locality/i);
    fireEvent.change(input, { target: { value: 'Delhi' } });

    const button = screen.getByRole('button', { name: /find booth/i });
    fireEvent.click(button);

    expect(
      screen.getByText(/locating the nearest booth/i)
    ).toBeInTheDocument();
  });

  test('map loads after result', async () => {
    render(<BoothFinder />);

    const input = screen.getByPlaceholderText(/enter pincode or locality/i);
    fireEvent.change(input, { target: { value: 'Delhi' } });

    const button = screen.getByRole('button', { name: /find booth/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/map for/i)   // ✅ matches mocked component
      ).toBeInTheDocument();
    }, { timeout: 2000 });
  });

  test('prevents empty search submission', () => {
    render(<BoothFinder />);

    const button = screen.getByRole('button', { name: /find booth/i });
    fireEvent.click(button);

    expect(
      screen.getByText(/enter your location or pincode/i)
    ).toBeInTheDocument();
  });

  test('sanitizes malicious input', async () => {
  render(<BoothFinder />);

  const input = screen.getByPlaceholderText(/enter pincode or locality/i);

  // malicious input
  fireEvent.change(input, {
    target: { value: '<script>alert(1)</script>' }
  });

  const button = screen.getByRole('button', { name: /find booth/i });
  fireEvent.click(button);

  // ✅ Ensure search does NOT proceed (no result shown)
  await waitFor(() => {
    expect(
      screen.queryByText(/government senior secondary school/i)
    ).not.toBeInTheDocument();
  });

  // ✅ Ensure raw script is NOT rendered anywhere
  expect(
    screen.queryByText(/script/i)
  ).not.toBeInTheDocument();
});

});