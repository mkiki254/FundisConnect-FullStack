import JobRecord from "./JobRecord"
import { forwardRef } from 'react';

const PrintedJobList = forwardRef(({ acceptedJobs}, ref) => {
    const jobDataElements = acceptedJobs.map(job => {
        return (
            <JobRecord 
            schedule = {job.properties.schedule}
            job_title = {job.properties.job_title}
            customer_id = {job.properties.customer}
            />
        )
    })
    return (
        <div ref={ref} className="joblist">
            <div className="d-flex justify-content-center align-center">
                <div className="logo">
                    <h2>FundisConnect</h2>
                    <p>An artisan just a click away</p>
                </div>
                <div className="heading">
                    <h1>Accepted Job List</h1>
                </div>
            </div>
            <div className="d-flex">
                <h4 className="schedule">Scheduled</h4>
                <h4 className="title">Job Title</h4>
                <h4 className="name">Name</h4>
                <h4 className="phone">Phone</h4>
                <h4 className="email">Email</h4>
            </div>
            {jobDataElements}
        </div>
    )
})

export default PrintedJobList