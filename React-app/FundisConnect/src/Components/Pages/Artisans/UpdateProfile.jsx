import { useState } from "react";
import { Button, Form, Alert } from 'react-bootstrap'
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
    const [error, setError] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const handleLocationChange = (newLocation) => {
        setLocation(newLocation);
    };

    function handleSubmit(e){
        e.preventDefault()
        if((location.lng == null) || (location.lat == null)){
            setError(true)
            setErrorMsg("The location has not been selected")
        }else{
            setError(false)
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
            }).catch(error => {
                const msg = error.data.join(", ");
                setError(true);
                setErrorMsg(msg);
            })
        }
    }
   
    return (
        <>
        <h3 className="form-title">Update Profile</h3>
        <Form className="update-profile" onSubmit={e => handleSubmit(e)}>
            <div className="d-flex justify-content-center align-items-center">
                {error && <Alert variant="danger" className="msg-alert">{errorMsg}</Alert>}
            </div>

            <Map location={location} onLocationChange={handleLocationChange} />

            <Form.Group className="mb-3 centering flex-column" controlId="formBasicFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter firstname" value={firstName} onChange={e => setFirstName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3 centering flex-column" controlId="formBasicLastName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter lastname" value={lastName} onChange={e => setLastName(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3 centering flex-column" controlId="formBasicSpecialization">
                <Form.Label>Specialization</Form.Label>
                <Form.Control type="text" placeholder="Enter specialization" value={specialization} onChange={e => setSpecialization(e.target.value)} />
            </Form.Group>

            <div className="centering">
                <div className="form-submit">
                    <Button variant="primary" type="submit">Submit Details</Button>
                </div>
            </div>
        </Form>
        </>
    );
}