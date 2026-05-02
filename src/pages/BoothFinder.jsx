import React, { useState, Suspense, lazy, useEffect, useRef } from 'react';
import { Search, MapPin, Navigation, Info, Compass, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './boothFinder.css';

// Lazy load map safely
const GoogleMap = lazy(() => import('../components/GoogleMap'));

const BoothFinder = () => {
  const { userData } = useAuth() || {};

  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(''); // ✅ NEW

  const timeoutRef = useRef(null);

  const calculateScore = (booth, input) => {
  let score = 0;

  // ✅ Area match boost
  if (booth.area.toLowerCase().includes(input.toLowerCase())) {
    score += 50;
  }

  // ✅ Simulated distance (smaller is better)
  const distance = Math.random() * 5 + 0.5;

  // Lower distance → higher score
  score += (5 - distance) * 10;

  return { score, distance };
};

  // Cleanup timeout
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  // ✅ Input sanitization
  const sanitizeInput = (value) => {
    return value
      .replace(/[<>]/g, '')
      .replace(/[^a-zA-Z0-9\s,]/g, '')
      .trim()
      .slice(0, 100);
  };

  // ✅ Validation
  const isValidInput = (value) => {
    return value.length >= 2;
  };

  const boothDatabase = [
  {
    name: 'Government Senior Secondary School',
    area: 'Delhi',
    room: 'Room No. 4 (Ground Floor)',
    constituency: 'Constituency 24',
    lat: 28.6139,
    lng: 77.2090
  },
  {
    name: 'City Public School',
    area: 'Noida',
    room: 'Room No. 12 (1st Floor)',
    constituency: 'Constituency 18',
    lat: 28.5355,
    lng: 77.3910
  },
  {
    name: 'Community Hall Sector 62',
    area: 'Noida',
    room: 'Hall A',
    constituency: 'Constituency 19',
    lat: 28.6270,
    lng: 77.3649
  },
  {
    name: 'Govt Inter College',
    area: 'Ghaziabad',
    room: 'Room No. 2',
    constituency: 'Constituency 10',
    lat: 28.6692,
    lng: 77.4538
  }
];


  const handleSearch = (e) => {
    e.preventDefault();

    const cleanInput = sanitizeInput(search);

    // ❌ Invalid input
    if (!isValidInput(cleanInput)) {
      setError('Please enter a valid location (min 2 characters)');
      setResult(null);
      setShowMap(false);
      return;
    }

    // ❌ Extra malicious check (defense-in-depth)
    const isMalicious = /script|alert|onerror|onload/i.test(search);
    if (isMalicious) {
      setError('Invalid characters detected in input');
      setResult(null);
      setShowMap(false);
      return;
    }

    // ✅ Clear error
    setError('');

    setSearching(true);
    setShowMap(false);
    setResult(null);

    // Simulated API call
    timeoutRef.current = setTimeout(() => {
      const safeDistrict = userData?.district || 'Central District';
      const safeState = userData?.state || 'Delhi';

      const fullAddress = `${cleanInput}, ${safeDistrict}, ${safeState}`;

      const scoredBooths = boothDatabase.map((booth) => {
  const { score, distance } = calculateScore(booth, cleanInput);
  return { ...booth, score, distance };
});

// ✅ Sort by best score
scoredBooths.sort((a, b) => b.score - a.score);

// ✅ Pick best booth
const bestBooth = scoredBooths[0];



setResult({
  name: bestBooth.name,
  room: bestBooth.room,
  address: `${cleanInput}, ${safeDistrict}, ${safeState}`,
  distance: bestBooth.distance.toFixed(1),
  constituency: bestBooth.constituency,
  lat: bestBooth.lat,
  lng: bestBooth.lng
});

      setSearching(false);
      setShowMap(true);
    }, 1500);
  };

  const handleUseLocation = () => {
    setSearch('Near Me');
    setError('');
    handleSearch({ preventDefault: () => {} });
  };

  // Safe Google Maps URL
  const getSafeMapUrl = () => {
    if (!result?.address) return '#';
    return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(result.address)}`;
  };

  return (
    <div className="booth-finder container animate-fade-in">
      <header className="page-header">
        <h1>Booth Finder</h1>
        <p>Find your assigned polling station and get turn-by-turn directions.</p>
      </header>

      <div className="search-section">
        <form className="search-box" onSubmit={handleSearch}>
          <div className="input-group">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Enter Pincode or Locality..."
              value={search}
              onChange={(e) => {
                setSearch(sanitizeInput(e.target.value));
                setError(''); // ✅ clear error while typing
              }}
              maxLength={100}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={searching}
          >
            {searching ? (
              <Loader2 className="spin-icon" size={18} />
            ) : (
              'Find Booth'
            )}
          </button>
        </form>

        {/* ✅ ERROR UI */}
        {error && (
          <p className="error-text" style={{ color: 'red', marginTop: '8px' }}>
            {error}
          </p>
        )}

        <div className="current-location">
          <button className="btn-text" onClick={handleUseLocation}>
            <Compass size={16} /> Locate Nearest Booth
          </button>
        </div>
      </div>

      <div className="results-layout">
        <div className="booth-info-card">
          <div className="card-header">
            <h3>Polling Station Details</h3>
          </div>

          {!result && !searching && (
            <div className="empty-state">
              <MapPin size={40} />
              <p>Enter your location or pincode to find your polling booth.</p>
            </div>
          )}

          {searching && (
            <div className="searching-state">
              <Loader2 className="spin-icon" size={30} />
              <p>Locating the nearest booth in our records...</p>
            </div>
          )}

          {result && !searching && (
            <div className="booth-details">
              <div className="distance-badge">
                <Navigation size={14} /> {result.distance} km away
              </div>

              <div className="detail-item">
                <span className="label">Station Name</span>
                <p>{result.name}</p>
                <span className="sub-detail">{result.room}</span>
              </div>

              <div className="detail-item">
                <span className="label">Full Address</span>
                <p>{result.address}</p>
              </div>

              <div className="detail-item">
                <span className="label">Assembly Constituency</span>
                <p>{result.constituency}</p>
              </div>

              <div className="booth-actions">
                <a
                  href={getSafeMapUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary full-width"
                >
                  <Navigation size={18} /> Get Directions
                </a>
              </div>
            </div>
          )}
        </div>

        <div className="map-view-container">
          {!showMap ? (
            <div className="map-placeholder">
              <div className="map-inner">
                <MapPin size={40} className="map-pin-icon" />
                <p>Map view will load here</p>
                <button onClick={() => setShowMap(true)} className="btn-text">
                  <ExternalLink size={16} /> Click to load interactive map
                </button>
              </div>
            </div>
          ) : (
            <Suspense
              fallback={
                <div className="map-loading">
                  <Loader2 className="spin-icon" size={30} />
                  <p>Loading Google Maps...</p>
                </div>
              }
            >
              {result?.address && <GoogleMap address={result.address} />}
            </Suspense>
          )}
        </div>
      </div>

      <div className="info-note">
        <Info size={18} />
        <p>
          Polling booth assignments are based on the latest Electoral Roll.
          Please verify your EPIC number for final confirmation.
        </p>
      </div>
    </div>
  );
};

export default BoothFinder;