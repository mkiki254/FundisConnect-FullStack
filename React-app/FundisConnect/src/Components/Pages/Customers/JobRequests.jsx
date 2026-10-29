import { Form, Button } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import client from '@/api'
import ProfileCard from './JobRequests/ProfileCard'
import Map from '../Map'


export default function JobRequests(props){
    const [selectedService, setSelectedService] = useState('');
    const [locate, setLocate] = useState(null)
    const [viewLocation, setViewLocation] = useState(false)
    const [findArtisans, setFindArtisans] = useState(false)
    const artisans = props.artisans

    const handleSelectChange = (event) => {
      setSelectedService(event.target.value);
    };

    const handleLocationChange = useCallback(newLocate => {
        setLocate(newLocate);
    }, []);

    const [distances, setDistances] = useState({})   // artisan id -> driving distance in km

    // Redirecting users after logging
    // timeout of 2 seconds to allow reading success message
    useEffect(() => {
        let timeoutId;
    
        if (selectedService && locate) {
          timeoutId = setTimeout(() => {
            setViewLocation(true);
          }, 3000);
        }
    
        return () => {
          clearTimeout(timeoutId);
        };
      }, [selectedService, locate]);  
      
      
      function handleFindArtisans(){
        setFindArtisans(true)
      }

    // artisans of the chosen trade. It accepts at most 50 destinations per request.
    useEffect(() => {
        if (!findArtisans || !locate) return;
        const matching = artisans
            .filter(artisan => artisan.properties.specialization === selectedService)
            .slice(0, 50);
        if (matching.length === 0) return;

        let ignore = false;   // drop an answer that arrives after the inputs changed
        client.post('/api/route/distances/', {
            from: [locate.x, locate.y],
            to: matching.map(artisan => artisan.geometry.coordinates),
        })
            .then(response => {
                if (ignore) return;
                const byArtisan = {};
                matching.forEach((artisan, index) => {
                    byArtisan[artisan.id] = response.data.distances_km[index];
                });
                setDistances(byArtisan);
            })
            .catch(() => { if (!ignore) setDistances({}); });   // the list still shows, without distances
        return () => { ignore = true; };
    }, [findArtisans, locate, selectedService, artisans]);

    const sortedArtisans = artisans
        .filter(artisan => artisan.properties.specialization === selectedService)
        .map(artisan => {
            const km = distances[artisan.id];
            return { ...artisan, distance: km == null ? null : Math.round(km * 10) / 10 };
        })
        // nearest first; artisans with no known distance go last
        .sort((a, b) => (a.distance ?? Infinity) - (b.distance ?? Infinity));

    const artisanDataElements = findArtisans && locate && sortedArtisans.map(artisan => (
        <ProfileCard
            key={artisan.id}
            id={artisan.id}
            profilePic={artisan.properties.profile_picture}
            firstname={artisan.properties.first_name}
            lastname={artisan.properties.last_name}
            distance={artisan.distance}
        />
    ));
  
    return(
        <>
        {(!selectedService || !locate || !viewLocation || !findArtisans) && 
        (<div className="d-flex justify-content-center align-items-center flex-column selectedService">
            <h1>Make Job Requests</h1>
            <Form.Label>Select Service</Form.Label>
            <Form.Select 
            value={selectedService} 
            onChange={handleSelectChange}>
                <option value="">-- Choose --</option>
                <option value="plumber">Plumber</option>
                <option value="electrician">Electrician</option>
                <option value="carpenter">Carpenter</option>
                <option value="mason">Mason</option>
                <option value="tiling">Tiling</option>
                <option value="painter">Painter</option>
            </Form.Select>
            <Form.Label>Search your Location</Form.Label>
            <div>
                <Map location={locate} onLocationChange={handleLocationChange} />
            </div>
            <Button onClick={handleFindArtisans}>Find Artisans</Button>                
        </div>)}
        {selectedService && locate && viewLocation && findArtisans && 
        (<div className="text-center">
          <h1>Artisan profiles</h1>
        </div>)}
        {artisanDataElements}
        </>
    )
}