import React, { useState, Suspense, lazy } from 'react';
import { Search, MapPin, Navigation, Info, Compass, Loader2, ExternalLink } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './boothFinder.css';

// Lazy load the Map component
const GoogleMap = lazy(() => import('../components/GoogleMap'));

const BoothFinder = () => {
  const { userData } = useAuth();
  const [search, setSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [result, setResult] = useState(null);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!search.trim()) return;

    setSearching(true);
    setShowMap(false);
    
    // Simulation of booth lookup logic
    setTimeout(() => {
      setResult({
        name: 'Government Senior Secondary School',
        room: 'Room No. 4 (Ground Floor)',
        address: `${search}, ${userData?.district || 'Central District'}, ${userData?.state || 'Delhi'}`,
        distance: (Math.random() * 5 + 0.5).toFixed(1),
        constituency: 'Constituency 24',
        lat: 28.6139,
        lng: 77.2090
      });
      setSearching(false);
      setShowMap(true); // Automatically open map on search
    }, 1500);
  };

  const handleUseLocation = () => {
    setSearch('Near Me');
    handleSearch({ preventDefault: () => {} });
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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary" disabled={searching}>
            {searching ? <Loader2 className="spin-icon" size={18} /> : 'Find Booth'}
          </button>
        </form>
        
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
                  href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(result.address)}`} 
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
            <Suspense fallback={
              <div className="map-loading">
                <Loader2 className="spin-icon" size={30} />
                <p>Loading Google Maps...</p>
              </div>
            }>
              <GoogleMap address={result?.address} />
            </Suspense>
          )}
        </div>
      </div>

      <div className="info-note">
        <Info size={18} />
        <p>Polling booth assignments are based on the latest Electoral Roll. Please verify your EPIC number for final confirmation.</p>
      </div>
    </div>
  );
};

export default BoothFinder;
