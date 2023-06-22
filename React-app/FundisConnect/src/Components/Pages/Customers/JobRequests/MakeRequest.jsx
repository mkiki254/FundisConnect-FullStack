import { Button, Form, Row, Col, Alert } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../AuthContext';
import { useState, useEffect, useCallback } from 'react'
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import { Calendar } from 'primereact/calendar';
import Map from '../../Map'
import axios from 'axios'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function MakeRequest(){
    const navigate = useNavigate()
    const { artisanId } = useAuthContext()
    const [locate, setLocate] = useState(null)
    const [error, setError] = useState(false)
    const [success, setSuccess] = useState(false)
    const [errorMsg, setErrorMsg] = useState({})
    const [successMsg, setSuccessMsg] = useState('')
    const [submitted, setSubmitted] = useState(false)

    const [data, setData] = useState({
        location: null,
        properties: {
            job_title: "",
            job_description: "",
            schedule: new Date().toISOString(),
            address: "",
            selected_artisan: "",
            job_photo_video: null
        }
    })

    const handleJobTitleChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                job_title: e.target.value
            }
        }))
    }

    const handleJobDescriptionChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                job_description: e.target.value
            }
        }))
    }

    const handleAddressChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                address: e.target.value
            }
        }))
    }

    const handleScheduleChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                // schedule: e.target.value
                schedule: e.value.toISOString()
            }
        }))
    }

    const handleSelectedArtisanChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                selected_artisan: artisanId
            }
        }))
    }

    useEffect(() => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                selected_artisan: artisanId
            }
        }))
    }, [artisanId])

    const handleLocationChange = useCallback(newLocate => {
        setLocate(newLocate);
    }, []);

    useEffect(() => {
        if(locate){
            setData((prevData) => ({
                ...prevData,
                location: `POINT(${locate.x} ${locate.y})`
            }))
        }
    }, [locate])

    const handleJobPhotoVideoChange = (e) => {
        setData((prevData) => ({
            ...prevData,
            properties: {
                ...prevData.properties,
                job_photo_video: e.target.files[0]
            }
        }))
    }

    const transformDataToFormData = (data) => {
        const formData = new FormData();
        for (const key in data) {
            if (key === "properties") {
            const properties = data[key];
            for (const propKey in properties) {
                if (propKey === "job_photo_video") {
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

        client.post("/api/customer/jobrequest/",
        formData, config).then(res => {
                setSuccess(true)
                setSuccessMsg("Your job request has been submitted successfully")
                setSubmitted(true)
            }).catch(error => {
                if(error.response && error.response.data){
                    const errorResponse = error.response.data

                    const fieldErrors = {}
                    for(const field in errorResponse){
                        if(Array.isArray(errorResponse[field])){
                            fieldErrors[field] = errorResponse[field][0]
                        }
                    }
                    setErrorMsg(fieldErrors)
                }
            })
    }


    // Going back to profiles
    function handleGoBack(){
        navigate("/customer-home")
    }

    // console.log(artisanId)
    // console.log(date)

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
        <h3 className="form-title">Make Request</h3>
        <Form className="request-form" onSubmit={e => handleSubmit(e)}>
            <div className="d-flex justify-content-center align-items-center">
                {error && <Alert variant="danger" className="msg-alert">{errorMsg}</Alert>}
                {success && <Alert variant="success" className="msg-alert">{successMsg}</Alert>}
            </div>
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formBasicJobTitle">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter descriptive title for the job" value={data.properties.job_title} onChange={handleJobTitleChange}></Form.Control>
                        {errorMsg.job_title && <span className="error-msg">{errorMsg.job_title}</span>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhotoVideo">
                        <Form.Label>Job Photo/Video</Form.Label>
                        <Form.Control type="file" onChange={handleJobPhotoVideoChange}></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJobDescription">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control  as="textarea" required type="text" placeholder="Enter Job Description here" value={data.properties.job_description} onChange={handleJobDescriptionChange}></Form.Control>
                        {errorMsg.job_description && <span className="error-msg">{errorMsg.job_description}</span>}
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSchedule">
                        <Form.Label>Schedule</Form.Label>
                        {/* https://primereact.org/calendar/ */}
                        {/* <Calendar className="cal" value={date} onChange={(e) => setDate(e.value)} /> */}
                        <Calendar className="cal" value={data.properties.schedule} onChange={handleScheduleChange} dateFormat='yy-mm-dd' showTime hourFormat='12' />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Name of the building and floor, Road, Area, Town" value={data.properties.address} onChange={handleAddressChange} />
                        {errorMsg.address && <span className="error-msg">{errorMsg.address}</span>}
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formBasicLocation">
                        <Form.Label>Location</Form.Label>
                        <div>
                            {/* <Map location={locate} onLocationChange={handleLocationChange} /> */}
                            <Map location={locate} onLocationChange={handleLocationChange} />
                            {errorMsg.location && <span className="error-msg">{errorMsg.location}</span>}
                        </div>                
                    </Form.Group>
                </Col>
            </Row>
            <div className="centering">
                <Button className="req-btn" variant="primary" type="submit">
                    Submit
                </Button>
                <Button className="req-btn" variant="primary" onClick={handleGoBack}>Go Back</Button>
            </div>
        </Form>
        </>
    )
}