import { useAuthContext } from '../../../AuthContext'
import RouteMap from '../../RouteMap'
import { Row, Col, Button } from 'react-bootstrap'
import { useState, useEffect } from 'react'
import axios from 'axios'
import "../../../../Styles/JobRequests.css"
import { useNavigate } from 'react-router-dom'

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})

export default function AcceptedJobDetails(){
    const { jobRequestId } = useAuthContext()
    const [jobDetails, setJobDetails] = useState()
    const [artisanDetails, setArtisanDetails] = useState()
    const [picVid, setPicVid] = useState(null)
    const navigate = useNavigate()
    const [customerData, setCustomerData] = useState();
    const [customerDetails, setCustomerDetails] = useState([]);

    // console.log(jobDetails)
    // console.log(customerData)

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

    useEffect(() => {
        client.get('/api/customer/jobrequest/customer-details/').then((res) => {
          const dta = res.data;
          setCustomerData(dta);
        });
      }, []);

    useEffect(() => {
        if(customerData && jobDetails){
            const cust = customerData.filter((client) => client.user_id === jobDetails.properties.customer);
            setCustomerDetails(cust[0]);
        }
    }, [customerData, jobDetails]);

    // console.log(customerDetails)
    

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
        <div className='job-details'>
            <h1 className='job-details-title'>Accepted Job Details</h1>
            {jobDetails && artisanDetails && customerDetails &&
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
                    <p>Customer Name</p>
                    <h5>{customerDetails.username}</h5>
                    <p>Customer Phone</p>
                    <h5>{customerDetails.phone}</h5>
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
        </div>
    )
}