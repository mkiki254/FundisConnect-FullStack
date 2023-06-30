import { useState, useEffect } from 'react'
import axios from 'axios'
import { useAuthContext } from '../../AuthContext'
import ViewRequests from './JobRequests/ViewRequests'
import "../../../Styles/jobrequests.css"

axios.defaults.xsrfCookieName = 'csrftoken'
axios.defaults.xsrfHeaderName = 'X-CSRFToken'
axios.defaults.withCredentials = true

const client = axios.create({
    baseURL: "http://127.0.0.1:8000"
})


export default function JobRequests(){
    const [jobData, setJobData] = useState([])
    const [allArtisans, setAllArtisans] = useState([])
    const { userDetails } = useAuthContext()

    useEffect(() => {
        client.get("/api/customer/jobrequest/").then(
           res => {
            const dta = res.data.features
            setJobData(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    useEffect(() => {
        client.get("/api/artisan/profile/personal-info/").then(
           res => {
            const dta = res.data.features
            setAllArtisans(dta)
            // console.log(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    const artisan = allArtisans.filter(artisan => {
        if(artisan.properties.user == userDetails.user.user_id){
            return artisan
        }
    })
    // console.log(artisan[0])

    const jobDataElements = artisan && jobData.map(jobs => {
        if(artisan && (jobs.properties.selected_artisan == artisan[0].id)){
            // return jobs
            return (
                <ViewRequests
                schedule = {jobs.properties.schedule} 
                job_title = {jobs.properties.job_title}        
                 />
            )
        }
    })

    // console.log(jobDataElements)

    return (
        <div className="rec-req">
            <h1 className='text-center pg-title'>View Job Requests</h1>
            <div className='d-flex'>
                <h4 className="schedule">Scheduled</h4>
                <h4 className="title">Job Title</h4>
                <h4 className="details">View More Details</h4>
            </div>
            {jobDataElements}
        </div>
    )
}