import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import "../../Styles/Map.css"
import client from '@/api'

export default function RouteMap(props) {
  const [routeData, setRouteData] = useState(null);
  const [error, setError] = useState(null);
  const startLatLng = props.startLatLng
  const endLatLng = props.endLatLng

  useEffect(() => {
    fetchRoute();
  }, []);

    async function fetchRoute() {
    try {
      const response = await client.get('/api/route/', {
        params: {
          from: `${startLatLng[0]},${startLatLng[1]}`,
          to: `${endLatLng[0]},${endLatLng[1]}`,
        },
      });
      setRouteData(response.data);
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
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
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
