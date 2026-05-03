import React, { useState, useEffect, useCallback } from "react";
import {
  GoogleMap,
  useLoadScript,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { Loader2, MapPin, Navigation, AlertTriangle } from "lucide-react";

/**
 * GoogleMap Component
 * 
 * Safely loads Google Maps JavaScript API and handles Geocoding/Directions.
 * Fixes: "window.google.maps.Geocoder is not a constructor" by ensuring script is loaded.
 */

const containerStyle = {
  width: "100%",
  height: "450px",
  borderRadius: "16px",
  boxShadow: "0 10px 25px rgba(0,0,0,0.1)",
};

const defaultCenter = {
  lat: 28.6139, // New Delhi
  lng: 77.2090,
};

const MapComponent = ({ address }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: apiKey || "",
    libraries: ["places"], // Load additional libraries if needed
  });

  const [boothLocation, setBoothLocation] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // 📍 Geocode Address to Coordinates
  const geocodeAddress = useCallback(() => {
    if (!isLoaded || !address || !window.google) return;

    setIsGeocoding(true);
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      setIsGeocoding(false);
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        setBoothLocation({
          lat: loc.lat(),
          lng: loc.lng(),
        });
      } else {
        console.error("Geocoding failed:", status);
      }
    });
  }, [isLoaded, address]);

  useEffect(() => {
    geocodeAddress();
  }, [geocodeAddress]);

  // 📍 Get user location and find route
  const handleMyLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLoc = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(userLoc);

        // Find directions
        if (window.google) {
          const directionsService = new window.google.maps.DirectionsService();
          directionsService.route(
            {
              origin: userLoc,
              destination: boothLocation,
              travelMode: window.google.maps.TravelMode.DRIVING,
            },
            (result, status) => {
              if (status === "OK") {
                setDirections(result);
              } else {
                alert("Could not calculate directions: " + status);
              }
            }
          );
        }
      },
      () => alert("Unable to retrieve your location")
    );
  };

  if (loadError) {
    return (
      <div className="map-error">
        <AlertTriangle color="#ef4444" />
        <p>Map failed to load. Check API key or connection.</p>
      </div>
    );
  }

  if (!apiKey) {
    return (
      <div className="map-error">
        <p>Google Maps API Key is missing.</p>
      </div>
    );
  }

  if (!isLoaded || isGeocoding) {
    return (
      <div className="map-loading" style={containerStyle}>
        <Loader2 className="spin" size={32} />
        <p>Loading Map & Locating Booth...</p>
      </div>
    );
  }

  return (
    <div className="google-map-wrapper">
      <button
        onClick={handleMyLocation}
        className="btn-route"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '1rem',
          padding: '0.8rem 1.2rem',
          background: 'var(--navy)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600'
        }}
      >
        <Navigation size={18} /> Get Route to Booth
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || boothLocation}
        zoom={14}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
        }}
      >
        {/* Booth Marker */}
        <Marker 
          position={boothLocation} 
          title="Your Polling Booth"
          icon={{
            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
          }}
        />

        {/* User Marker */}
        {userLocation && (
          <Marker 
            position={userLocation} 
            title="You are here"
            icon={{
              url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
            }}
          />
        )}

        {/* Directions Path */}
        {directions && (
          <DirectionsRenderer 
            directions={directions}
            options={{
              polylineOptions: {
                strokeColor: "#2563eb",
                strokeWeight: 5
              }
            }}
          />
        )}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapComponent);