import '@testing-library/jest-dom';
import { vi, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';

/* ---------------- CLEANUP ---------------- */
afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

/* ---------------- DOM FIXES ---------------- */
Element.prototype.scrollIntoView = vi.fn();

window.speechSynthesis = {
  speak: vi.fn(),
  cancel: vi.fn(),
  getVoices: vi.fn().mockReturnValue([]),
};

window.SpeechSynthesisUtterance = vi.fn();

global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}));

/* ---------------- ROUTER MOCK (CRITICAL FIX) ---------------- */
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
    BrowserRouter: ({ children }) => children,
  };
});

/* ---------------- FIREBASE MOCK ---------------- */
vi.mock('firebase/app', () => ({
  initializeApp: vi.fn(() => ({})),
}));

vi.mock('firebase/auth', () => ({
  getAuth: vi.fn(() => ({})),
  onAuthStateChanged: vi.fn((_, cb) => {
    cb(null);
    return () => {};
  }),
}));

vi.mock('firebase/firestore', () => ({
  getFirestore: vi.fn(() => ({})),
}));