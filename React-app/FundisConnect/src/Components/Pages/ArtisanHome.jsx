import { useState, useEffect } from 'react'
import { Button } from 'react-bootstrap'
import Dashboard from './Artisans/Dashboard'
import ArtisanProfile from './Artisans/ArtisanProfile'
import JobRequests from './Artisans/JobRequests'
import Reports from './Artisans/Reports'

export default function Artisan(){

    const [dashboard, setDashboard] = useState(true)
    const [artisanProfile, setArtisanProfile] = useState(false)
    const [jobrequests, setJobrequests] = useState(false)
    const [reports, setReports] = useState(false)

    function handleDashboard(){
        setDashboard(true)
        setArtisanProfile(false)
        setJobrequests(false)
        setReports(false)
    }

    function handleArtisanProfile(){
        setDashboard(false)
        setArtisanProfile(true)
        setJobrequests(false)
        setReports(false)
    }

    function handleJobrequests(){
        setDashboard(false)
        setArtisanProfile(false)
        setJobrequests(true)
        setReports(false)
    }

    function handleReports(){
        setDashboard(false)
        setArtisanProfile(false)
        setJobrequests(false)
        setReports(true)
    }

    return (
        <>
        <Button className='nav-button' onClick={handleDashboard}>Dash Board</Button>
        <Button className='nav-button' onClick={handleArtisanProfile}>Set Profile</Button>
        <Button className='nav-button' onClick={handleJobrequests}>Job Requests</Button>
        <Button className='nav-button' onClick={handleReports}>Reports</Button>
        {dashboard && <Dashboard />}
        {artisanProfile && <ArtisanProfile />}
        {jobrequests && <JobRequests />}
        {reports && <Reports />}
        </>
    )
}


