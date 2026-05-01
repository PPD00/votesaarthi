import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Helpline from '../pages/Helpline';

describe('Helpline Component', () => {
  it('renders all common issues', () => {
    render(<Helpline />);
    expect(screen.getByText(/Where is my polling booth\?/i)).toBeInTheDocument();
  });

  it('toggles issue details on click', () => {
    render(<Helpline />);
    const issueHeader = screen.getByText(/What are my voter rights\?/i);
    fireEvent.click(issueHeader);
    expect(screen.getByText(/Resolution Steps:/i)).toBeInTheDocument();
  });

  /*
  it('triggers text-to-speech when clicking speaker icon', () => {
    const speakSpy = vi.spyOn(window.speechSynthesis, 'speak');
    render(<Helpline />);
    
    const speakBtns = screen.getAllByTitle(/Read Aloud/i);
    fireEvent.click(speakBtns[0]);

    expect(speakSpy).toHaveBeenCalled();
  });
  */

  it('contains the correct toll-free number', () => {
    render(<Helpline />);
    expect(screen.getByText('1950')).toBeInTheDocument();
  });
});
