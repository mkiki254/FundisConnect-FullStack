import { Form, Button } from 'react-bootstrap'
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import ProfileCard from './JobRequests/ProfileCard'
import Map from '../Map'
import RouteMap from '../RouteMap'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

// The routing map will be used by the artisan to find their way to the
// customers place

// The customer side will just need calculating distance between their 
// job locations and artisans and find the artisans nearest to them.

export default function JobRequests(){
    const [selectedService, setSelectedService] = useState('');
    const [artisanData, setArtisanData] = useState([])
    const [locate, setLocate] = useState(null)
   
    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/").then(
           res => {
            const dta = res.data.features
            setArtisanData(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [selectedService])

    const handleSelectChange = (event) => {
      setSelectedService(event.target.value);
    };

    const handleLocationChange = useCallback(newLocate => {
        setLocate(newLocate);
    }, []);

    
    // console.log(artisanData)
    // console.log(locate)

    const artisanDataElements = locate && artisanData.map(artisan => {
        if(artisan.properties.specialization == selectedService){
          return(
            <>
              < ProfileCard
                key = {artisan.id}
                id = {artisan.id}
                profilePic={artisan.properties.profile_picture}
                firstname = {artisan.properties.first_name}
                lastname = {artisan.properties.last_name}
                startLatLng = {[locate.x, locate.y]}
                endLatLng = {artisan.geometry.coordinates}
                />
            </>
          )
        }
    })
  
    return(
        <>
        {(!selectedService || !locate) && 
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
                {/* <RouteMap /> */}
            </div>                
        </div>)}
        {selectedService && locate && 
        (<div className="text-center">
          <h1>Artisan profiles</h1>
        </div>)}
        {artisanDataElements}
        </>
    )
}