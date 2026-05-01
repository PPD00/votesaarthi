import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import { AuthProvider } from './context/AuthContext';
import { Loader2 } from 'lucide-react';

// Lazy load all pages for better initial bundle size
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const ProcessFlow = lazy(() => import('./pages/ProcessFlow'));
const ElectionData = lazy(() => import('./pages/ElectionData'));
const Assistant = lazy(() => import('./pages/Assistant'));
const Guide = lazy(() => import('./pages/Guide'));
const Timeline = lazy(() => import('./pages/Timeline'));
const BoothFinder = lazy(() => import('./pages/BoothFinder'));
const Helpline = lazy(() => import('./pages/Helpline'));

// Loading Fallback Component
const PageLoader = () => (
  <div className="page-loader">
    <Loader2 className="spin-icon" size={40} />
    <p>Loading Saarthi...</p>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/process" element={<ProcessFlow />} />
              <Route path="/data" element={<ElectionData />} />
              <Route path="/assistant" element={<Assistant />} />
              <Route path="/guide" element={<Guide />} />
              <Route path="/timeline" element={<Timeline />} />
              <Route path="/booth-finder" element={<BoothFinder />} />
              <Route path="/helpline" element={<Helpline />} />
            </Routes>
          </Suspense>
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
