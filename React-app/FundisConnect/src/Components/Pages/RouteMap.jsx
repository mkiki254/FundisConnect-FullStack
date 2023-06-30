import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../../Styles/Map.css"

export default function RouteMap(props) {
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const startLatLng = props.startLatLng
  const endLatLng = props.endLatLng

  useEffect(() => {
    fetchRoute();
  }, []);

  async function fetchRoute() {
    const apiKey = '5b3ce3597851110001cf62481d880483044249398760d0ebddfb5f05';
    const url = `https://api.openrouteservice.org/v2/directions/driving-car?api_key=${apiKey}&start=${startLatLng[0]},${startLatLng[1]}&end=${endLatLng[0]},${endLatLng[1]}`;
    // const url = `http://localhost:8080/ors/v2/directions/driving-car?&start=${startLatLng[0]},${startLatLng[1]}&end=${endLatLng[0]},${endLatLng[1]}`;

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
      const distance = Math.round((routeData.features[0].properties.summary.distance)/1000);
      return distance;
    }
    return null;
  }

  return (
    <section className='map-component'>
        <div className='d-flex'>
          <p style={{marginRight: "20px"}}>Distance from your location:</p> 
          <h5>{getDistance()} kilometers</h5>
        </div>
        <div className='map'>
            <MapContainer center={[startLatLng[1], startLatLng[0]]} zoom={13}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <Marker position={[startLatLng[1], startLatLng[0]]}>
                <Popup>Start Location</Popup>
                <Tooltip>"Your location"</Tooltip>
            </Marker>
            <Marker position={[endLatLng[1], endLatLng[0]]}>
                <Popup>End Location</Popup>
                <Tooltip>"Job location"</Tooltip>
            </Marker>
            {renderRoute()}
        </MapContainer>
        </div>
    </section>
  );
}
