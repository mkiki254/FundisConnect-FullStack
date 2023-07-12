import { Form, Button } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ProfileCard from './JobRequests/ProfileCard'
import Map from '../Map'
import CalculateDistance from '../CalculateDistance'


axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

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
    
    // console.log(artisanData)
    // console.log(locate)

    const location = [36.8219, -1.2921]
    
    const modifiedArtisanData = artisans.map(artisan => {
      const startLatLng = artisan.geometry.coordinates;
      const endLatLng = locate ? [locate.x, locate.y] : location
      const distance = Math.round(CalculateDistance({ startLatLng, endLatLng, locate }));
      return {
        ...artisan,
        distance: distance
      }
    });    

    const SortedArtisanData = findArtisans && locate && modifiedArtisanData.map((artisan) => artisan).sort((a, b) => a.distance - b.distance)
    // console.log(SortedArtisanData)

    const artisanDataElements = findArtisans && locate && SortedArtisanData && SortedArtisanData.map(artisan => {
        if(artisan.properties.specialization == selectedService){
          return(
            <>
              < ProfileCard
                key = {artisan.id}
                id = {artisan.id}
                profilePic={artisan.properties.profile_picture}
                firstname = {artisan.properties.first_name}
                lastname = {artisan.properties.last_name}
                distance = {artisan.distance}
                />
            </>
          )
        }
    })
  
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