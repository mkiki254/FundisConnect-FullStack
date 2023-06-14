import { Form, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import ProfileCard from './JobRequests/ProfileCard'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function JobRequests(){
    const [selectedService, setSelectedService] = useState('');
    const [artisanData, setArtisanData] = useState([])

    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/").then(
           res => {
            const dta = res.data.features
            setArtisanData(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [selectedService])

    const handleSelectChange = (event) => {
      setSelectedService(event.target.value);
    };

    const artisanDataElements = artisanData.map(artisan => {
        if(artisan.properties.specialization == selectedService){
          return(
            <>
              < ProfileCard
                profilePic={artisan.properties.profile_picture}
                firstname = {artisan.properties.first_name}
                lastname = {artisan.properties.last_name}
                />
            </>
          )
        }
    })
  
    return(
        <>
        <div className="d-flex justify-content-center align-items-center flex-column selectedService">
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
            {artisanDataElements}
        </div>
        </>
    )
}