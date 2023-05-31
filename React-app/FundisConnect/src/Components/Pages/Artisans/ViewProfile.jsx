import axios from 'axios'
import Map from '../Map'
import { useState } from 'react'
import { Button, Form, Alert } from 'react-bootstrap'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function ViewProfile(props){
    const [editProfile, setEditProfile] = useState(false)
    const [location, setLocation] = useState([props.lat, props.lng])
    const [firstName, setFirstName] = useState(props.first_name);
    const [lastName, setLastName] = useState(props.last_name);
    const [specialization, setSpecialization] = useState(props.specialization);
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [submitted, setSubmitted] = useState(false)


    function handleLocationChange(newLocation){
        setLocation(newLocation)
    }


    function handleSubmit(e){
        e.preventDefault()
        setError(false)
        setSuccess(false)
        const newFeature = {
            type: "Feature",
            geometry: {
                type: "Point",
                coordinates: [location.lng , location.lat ]
            },
            properties: {
                first_name: firstName,
                last_name: lastName,
                specialization: specialization
            }
        }

        client.put("/api/artisan/profile/personal-info/detail/",
        newFeature).then(res => {
            setSuccess(true)
            setSuccessMsg("Your details have been updated successfully")
            setSubmitted(true)
            setLocation(null)
            setFirstName("")
            setLastName("")
            setSpecialization("")
        }).catch(error => {
            console.log(error.response)
            const msg = error.response.data.join(", ");
            setError(true);
            setErrorMsg(msg);
        })            
    }

    function handleEditProfile(){
        setEditProfile(true)
    }
    if(editProfile){
        if(submitted){
            return(
                <>
                <div className="d-flex justify-content-center align-items-center">
                    {success && <Alert variant="success" className="msg-alert">{successMsg}</Alert>}
                </div>
                </>
            )
        }
       return(
        <>
            <h3 className="form-title">Edit Profile</h3>
            <Form className="update-profile" onSubmit={e => handleSubmit(e)}>
                <div className="d-flex justify-content-center align-items-center">
                    {error && <Alert variant="danger" className="msg-alert">{errorMsg}</Alert>}
                    {success && <Alert variant="success" className="msg-alert">{successMsg}</Alert>}
                </div>
                <div className="d-flex justify-content-center align-items-center">
                    <Map location={location} onLocationChange={handleLocationChange} />
                </div>
                <Form.Group className="mb-3 centering flex-column" controlId="formBasicFirstName">
                    <Form.Label>First Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter firstname" value={firstName} onChange={e => setFirstName(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3 centering flex-column" controlId="formBasicLastName">
                    <Form.Label>Last Name</Form.Label>
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
       )
    }    
    return (
        <>
        <h1>My Profile</h1>
        <button onClick={handleEditProfile}>Edit Profile</button>
        <h3>My Location</h3>
        <Map location={[props.lat, props.lng]}/>
        <p>First Name: {props.first_name}</p>
        <p>Last Name: {props.last_name}</p>
        <p>Specialization: {props.specialization}</p>
        </>
    )
}