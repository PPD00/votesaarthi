import React, { useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DirectionsRenderer,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "400px",
  borderRadius: "20px",
};

const defaultCenter = {
  lat: 28.6139,
  lng: 77.2090,
};

const MapComponent = ({ address }) => {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const [boothLocation, setBoothLocation] = useState(defaultCenter);
  const [userLocation, setUserLocation] = useState(null);
  const [directions, setDirections] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: apiKey,
  });

  // 📍 Get booth location
  useEffect(() => {
    if (!window.google || !address) return;

    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ address }, (results, status) => {
      if (status === "OK" && results[0]) {
        const loc = results[0].geometry.location;
        setBoothLocation({
          lat: loc.lat(),
          lng: loc.lng(),
        });
      }
    });
  }, [address]);

  // 📍 Get user location
  const handleMyLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const userLoc = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };

      console.log("User location:", userLoc);
      console.log("Booth location:", boothLocation);

      setUserLocation(userLoc);

      // Wait a bit to ensure booth location is ready
      setTimeout(() => {
        const directionsService = new window.google.maps.DirectionsService();

        directionsService.route(
          {
            origin: userLoc,
            destination: boothLocation,
            travelMode: window.google.maps.TravelMode.DRIVING,
          },
          (result, status) => {
            console.log("Directions status:", status);

            if (status === "OK") {
              setDirections(result);
            } else {
              alert("Route not found: " + status);
            }
          }
        );
      }, 500);
    },
    () => alert("Unable to fetch location")
  );
};

  if (!apiKey) return <p>API key missing</p>;
  if (!isLoaded) return <p>Loading map...</p>;

  return (
    <div>
      <button
        onClick={handleMyLocation}
        style={{
          marginBottom: "12px",
          padding: "10px 16px",
          borderRadius: "10px",
          border: "none",
          background: "linear-gradient(135deg, #2563eb, #1e40af)",
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
        }}
      >
        📍 Find My Route to Booth
      </button>

      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation || boothLocation}
        zoom={13}
      >
        {/* Booth */}
        <Marker position={boothLocation} label="Booth" />

        {/* User */}
        {userLocation && <Marker position={userLocation} label="You" />}

        {/* Route */}
        {directions && <DirectionsRenderer directions={directions} />}
      </GoogleMap>
    </div>
  );
};

export default React.memo(MapComponent);