import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Helpline from '../pages/Helpline';

describe('Helpline Component', () => {

  it('renders helpline heading', () => {
    render(<Helpline />);
    expect(screen.getByText(/Help & Support/i)).toBeInTheDocument();
  });

  it('renders at least one issue from data', () => {
    render(<Helpline />);
    const issues = screen.getAllByRole('heading', { level: 3 });
    expect(issues.length).toBeGreaterThan(0);
  });

  it('toggles issue details on click', () => {
    render(<Helpline />);
    const issues = screen.getAllByRole('heading', { level: 3 });

    fireEvent.click(issues[0]);

    expect(screen.getByText(/Resolution Steps:/i)).toBeInTheDocument();
  });

  it('contains the correct toll-free number', () => {
    render(<Helpline />);
    expect(screen.getByText('1950')).toBeInTheDocument();
  });

});