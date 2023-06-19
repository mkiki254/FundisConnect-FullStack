import { Button, Form, Row, Col } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../../AuthContext';
import { useState, useEffect } from 'react'
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
    const [artisanDataElements, setArtisanDataElements] = useState([])
    const [date, setDate] = useState(new Date())
    const locate = [1.2921, 36.8219]
   
    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/").then(
           res => {
            const dta = res.data.features
            setArtisanDataElements(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [artisanId])

    // Going back to profiles
    function handleGoBack(){
        navigate("/customer-home")
    }

    // Getting data of the selected artisan
    const artisanData = artisanDataElements.filter(artisan => artisan.id==artisanId)
    // console.log(artisanData)
    console.log(date)

    return (
        <>
        <h3 className="form-title">Make Request</h3>
        <Form className="request-form">
            <Row>
                <Col>
                    <Form.Group className="mb-3" controlId="formBasicJobTitle">
                        <Form.Label>Job Title</Form.Label>
                        <Form.Control type="text" placeholder="Enter descriptive title for the job"></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicPhotoVideo">
                        <Form.Label>Job Photo/Video</Form.Label>
                        <Form.Control type="file"></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicJobDescription">
                        <Form.Label>Job Description</Form.Label>
                        <Form.Control  as="textarea" required type="text" placeholder="Enter Job Description here"></Form.Control>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicSchedule">
                        <Form.Label>Schedule</Form.Label>
                        {/* https://primereact.org/calendar/ */}
                        <Calendar className="cal" value={date} onChange={(e) => setDate(e.value)} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicAddress">
                        <Form.Label>Address</Form.Label>
                        <Form.Control type="text" placeholder="Name of the building and floor, Road, Area, Town" />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group className="mb-3" controlId="formBasicLocation">
                        <Form.Label>Location</Form.Label>
                        <div>
                            {/* <Map location={locate} onLocationChange={handleLocationChange} /> */}
                            <Map location={locate} />
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