import { useEffect, useState } from 'react';

const CalculateDistance = ({ startLatLng, endLatLng, locate }) => {
    const [routeData, setRouteData] = useState(null);

    // console.log(startLatLng, endLatLng)
  
    useEffect(() => {
      fetchRoute();
    }, [locate]);
  
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
            console.log('Error fetching route');
          }
        } catch (error) {
          console.log(error);
        }
      }
    
    if (routeData) {
    const distance = (routeData.features[0].properties.summary.distance)/1000;
    return distance;
    }
    return null;
    
}

export default CalculateDistance