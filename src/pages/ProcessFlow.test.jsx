import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import ProcessFlow from '../pages/ProcessFlow';

const renderWithRouter = (ui) => render(<BrowserRouter>{ui}</BrowserRouter>);

describe('ProcessFlow Component', () => {
  it('renders initial step (Register as Voter)', () => {
    renderWithRouter(<ProcessFlow />);
    // Use getAllByText for labels that appear in multiple places
    expect(screen.getAllByText(/Register as Voter/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Step 1/i)).toBeInTheDocument();
  });

  it('navigates to next step on button click', () => {
    renderWithRouter(<ProcessFlow />);
    const nextBtn = screen.getByText(/Next Step/i);
    fireEvent.click(nextBtn);

    expect(screen.getAllByText(/Verify Identity/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/Step 2/i)).toBeInTheDocument();
  });

  it('can go back to previous step', () => {
    renderWithRouter(<ProcessFlow />);
    const nextBtn = screen.getByText(/Next Step/i);
    fireEvent.click(nextBtn); // To Step 2
    
    const prevBtn = screen.getByText(/Previous/i);
    fireEvent.click(prevBtn);

    expect(screen.getAllByText(/Register as Voter/i)[0]).toBeInTheDocument();
  });

  it('shows completion banner on final step', () => {
    renderWithRouter(<ProcessFlow />);
    
    // Click through to step 5
    for(let i=0; i<4; i++) {
      const nextBtn = screen.getByText(/Next Step/i);
      fireEvent.click(nextBtn);
    }

    expect(screen.getAllByText(/Track Results/i)[0]).toBeInTheDocument();
    expect(screen.getByText(/You're informed and ready!/i)).toBeInTheDocument();
  });
});
