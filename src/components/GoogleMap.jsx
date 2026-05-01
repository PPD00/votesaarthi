import React from 'react';

const GoogleMap = ({ address }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  
  if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
    return (
      <div className="map-fallback-ui">
        <div className="fallback-card">
          <h3>Map Configuration Required</h3>
          <p>To view the interactive polling booth map, please add your Google Maps API key to the <code>.env</code> file.</p>
          <div className="env-tip">
            <code>VITE_GOOGLE_MAPS_API_KEY=your_actual_key</code>
          </div>
          <p className="address-preview"><strong>Station Address:</strong> {address}</p>
        </div>
      </div>
    );
  }

  const encodedAddress = encodeURIComponent(address || 'Election Commission of India, New Delhi');
  const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodedAddress}&zoom=15`;

  return (
    <div className="google-map-wrapper animate-fade-in" style={{ width: '100%', height: '100%', minHeight: '400px' }}>
      <iframe
        title="Polling Booth Location"
        width="100%"
        height="100%"
        style={{ border: 0, borderRadius: '20px' }}
        src={mapUrl}
        allowFullScreen
        loading="lazy"
      ></iframe>
    </div>
  );
};

export default GoogleMap;
