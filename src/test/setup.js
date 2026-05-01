import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock window.speechSynthesis
window.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([]),
};

const MockUtterance = vi.fn().mockImplementation((text) => ({
  text,
  onend: null,
  onstart: null,
}));

window.SpeechSynthesisUtterance = MockUtterance;
global.SpeechSynthesisUtterance = MockUtterance;

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));
