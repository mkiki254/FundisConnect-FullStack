import { useState, useEffect } from 'react'
import axios from 'axios'
import ViewAccepted from './AcceptedJobs/ViewAccepted'
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
    const [artisanId, setArtisanId] = useState()
    const [acceptedJobs, setAcceptedJobs] = useState([])
    const [reading, setReading] = useState(false)

    useEffect(() => {
        client.get("/api/user/").then(
            res => {
                const user = res.data.user.user_id
                setArtisanId(user)
            }
        )
    },[])

    // console.log(artisanId)

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

    // Remaining with all the job data elements that have been accepted by artisans
    const NewJobDataElements = jobData.filter(job => acceptedJobs.some(pickedJob => pickedJob.job_request_id === job.id));

    // console.log(jobData)
    // console.log(NewJobDataElements)

    const artisan = artisanId && allArtisans.filter(artisan => {
        if(artisan.properties.user == artisanId){
            return artisan
        }
    })

    useEffect(() => {
        let timeoutId;
        
        timeoutId = setTimeout(() => {
            setReading(true)
        }, 1000);
        

        return () => {
            clearTimeout(timeoutId);
        };
    }, [artisan]);
    // console.log(artisan[0])

    const jobDataElements = reading && artisanId && artisan && NewJobDataElements && NewJobDataElements.map(jobs => {
        if(jobs.properties.selected_artisan == artisan[0].id){
            // return jobs
            return (
                <ViewAccepted
                job_id = {jobs.id}
                schedule = {jobs.properties.schedule} 
                job_title = {jobs.properties.job_title}        
                 />
            )
        }
    })

    // const jobDataElements = reading && jobData.map(jobs => {
    //     if(jobs.properties.selected_artisan == artisan[0].id){
    //         // return jobs
    //         return (
    //             <ViewRequests
    //             job_id = {jobs.id}
    //             schedule = {jobs.properties.schedule} 
    //             job_title = {jobs.properties.job_title}        
    //              />
    //         )
    //     }
    // })

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