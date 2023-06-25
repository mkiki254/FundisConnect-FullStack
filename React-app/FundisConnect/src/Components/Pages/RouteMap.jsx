import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../../Styles/Map.css"

export default function RouteMap() {
  const [startLatLng, setStartLatLng] = useState([-1.2847345, 36.83129903295148]);
  const [endLatLng, setEndLatLng] = useState([-1.182345731668794, 36.807242]);
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRoute();
  }, []);

  async function fetchRoute() {
    const apiKey = '5b3ce3597851110001cf62481d880483044249398760d0ebddfb5f05';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLatLng[1]},${startLatLng[0]}&end=${endLatLng[1]},${endLatLng[0]}`;

    try {
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setRouteData(data);
      } else {
        setError('Error fetching route');
      }
    } catch (error) {
      setError('Error fetching route');
    }
  }

  function renderRoute() {
    if (error) {
      return <p>{error}</p>;
    }

    if (!routeData) {
      return null;
    }

    const coordinates = routeData.features[0].geometry.coordinates.map(([lng, lat]) => [lat, lng]);

    return <Polyline positions={coordinates} />;
  }

  function getDistance() {
    if (routeData) {
      const distance = (routeData.features[0].properties.summary.distance)/1000;
      return distance;
    }
    return null;
  }

  return (
    <section className='map-component'>
        <h1>Directions</h1>
        <h3>Routing Distance: {getDistance()} kilometers</h3>
        <div className='map'>
            <MapContainer center={startLatLng} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={startLatLng}>
                <Popup>Start Location</Popup>
            </Marker>
            <Marker position={endLatLng}>
                <Popup>End Location</Popup>
            </Marker>
            {renderRoute()}
        </MapContainer>
        </div>
    </section>
  );
}
