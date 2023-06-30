import { useAuthContext } from '../../../AuthContext'
import RouteMap from '../../RouteMap'
import { Row, Col } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'

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
    const [picVid, setPicVid] = useState(false)

    // console.log(jobRequestId)
    useEffect(() => {
        client.get(`/api/customer/jobrequest/${jobRequestId}/`).then(
           res => {
            const dta = res.data
            setJobDetails(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    console.log(jobDetails)

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

    return (
        <div>
            <h1>Job Request Details</h1>
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
                {picVid && (<Col></Col>)}
            </Row>)}
        </div>
    )
}