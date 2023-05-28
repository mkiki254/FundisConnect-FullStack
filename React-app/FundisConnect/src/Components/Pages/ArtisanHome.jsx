import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Dashboard from './Artisans/Dashboard'
import UpdateProfile from './Artisans/UpdateProfile'
import JobRequests from './Artisans/JobRequests'
import Reports from './Artisans/Reports'

export default function Artisan(){

    const [dashboard, setDashboard] = useState(true)
    const [updateprofile, setUpdateprofile] = useState(false)
    const [jobrequests, setJobrequests] = useState(false)
    const [reports, setReports] = useState(false)

    function handleDashboard(){
        setDashboard(true)
        setUpdateprofile(false)
        setJobrequests(false)
        setReports(false)
    }

    function handleUpdateprofile(){
        setDashboard(false)
        setUpdateprofile(true)
        setJobrequests(false)
        setReports(false)
    }

    function handleJobrequests(){
        setDashboard(false)
        setUpdateprofile(false)
        setJobrequests(true)
        setReports(false)
    }

    function handleReports(){
        setDashboard(false)
        setUpdateprofile(false)
        setJobrequests(false)
        setReports(true)
    }

    return (
        <>
        <Button className='nav-button' onClick={handleDashboard}>Dash Board</Button>
        <Button className='nav-button' onClick={handleUpdateprofile}>Update Profile</Button>
        <Button className='nav-button' onClick={handleJobrequests}>Job Requests</Button>
        <Button className='nav-button' onClick={handleReports}>Reports</Button>
        {dashboard && <Dashboard />}
        {updateprofile && <UpdateProfile />}
        {jobrequests && <JobRequests />}
        {reports && <Reports />}
        </>
    )
}


