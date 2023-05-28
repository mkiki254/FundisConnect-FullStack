import { useEffect, useState } from "react";
import Map from '../Map';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function UpdateProfile(){
    const [location, setLocation] = useState([-1.292066, 36.821945]);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [specialization, setSpecialization] = useState('');

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
    };

    function handleSubmit(e){
        e.preventDefault()
        const newFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [location.lng , location.lat ]
            },
            properties: {
                first_name: firstName,
                last_name: lastName,
                specialization: [specialization,]
            }
        }

        client.post("/api/artisan/profile/personal-info/",
        newFeature).then(res => {
            setLocation(null)
            setFirstName("")
            setLastName("")
            setSpecialization("")
            console.log('Response:', res.data)
        }).catch(error => {
            console.log('Error:', error)
        })
    }
   
    return (
    <div>
        <form onSubmit={e => handleSubmit(e)}>
            <h2>Location Selection</h2>
            <Map location={location} onLocationChange={handleLocationChange} />
            <div>
            <label>
                First Name:

                {/* <Form.Control type="email" placeholder="Enter email" value={email} onChange={e => setEmail(e.target.value)} /> */}

                <input type="text" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </label>
            </div>
            <div>
            <label>
                Last Name:
                <input type="text" value={lastName} onChange={e => setLastName(e.target.value)} />
            </label>
            </div>
            <div>
            <label>
                Specialization:
                <input type="text" value={specialization} onChange={e => setSpecialization(e.target.value)} />
            </label>
            </div>
            <button type="submit">Submit</button>
        </form>
    </div>
    );
}