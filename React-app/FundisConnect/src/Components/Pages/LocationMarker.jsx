import React from 'react';
import { Marker, useMap } from 'react-leaflet';

const LocationMarker = ({ position }) => {
  const map = useMap();
  map.flyTo(position, map.getZoom());

  return <Marker position={position}></Marker>;
};

export default LocationMarker;


