import { useAuthContext } from '../../../AuthContext'
import RouteMap from '../../RouteMap'
import { Row, Col, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "../../../../Styles/JobRequests.css"
import { useNavigate } from 'react-router-dom'
import JobAccepted from './JobAccepted'
import JobDeclined from './JobDeclined'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function JobRequestDetails(){
    const { jobRequestId } = useAuthContext()
    const [jobDetails, setJobDetails] = useState()
    const [artisanDetails, setArtisanDetails] = useState()
    const [picVid, setPicVid] = useState(null)
    const navigate = useNavigate()
    const [acceptedJob, setAcceptedJob] = useState(false)
    const [declinedJob, setDeclinedJob] = useState(false)

    // console.log(jobRequestId)
    useEffect(() => {
        client.get(`/api/customer/jobrequest/${jobRequestId}/`).then(
           res => {
            const dta = res.data
            setJobDetails(dta)
            
            // Getting the video
            if (dta.properties.job_photo_video) {
                client.get(dta.properties.job_photo_video, { responseType: 'blob' })
                  .then(response => {
                    const videoBlob = response.data;
                    const picVidUrl = URL.createObjectURL(videoBlob);
                    setPicVid(picVidUrl);
                  });
              }              
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    // console.log(jobDetails)
    // console.log(picVid)

    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/detail/").then(
           res => {
            const dta = res.data
            setArtisanDetails(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    // console.log(artisanDetails.geometry.coordinates)

    const isoDateString = jobDetails && jobDetails.properties.schedule
    const dateObject = new Date(isoDateString);

    const formattedDate = dateObject.toLocaleString('en-KE', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

     // Going back to profiles
    function handleGoBack(){
        navigate("/artisan-home")
    }

    function handleAcceptedJob(){
        setAcceptedJob(true)
    }

    function handleDeclinedJob(){
        setDeclinedJob(true)
    }

    if(acceptedJob){
        return(
            <>
            <JobAccepted 
            job_id = {jobRequestId}
            />
            </>
        )
    }
    
    if(declinedJob){
        return(
            <>
            <JobDeclined />
            </>
        )
    }

    return (
        <div className='job-details'>
            <h1 className='job-details-title'>Job Request Details</h1>
            {jobDetails && artisanDetails &&
             (<Row>
                <Col>
                    <p>Job Title</p>
                    <h5>{jobDetails.properties.job_title}</h5>
                    <p>Job Description</p>
                    <h5>{jobDetails.properties.job_description}</h5>
                    <p>Schedule</p>
                    <h5>{formattedDate}</h5>
                    <p>Address</p>
                    <h5>{jobDetails.properties.address}</h5>
                </Col>
                <Col>
                    <RouteMap
                    startLatLng = {artisanDetails.geometry.coordinates}
                    endLatLng = {jobDetails.geometry.coordinates}
                    />
                </Col>
                {picVid && 
                <Col>
                    <p>Picture/Video Description</p>
                    <video controls style={{ maxWidth: '30vw' }}>
                        <source src={picVid} type='video/mp4'/>
                    </video>
                </Col>}
            </Row>)}
            <div className="d-flex justify-content-center">
                    <div className="form-submit">
                        <Button variant="primary" onClick={handleAcceptedJob}>Accept Job</Button>
                        <Button className="req-btn" variant="primary" onClick={handleDeclinedJob}>Decline Job</Button>
                        <Button className="req-btn" variant="primary" onClick={handleGoBack}>Go Back</Button>
                    </div>
                </div>
        </div>
    )
}