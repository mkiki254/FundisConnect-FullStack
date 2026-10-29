import { useState, useEffect } from 'react'
import client from '@/api'
import ViewRequests from './JobRequests/ViewRequests'
import "../../../Styles/JobRequests.css"



export default function JobRequests(props){
    const [jobData, setJobData] = useState([])
    const [acceptedJobs, setAcceptedJobs] = useState([])
    const artisan_id = props.artisan_id

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
        client.get("/api/payment/results/").then(
           res => {
            const dta = res.data
            setAcceptedJobs(dta)
           }
        ).catch(error => {
            console.log(error)
        })
    }, [])

    // console.log(acceptedJobs)

    // Remaining with all the job data elements that have not been accepted by artisans
    const NewJobDataElements = jobData.filter(job => !acceptedJobs.some(pickedJob => pickedJob.job_request_id === job.id));

    const reversedJobDataElements = [...NewJobDataElements].reverse()

    const jobDataElements = reversedJobDataElements && reversedJobDataElements.map(jobs => {
        if(jobs.properties.selected_artisan == artisan_id){
            // return jobs
            return (
                <ViewRequests
                job_id = {jobs.id}
                schedule = {jobs.properties.schedule} 
                job_title = {jobs.properties.job_title}        
                 />
            )
        }
    })

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


