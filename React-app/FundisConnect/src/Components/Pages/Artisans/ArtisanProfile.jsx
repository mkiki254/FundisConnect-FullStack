import { useState, useEffect, useCallback } from "react";
import { Button, Form, Alert } from 'react-bootstrap'
import Map from '../Map';
import axios from 'axios';

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function ArtisanProfile(){
    const [locate, setLocate] = useState(null)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')
    const [submitted, setSubmitted] = useState(false)
    const [place, setPlace] = useState(null)

    const [data, setData] = useState({
        location: null,
        properties: {
            first_name: "",
            last_name: "",
            specialization: "",
            profile_picture: null,
        }
    })

    const handleFirstNameChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                first_name: e.target.value
            }
        }))
    }

    const handleLastNameChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                last_name: e.target.value
            }
        }))
    }

    const handleSpecializationChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                specialization: e.target.value
            }
        }))
    }

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(position => {
              const { latitude, longitude } = position.coords;
              setLocate([latitude, longitude]);
            });
          }
    }, [])

    const handleLocationChange = useCallback(newLocate => {
        setLocate(newLocate);
    }, []);

    useEffect(() => {
        if(locate){
            setData((prevData) => ({
                ...prevData,
                location: `POINT(${locate[1]} ${locate[0]})`
            }))
        }
    }, [locate])

    const handleImageChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                profile_picture: e.target.files[0]
            }
        }))
    }

    const transformDataToFormData = (data) => {
        const formData = new FormData();
        for (const key in data) {
          if (key === "properties") {
            const properties = data[key];
            for (const propKey in properties) {
              if (propKey === "profile_picture") {
                const file = properties[propKey];
                if (file && file instanceof File){
                    formData.append(propKey, file);
                }
              } else {
                formData.append(propKey, properties[propKey]);
              }
            }
          } else {
            formData.append(key, data[key]);
          }
        }
      
        return formData;
      };      
      

    const formData = transformDataToFormData(data)

    const config = {
        headers: {
          'Content-Type': `multipart/form-data; boundary=${formData._boundary}`,
        },
      };

    function handleSubmit(e){
        e.preventDefault()

        setError(false)
        setSuccess(false)
        // console.log("data:", data)
        // for (const pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }

        client.post("/api/artisan/profile/personal-info/",
        formData, config).then(res => {
                setSuccess(true)
                setSuccessMsg("Your details have been recorded successfully")
                setSubmitted(true)
            }).catch(error => {
                console.log(error.response)
                const msg = error.response.data.join(", ");
                setError(true);
                setErrorMsg(msg);
            })
    }

    if(submitted){
        return(
            <>
            <div className="d-flex justify-content-center align-items-center">
                {success && <Alert variant="success" className="msg-alert">{successMsg}</Alert>}
            </div>
            </>
        )
    }
    return (
        <>
        <h3 className="form-title">Set Profile</h3>
        <Form className="update-profile" onSubmit={e => handleSubmit(e)}>
            <div className="d-flex justify-content-center align-items-center">
                {error && <Alert variant="danger" className="msg-alert">{errorMsg}</Alert>}
                {success && <Alert variant="success" className="msg-alert">{successMsg}</Alert>}
            </div>
            <Form.Group className="mb-3 centering flex-column" controlId="formBasicLocation">
                <Form.Label>Location</Form.Label>
                <div className="d-flex justify-content-center align-items-center">
                    <Map location={locate} onLocationChange={handleLocationChange} />
                </div>                
            </Form.Group>
            <Form.Group className="mb-3 centering flex-column" controlId="formBasicFirstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control type="text" placeholder="Enter firstname" value={data.properties.first_name} onChange={handleFirstNameChange} />
            </Form.Group>

            <Form.Group className="mb-3 centering flex-column" controlId="formBasicLastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control type="text" placeholder="Enter lastname" value={data.properties.last_name} onChange={handleLastNameChange} />
            </Form.Group>

            <Form.Group className="mb-3 centering flex-column" controlId="formBasicSpecialization">
                <Form.Label>Specialization</Form.Label>
                <Form.Select 
                value={data.properties.specialization} 
                onChange={handleSpecializationChange}>
                    <option value="">-- Choose --</option>
                    <option value="plumber">Plumber</option>
                    <option value="electrician">Electrician</option>
                    <option value="carpenter">Carpenter</option>
                    <option value="mason">Mason</option>
                    <option value="tiling">Tiling</option>
                    <option value="painter">Painter</option>
                </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3 centering flex-column" controlId="formBasicProfilePicture">
                <Form.Label>Profile Picture</Form.Label>
                <Form.Control type="file" onChange={handleImageChange} />
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